<?php
/*
  Create rss.xml from data.json

  If any problems reading JSON, don't overwrite existing rss.xml
*/

define("INFILE", "data.json");
define("OUTFILE", "rss.xml");

try {
    $json = file_get_contents(INFILE);
    if ($json === FALSE) {
        throw new Exception("Can't open input file");
    }
    $data = json_decode($json);
    if ($data === NULL) {
        throw new Exception("JSON parsing problem");
    }
    $date = date("r"); // RFC_2822

    $rss = <<<"EOT"
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Planet Performance</title>
<link>http://perfplanet.com/</link>
<description>News and views from the web performance blogosphere</description>
<language>en-us</language>
<pubDate>$date</pubDate>
<lastBuildDate>$date</lastBuildDate>
<atom:link href="http://perfplanet.com/rss.xml" rel="self" type="application/rss+xml" />
EOT;

    foreach ($data->query->results->item as $item) {
        $rss .= "<item>\n";
        $rss .= "<title>" . xmlentities($item->title) . "</title>\n";
        $rss .= "<link>" . xmlentities($item->link) . "</link>\n";
        $rss .= "<guid isPermaLink=\"true\">" . xmlentities($item->link) . "</guid>\n";
        $rss .= "<description>" . xmlentities($item->description) . "</description>\n";
        $rss .= "<pubDate>" . xmlentities($item->pubDate) . "</pubDate>\n";
        $rss .= "<content:encoded><![CDATA[" . $item->encoded . "]]></content:encoded>\n";
        $rss .= "</item>\n";
    }

    $rss .= <<<"EOT"
</channel>
</rss>
EOT;

    file_put_contents(OUTFILE, $rss);

} catch (Exception $e) {
    die ("Error creating RSS feed: " . $e->getMessage() . "\n");

}

function xmlentities($string) {
    return str_replace(array("&", "<", ">", "\"", "'"),
        array("&amp;", "&lt;", "&gt;", "&quot;", "&apos;"), $string);
}
