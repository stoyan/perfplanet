<?php
//error_reporting(0);
require_once('simplepie-1.5/autoloader.php');

$blogs = json_decode(file_get_contents(__DIR__ . '/planetarium.json'));

$urls = array();
foreach($blogs as $blog) {
  $urls[] = $blog->feed;
}

$feed = new SimplePie();
$feed->set_feed_url($urls);
$feed->set_cache_location(__DIR__ . '/simplepiecache');
$feed->init();

$date = date("r");
$rssout = <<<EOT
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
%%STUFFS%%
</channel>
</rss>
EOT;

$data = array();
$rss = array();
foreach ($feed->get_items(0, 50) as $item) {
  
  $link = $item->get_permalink();
  if (stristr($link, 'calibreapp') && stristr($link, 'release-notes')) {
    continue;
  }
  
  $authors = array();
  if ($item->get_authors()) {
    foreach($item->get_authors() as $author) {
      $authors[] = $author->get_name();
    }    
  }
  $tags = array();
  if ($item->get_categories()) {
    foreach($item->get_categories() as $tag) {
      $tags[] = $tag->get_term();
    }    
  }
    
  $data[] = array(
    'title' => $item->get_title(),
    'link' => $link,
    'author' => $authors,
    'category' => $tags,
    //'content' => $item->get_content(),
    'description' => substr(strip_tags($item->get_description()), 0, 500) . '...',
    'pubDate' => $item->get_date('Y-m-d'),
  );
  
  if (count($rss) < 10) {
    $rss[] = "<item>\n".
      "<title>" . xmlentities($item->get_title()) . "</title>\n".
      "<link>" . xmlentities($link) . "</link>\n".
      "<guid isPermaLink=\"true\">" . xmlentities($link) . "</guid>\n".
      "<description>" . xmlentities($item->get_description()) . "</description>\n".
      "<pubDate>" . xmlentities($item->get_date()) . "</pubDate>\n".
      "<content:encoded><![CDATA[" . $item->get_content() . "]]></content:encoded>\n".
      "</item>\n";
  }

}

function xmlentities($string) {
  return str_replace(
    array("&", "<", ">", "\"", "'"),
    array("&amp;", "&lt;", "&gt;", "&quot;", "&apos;"),
    $string
  );
}

if (!empty($data)) {
  file_put_contents(__DIR__ . '/../data.js', 'var data = ' . json_encode($data, JSON_INVALID_UTF8_SUBSTITUTE));
  file_put_contents(__DIR__ . '/../rss.xml', str_replace('%%STUFFS%%', implode("\n", $rss), $rssout));
  file_put_contents(
    __DIR__ . '/../../perfplanet.com/feed.js', 
    'var data = ' . json_encode(array_slice($data, 0, 3), JSON_INVALID_UTF8_SUBSTITUTE));
  exit(0);
}
exit(1);
?>