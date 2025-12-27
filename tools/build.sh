node tools/builder.js "`cat perfplanet.html`" "`cat perfplanet.css`" "`cat perfplanet.js`" > index.html
#/usr/local/bin/html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --minify-css true --minify-js true -o index.html index.html
