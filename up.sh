#!/bin/bash
# perfplanet update script

curl --silent "`cat yql.txt`" >data.json

if [ -e data.json ] && [ -s data.json ]
then
  echo "render(" > data.tmp
  cat data.json >> data.tmp
  echo ");" >> data.tmp
  mv data.tmp data.js
  /usr/bin/php createRss.php 
else
  echo Problem fetching JSON data from YQL 1>&2
fi
