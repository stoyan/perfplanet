var pipe = "http://pipes.yahoo.com/pipes/pipe.run?_id=a6cdaf1d9dbe656ba1f0ab714cc3a08e&_render=json&_callback=render&howmany=20";
pipe = "data.js";
var s = document.createElement('script');
s.src = pipe;
document.documentElement.firstChild.appendChild(s);
function render(o) {
  var items = null,
      r = document.getElementById('blogs'),
      i = 0, b = null, cats = [], categories = '',
      html = '', author = '', meta = [];
  r.innerHTML = '';
  try {
    items = o.query.results.item;
  } catch (e) {
    r.innerHTML = "<p>failed to retrieve blog posts, please refresh the page to try again.</p>";
  }
    
  for (i = 0; i < items.length; i++) {
    b = items[i];
    html += '<div class="blogpost"><h2 class="title"><a href="'+ b.link +'">' + (b.title || b['y:title']) + "</a></h2>";
    meta = [];
    author = 'Unknown';
    if (b['dc:creator']) {
      author = b['dc:creator'];
    } else if (b.author && b.author.name){
      author = b.author.name;
    } else if (typeof b.author === "string"){
      author = b.author;
    } else if (typeof b.creator === "string"){
      author = b.creator;
    }
    meta.push('Author: ' + author);
    meta.push('Published: ' + b.pubDate);
    if (b.category) {
      if (typeof b.category.join === 'function') {
        if (b.category[0] && (b.category[0].term || b.category[0].content)) {
          cats = [];
          for (j = 0; j < b.category.length; j++) {
            cats[j] = b.category[j].term || b.category[j].content;
          }
          categories = cats.join(', ');
        } else {
          categories = b.category.join(', ');
        }
      } else {
        categories = b.category;
      }
      meta.push('Filed in: ' + categories);
        
      }
      html += '<ul><li>' + meta.join('</li><li>') + '</li></ul>'; 
      html += b.encoded || b['content:encoded'] || b.description;
      html += '<div class="ornament">&#9734; <b>&#9734;</b> &#9734;</div>';
      html += "</div>";
    }
    
  r.innerHTML = html;
}


