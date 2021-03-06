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

  value = value.replace(/<([a-z+])>/gi, "<$1>");
  value = value.replace(/<\/([a-z+])>/gi, "</$1>");

  // small caps
  // value = value.replace(
  //   /([^a-zA-Z0-9])([A-Z\.]{2,})([^a-zA-Z0-9])/g,
  //   "$1<abbr>$2</abbr>$3"
  // );

  // remarkable markdown render
  value = md.render(value);

  // replace img tag with it's src
  value = value.replace(/\<img (.+)?src=("|')(.+?)("|').+?\/?>/g, "$3");

  // after markdown render
  // replace back 235-[type]-0 with the link, image, and user
  links.forEach((link, i) => {
    value = value.replace(new RegExp(randomId + "-link-" + i + "-", "g"), link);
  });

  users.forEach((user, i) => {
    value = value.replace(
      new RegExp(randomId + "-user-" + i + "-", "g"),
      `<a href="https://framesia.com/@${user}">@${user}</a>`
    );
  });

  const imageSizes = post.imageSizes.sort(
    (a, b) => b.img.length - a.img.length
  );

  image.forEach((img, i) => {
    const imageSize = imageSizes.find(item => item.img === img) || {
      w: 0,
      h: 0
    };
    // console.log(imageSize);
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

    let isGif = false;
    const imgSplit = img.split(".");
    if (imgSplit.length) {
      if (imgSplit[imgSplit.length - 1] === "gif") {
        isGif = true;
      }
    }

    const imgElString = () => `<figure
        class="${isWide ? "is-wide" : ""}"
        style="
          max-width:${width ? width + "px" : "100%"};"
          max-height:${height ? height + "px" : "300px"};
      >
        <div class="fill" style="padding-bottom:${
          aspectRatio !== 0 ? aspectRatio * 100 : 50
        }%"></div>
        <img
          class="small"
          src="https://steemitimages.com/20x20/${img}"
          onload="this.classList.add('loaded')"
        />
        <img
          class="original"
          src="https://steemitimages.com/${isGif ? 0 : width}x${
      isGif ? 0 : height
    }/${img}"
          onload="this.classList.add('loaded')"
        />
      </figure>`;

    value = value.replace(
      new RegExp('([^"/])(' + escapeRegExp(img) + ")", "g"),
      `$1${imgElString()}`
    );
    value = value.replace(
      new RegExp(randomId + "-img-" + i + "-", "g"),
      imgElString()
    );
    value = value.replace(/(<img src=('|"))<figure/g, "<figure");
    value = value.replace(/(<\/figure>('|")>)/g, "</figure>");
  });

  // Hanging quote
  value = value.replace(
    /<(p|h[1-6]|blockquote)>("|“)/g,
    '<$1><span class="hanging-double"></span>“'
  );
  value = value.replace(
    /<(p|h[1-6]|blockquote)>('|‘)/g,
    "<$1><span class='hanging-single'></span>‘"
  );

  // replace links steemit and busy
  // value = value.replace(
  //   /https?:\/\/(steemit\.com|busy\.org)/g,
  //   "https://framesia.com"
  // );

  // value = value.replace(
  //   /<pre><code>('|‘)/g,
  //   "<$1><span class='hanging-single'></span>‘"
  // );
  return value;
};

export default renderToHTML;
