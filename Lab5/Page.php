<?php
    class Page {
        private $page;
        private $title;
        private $year;
        private $copyright;
        public function Page($title, $year, $copyright){ //constructor
            $this->page = '';
            $this->title = $title;
            $this->year = $year;
            $this->copyright = $copyright;
            
            $this->addHeader(); // add header of the page at the initial
        }
        private function addHeader() { //add header of the page
            $this->page .= <<<HEAD
                    <html>
                        <head><title>$this->title</title></head>
                        <body>
                            <h1 align="center">$this->title</h1>
                    HEAD;
        }
        public function addContent($content) { // add content of the page
            $this->page .= $content;
        }
        private function addFooter(){ // add footer of the page
            $this->page .= <<<FOOT
                    <div align="center">&copy; $this->year $this->copyright</div>
                    </body>
                    </html>
                    FOOT;
        }
        public function get(){ // get the content of the page
            $pageWithoutFooter = $this->page; // keep a temporary page without footer for calling get many times
            
            $this->addFooter(); // add footer to this page
            
            $page = $this->page; // new page = page with footer
            $this->page = $pageWithoutFooter; // this page = page without footer for calling get many times
            
            return $page; // return page with footer
        }
    }
?>