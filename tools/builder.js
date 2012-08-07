if (!arguments[0]) {
    print('usage:\n $ jsc builder.js -- html "`cat perfplanet.html`" "`cat perfplanet.css`" "`cat perfplanet.js`" > index.html');
    print('or');
    print('usage:\n $ jsc builder.js -- curl > up.sh');
    quit();
}

try {
  load('planetarium.json');
} catch (e) {
  print('error in the JSON data, them damn commas!');
  quit();
}


if (arguments[0] === 'html') {

  var template = arguments[1],
      css = arguments[2],
      js = arguments[3],
      result,
      list = '\n';

  load('cssmin.js');
  load('jsmin.js');

  folks.sort(function(a, b) {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  });
  for(var i = 0, fella = folks[0]; i < folks.length; fella = folks[++i]) {
    list += '<li><a href="' + fella.blog + '">'+ fella.name +'</a></li>\n'; 
  }

  result = template.
    replace(
      /<link rel="stylesheet" href="perfplanet.css">/, 
      "<style>" + YAHOO.compressor.cssmin(css) + "</style>"
    ).
    replace(
      /<script src="perfplanet.js"><\/script>/,
      "<script>" + jsmin(js) + "</script>"
    ).
    replace(
      /{generateme}/,
      list
    );

  print(result);
} else {

  var list = [];
  for(var i = 0; i < folks.length; i++) {
    list.push('"' + folks[i].feed + '"'); 
  }
  var yql = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%20in%20(' + encodeURIComponent(list.join(',')) + ')' +
            '%20%7C%20sort(field%3D%22pubDate%22%2C%20descending%3D%22true%22)%20%7C%20unique(field%3D%22link%22)%20%7C%20truncate(count%3D20)' +
            '&format=json';
  print(yql);
}