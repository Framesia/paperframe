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

  const sortByLength = (a, b) => b.length - a.length;
  links = links ? links.sort(sortByLength) : [];
  users = users ? users.sort(sortByLength) : [];
  image = image ? image : [];

  console.log(users);

  // get images from stringbody that no exist in image[]
  // and add it to image[]
  const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))(\?[-a-zA-Z0-9=&]+)?/gi;
  value.replace(imageRegex, img => {
    if (!image.some(imgI => imgI === img)) {
      image = [img, ...image];
    }
  });

  image = image.sort(sortByLength);

  // replace link, user and image with uniqueId represent by each type
  // for example: link to 235-link-0-, image to 235-img-0-
  // the purpose is, for enabling typographer and autolink markdown
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  links.forEach((link, i) => {
    value = value.replace(
      new RegExp(escapeRegExp(link), "gi"),
      randomId + "-link-" + i + "-"
    );
  });
  users.forEach((user, i) => {
    value = value.replace(
      new RegExp("([^/])" + "@" + user + "([^/])", "gi"),
      "$1" + randomId + "-user-" + i + "-" + "$2"
    );
  });
  image.forEach((img, i) => {
    value = value.replace(
      new RegExp(escapeRegExp(img), "gi"),
      randomId + "-img-" + i + "-"
    );
  });

  console.log(value);

  value = value.replace(/<center>/gi, "<center>");
  value = value.replace(/<\/center>/gi, "</center>");

  // small caps
  value = value.replace(/([A-Z]{2,})/g, "<abbr>$1</abbr>");

  // remarkable markdown render
  value = md.render(value);

  // replace img tag with it's src
  value = value.replace(/\<img (.+)?src=("|')(.+?)("|').+?\/?>/g, "$3");

  // after markdown render
  // replace back 235-[type]-0 with the link, image, and user
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

  const imageSizes = post.imageSizes.sort(
    (a, b) => b.img.length - a.img.length
  );

  image.forEach((img, i) => {
    const imageSize = imageSizes[i] || { w: 0, h: 0 };
    console.log(imageSize);
    let width = imageSize.w;
    let height = imageSize.h;
    let isWide = false;
    const aspectRatio = height / width ? height / width : 0;
    if (width >= 960) {
      height = Math.round(height / width * 960);
      width = 960;
      isWide = true;
    } else if (width >= 620) {
      height = Math.round(height / width * 620);
      width = 620;
    }

    value = value.replace(
      new RegExp('([^"/])(' + escapeRegExp(img) + ")", "g"),
      `$1<figure
          class="${isWide ? "is-wide" : ""}"
          style="height:${height ? height + "px" : "auto"}"
        >
        <img src="https://steemitimages.com/${width}x${height}/$2"
          width="${width || "auto"}"
          height="${height || "auto"}"
        />
      </figure>`
    );
    value = value.replace(
      new RegExp(randomId + "-img-" + i + "-", "g"),
      `<figure
        class="${isWide ? "is-wide" : ""}"
        style="height:${height ? height + "px" : "auto"}"
      >
      <img src="https://steemitimages.com/${width}x${height}/${img}"
        width="${width || "auto"}"
        height="${height || "auto"}"
      />
      </figure>`
    );
    value = value.replace(/(<img src=('|")){2,}/, '<img src="');
    value = value.replace(/(\/>('|")>){1,}/, "/>");
  });
  return value;
};

export default renderToHTML;
