<?php

/**
 * Browser-runtime compatibility for the legacy database exercises.
 * The original lab files stay unchanged; their MySQL/PEAR calls are routed
 * to persistent SQLite databases inside the WebAssembly filesystem.
 */

class CourseDatabaseError
{
    private $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function getMessage()
    {
        return $this->message;
    }
}

class CourseDatabaseResult
{
    private $rows = array();
    private $index = 0;

    public function __construct($result)
    {
        while (($row = $result->fetchArray(SQLITE3_NUM)) !== false) {
            $this->rows[] = $row;
        }
        $result->finalize();
    }

    public function fetchRow()
    {
        if ($this->index >= count($this->rows)) {
            return false;
        }
        return $this->rows[$this->index++];
    }
}

class CourseDatabaseConnection
{
    private $database;
    private $lastError = '';

    public function selectDatabase($name)
    {
        $safeName = preg_replace('/[^a-z0-9_.-]/i', '_', $name);
        $directory = '/tmp/course-databases';
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }
        $this->database = new SQLite3($directory . '/' . $safeName . '.sqlite');
        $this->database->busyTimeout(2000);
        $this->initializeSchema($safeName);
        return true;
    }

    public function query($sql)
    {
        if (!$this->database) {
            $this->lastError = 'No database was selected.';
            return false;
        }

        $sql = trim($sql);
        if (preg_match('/^create\s+table\s+products\b/i', $sql)) {
            return $this->database->exec(
                'CREATE TABLE IF NOT EXISTS Products (' .
                'ProductID INTEGER PRIMARY KEY AUTOINCREMENT, ' .
                'Product_desc TEXT, Cost INTEGER, Weight INTEGER, Numb INTEGER)'
            );
        }

        if (preg_match('/^insert\s+into\s+products\s+values\s*\(\s*[\'\"]?0[\'\"]?\s*,/i', $sql)) {
            $sql = preg_replace(
                '/^(insert\s+into\s+products\s+values\s*\()\s*[\'\"]?0[\'\"]?\s*,/i',
                '$1NULL,',
                $sql
            );
        }

        if (preg_match('/^(select|pragma|with)\b/i', $sql)) {
            $result = @$this->database->query($sql);
            if ($result === false) {
                $this->lastError = $this->database->lastErrorMsg();
                return false;
            }
            return new CourseDatabaseResult($result);
        }

        $success = @$this->database->exec($sql);
        if (!$success) {
            $this->lastError = $this->database->lastErrorMsg();
        }
        return $success;
    }

    public function quote($value)
    {
        if ($value === null) {
            return 'NULL';
        }
        return "'" . SQLite3::escapeString((string) $value) . "'";
    }

    public function getMessage()
    {
        return $this->lastError ?: 'Browser database connection error.';
    }

    public function close()
    {
        if ($this->database) {
            $this->database->close();
            $this->database = null;
        }
        return true;
    }

    private function initializeSchema($name)
    {
        if (strtolower($name) === 'sale') {
            $this->database->exec(
                'CREATE TABLE IF NOT EXISTS Products (' .
                'ProductID INTEGER PRIMARY KEY AUTOINCREMENT, ' .
                'Product_desc TEXT, Cost INTEGER, Weight INTEGER, Numb INTEGER)'
            );
            return;
        }

        if (strtolower($name) !== 'business_service') {
            return;
        }

        $this->database->exec(
            'CREATE TABLE IF NOT EXISTS categories (' .
            'categoriesid TEXT PRIMARY KEY, title TEXT, description TEXT)'
        );
        $this->database->exec(
            'CREATE TABLE IF NOT EXISTS businesses (' .
            'businessid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, ' .
            'city TEXT, telephone TEXT, url TEXT)'
        );
        $this->database->exec(
            'CREATE TABLE IF NOT EXISTS biz_categories (' .
            'businessid INTEGER, categoryid TEXT)'
        );

        $count = $this->database->querySingle('SELECT COUNT(*) FROM categories');
        if ((int) $count === 0) {
            $this->database->exec(
                "INSERT INTO categories VALUES " .
                "('1','Automotive','Vehicle sales and services')," .
                "('2','Dining','Restaurants and food services')," .
                "('3','Technology','Computers and web services')"
            );
        }

        $businessCount = $this->database->querySingle('SELECT COUNT(*) FROM businesses');
        if ((int) $businessCount === 0) {
            $this->database->exec(
                "INSERT INTO businesses (name,address,city,telephone,url) VALUES " .
                "('Hanoi Web Studio','1 Dai Co Viet','Hanoi','024-000-0001','https://example.com')," .
                "('Campus Cafe','2 Tran Dai Nghia','Hanoi','024-000-0002','https://example.com')"
            );
            $this->database->exec("INSERT INTO biz_categories VALUES (1,'3'),(2,'2')");
        }
    }
}

function course_mysqli_connect($host = null, $username = null, $password = null)
{
    return new CourseDatabaseConnection();
}

function course_mysqli_select_db($connection, $database)
{
    return $connection instanceof CourseDatabaseConnection
        ? $connection->selectDatabase($database)
        : false;
}

function course_mysqli_query($connection, $sql)
{
    return $connection instanceof CourseDatabaseConnection
        ? $connection->query($sql)
        : false;
}

function course_mysqli_fetch_row($result)
{
    return $result instanceof CourseDatabaseResult ? $result->fetchRow() : false;
}

function course_mysqli_close($connection)
{
    return $connection instanceof CourseDatabaseConnection ? $connection->close() : false;
}

class CoursePreparedQuery
{
    public $sql;

    public function __construct($sql)
    {
        $this->sql = $sql;
    }
}

class CoursePearConnection
{
    private $connection;

    public function __construct($database)
    {
        $this->connection = course_mysqli_connect();
        $this->connection->selectDatabase($database);
    }

    public function query($sql)
    {
        $result = $this->connection->query($sql);
        return $result === false ? new CourseDatabaseError($this->connection->getMessage()) : $result;
    }

    public function prepare($sql)
    {
        return new CoursePreparedQuery($sql);
    }

    public function execute($prepared, $parameters)
    {
        if (!($prepared instanceof CoursePreparedQuery)) {
            return new CourseDatabaseError('Invalid prepared query.');
        }
        $sql = $prepared->sql;
        foreach ($parameters as $parameter) {
            $sql = preg_replace('/\?/', $this->connection->quote($parameter), $sql, 1);
        }
        return $this->query($sql);
    }

    public function getOne($sql)
    {
        $result = $this->query($sql);
        if ($result instanceof CourseDatabaseError) {
            return $result;
        }
        $row = $result->fetchRow();
        return $row ? $row[0] : null;
    }

    public function commit()
    {
        return true;
    }

    public function getMessage()
    {
        return $this->connection->getMessage();
    }
}

class DB
{
    public static function connect($dsn)
    {
        $path = parse_url($dsn, PHP_URL_PATH);
        $database = trim((string) $path, '/');
        return new CoursePearConnection($database ?: 'business_service');
    }

    public static function isError($value)
    {
        return $value instanceof CourseDatabaseError;
    }
}
