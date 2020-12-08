if (!process.argv[2]) {
  console.log(
    'usage:\n $ node builder.js "`cat perfplanet.html`" "`cat perfplanet.css`" "`cat perfplanet.js`" > index.html',
  );
  process.exit();
}
let folks = [];
try {
  folks = require('./planetarium.json');
} catch (e) {
  console.log(e);
  console.log('error in the JSON data, them damn commas!');
  process.exit();
}

//var cssmin = require('./cssmin');
//var jsmin = require('./jsmin');

var template = process.argv[2],
  css = process.argv[3],
  js = process.argv[4],
  result,
  list = '\n';

folks.sort(function (a, b) {
  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
});
for (var i = 0, fella = folks[0]; i < folks.length; fella = folks[++i]) {
  list += '<li><a href="' + fella.blog + '">' + fella.name + '</a></li>\n';
}

result = template
  .replace(
    /<link rel="stylesheet" href="perfplanet.css" \/>/,
    '<style>' + css + '</style>',
  )
  .replace(
    /<script src="perfplanet.js"><\/script>/,
    '<script>' + js + '</script>',
  )
  .replace(/{generateme}/, list);

console.log(result);
