import render from "./renderToHTML";

const DATA = {
  body: "",
  json_metadata: {
    links: [],
    users: [],
    image: []
  },
  imageSizes: []
};

it("convert markdown to html", () => {
  DATA.body = "# Heading\n\n**bold**";
  expect(render(DATA).trim()).toEqual(
    "<h1>Heading</h1>\n<p><strong>bold</strong></p>"
  );
});
it("mixed markdown with html", () => {
  DATA.body = "<center>Heading **bold**</center>";
  expect(render(DATA).trim()).toEqual(
    "<p><center>Heading <strong>bold</strong></center></p>"
  );
});

it("linkify without link metadata", () => {
  const link = "http://google.com";
  DATA.body = `post with link ${link}`;
  // DATA.json_metadata.links = [link];
  expect(render(DATA).trim()).toEqual(
    `<p>post with link <a href="${link}">${link}</a></p>`
  );
});
it("linkify with link metadata inside a href", () => {
  const link = "http://google.com";
  DATA.body = `post with link <a href="${link}">${link}</a>`;
  // DATA.json_metadata.links = [link];
  expect(render(DATA).trim()).toEqual(
    `<p>post with link <a href="${link}">${link}</a></p>`
  );
});

it("linkify with link metadata without a href", () => {
  const link = "http://google.com";
  DATA.body = `post with link ${link}`;
  // DATA.json_metadata.links = [link];
  expect(render(DATA).trim()).toEqual(
    `<p>post with link <a href="${link}">${link}</a></p>`
  );
});

it("user auto-link to framesia/@user", () => {
  const user = "steem";
  DATA.body = `post with user @${user}.`;
  DATA.json_metadata.users = [user];
  expect(render(DATA).trim()).toEqual(
    `<p>post with user <a href=\"https://framesia.com/@steem\">@steem</a>.</p>`
  );
});

it("image ", () => {
  const image = "http://example.com/test.jpg";
  DATA.body = `post with image ${image}`;
  // DATA.json_metadata.links = [link];
  DATA.imageSizes = [{ w: 300, h: 200, img: image }];
  expect(render(DATA).trim()).toEqual(
    `<p>post with image <figure
        class=\"\"
        style=\"
          max-width:300px;\"
          max-height:200px;
      >
        <div class=\"fill\" style=\"padding-bottom:66.66666666666666%\"></div>
        <img
          class=\"small\"
          src=\"https://steemitimages.com/20x20/http://example.com/test.jpg\"
          onload=\"this.classList.add('loaded')\"
        />
        <img
          class=\"original\"
          src=\"https://steemitimages.com/300x200/http://example.com/test.jpg\"
          onload=\"this.classList.add('loaded')\"
        />
      </figure></p>`
  );
});
