var pipe = 'data.js';
var s = document.createElement('script');
s.src = pipe;
document.documentElement.firstChild.appendChild(s);
s.onload = function render(o) {
  var items = null,
    r = document.getElementById('blogs'),
    i = 0,
    b = null,
    cats = [],
    categories = '',
    html = '',
    author = '',
    meta = [];
  r.innerHTML = '';
  try {
    items = data;
  } catch (e) {
    r.innerHTML =
      '<p>failed to retrieve blog posts, please refresh the page to try again.</p>';
  }

  for (i = 0; i < items.length; i++) {
    b = items[i];
    html +=
      '<div class="blogpost"><h2 class="title"><a href="' +
      b.link +
      '">' +
      (b.title || b['y:title']) +
      '</a></h2>';
    meta = [];
    var a = document.createElement('a');
    a.href = b.link;
    meta.push('From: ' + a.hostname);
    author = '';
    if (b['dc:creator']) {
      author = b['dc:creator'];
    } else if (b.author && b.author.name) {
      author = b.author.name;
    } else if (typeof b.author === 'string') {
      author = b.author;
    } else if (typeof b.creator === 'string') {
      author = b.creator;
    } else if (b.author && typeof b.author.join === 'function') {
      author = b.author.join(', ');
    }
    if (author) {
      meta.push('Author: ' + author);
    }
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
      if (categories) {
        meta.push('Filed in: ' + categories);
      }
    }

    html += '<ul><li>' + meta.join('</li><li>') + '</li></ul>';
    html += b.description;
    html += '<div class="sharing">';
    html +=
      '<a target="_blank" href="https://twitter.com/intent/tweet?via=perfplanet&url=' +
      encodeURIComponent(b.link) +
      '">Tweet</a>';
    html +=
      '<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' +
      encodeURIComponent(b.link) +
      '">Facebook</a>';
    if (navigator.clipboard) {
      html += '<a href="javascript:navigator.clipboard.writeText(\''+encodeURIComponent(b.link)+'\')">Copy URL</a>';
    }
    html += '</div>';
    html += '<div class="ornament">&#9734; <b>&#9734;</b> &#9734;</div>';
    html += '</div>';
  }

  r.innerHTML = html;
};
