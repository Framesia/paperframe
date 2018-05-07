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
