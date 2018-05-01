import Remarkable from "remarkable";
const md = new Remarkable({
  html: true,
  breaks: true,
  xhtmlOut: true,
  linkify: true,
  typographer: true,
  quotes: "“”‘’"
});

const renderToHTML = data => {
  const post = data;
  let value = post.body;
  let metadata = {};
  const randomId = Math.floor(Math.random() * 1000);
  metadata = post.json_metadata;
  let { image, links, users } = metadata;
  links = links ? links.reverse() : [];
  users = users ? users.reverse() : [];
  image = image ? image.reverse() : [];
  console.log(value);

  const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;
  value.replace(imageRegex, img => {
    if (!image.some(imgI => imgI === img)) {
      image = [img, ...image];
    }
  });

  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  links.forEach((link, i) => {
    value = value.replace(
      new RegExp(escapeRegExp(link), "g"),
      randomId + "-link-" + i + "-"
    );
  });
  users.forEach((user, i) => {
    value = value.replace(
      new RegExp(`[^\/]` + escapeRegExp("@" + user + `[^\/]`), "g"),
      randomId + "-user-" + i + "-"
    );
  });
  image.forEach((img, i) => {
    value = value.replace(
      new RegExp(escapeRegExp(img), "g"),
      randomId + "-img-" + i + "-"
    );
  });
  // value =
  //   value +
  //   '<iframe width="560" height="315" src="https://www.youtube.com/embed/QQPVQFyL0_Y" frameborder="0" encrypted-media" allowfullscreen></iframe>';
  value = value.replace(/<CENTER>/g, "<center>");
  value = value.replace(/<\/CENTER>/g, "</center>");
  // small caps
  value = value.replace(/([A-Z]{2,})/g, "<abbr>$1</abbr>");
  // console.log(value);
  value = md.render(value);
  value = value.replace(/\<img (.+)?src=("|')(.+?)("|').+?\/?>/g, "$3");
  links.forEach((link, i) => {
    value = value.replace(new RegExp(randomId + "-link-" + i + "-", "g"), link);
  });

  const ytRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/g;
  value = value.replace(
    ytRegex,
    '<div class="embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>'
  );

  users.forEach((user, i) => {
    value = value.replace(
      new RegExp(randomId + "-user-" + i + "-", "g"),
      `<a href="https://steemit.com/${user}">@${user}</a>`
    );
  });
  image.forEach((img, i) => {
    value = value.replace(
      new RegExp('([^"])(' + img + ")", "g"),
      `$1<img src="https://steemitimages.com/640x2000/$2" />`
    );
    // value = value.replace(new RegExp('([^"])(' + img + ")", "g"), `$1<img src="https://steemitimages.com/640x2000/$2" />`);
    value = value.replace(
      new RegExp(randomId + "-img-" + i + "-", "g"),
      `<img src="https://steemitimages.com/640x2000/${img}" />`
    );
    value = value.replace(/(<img src=('|")){2,}/, '<img src="');
    value = value.replace(/(\/>('|")>){1,}/, "/>");
  });
  // console.log(value);

  return value;
};

export default renderToHTML;
