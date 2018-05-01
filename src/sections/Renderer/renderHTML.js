import _ from "lodash";
import classNames from "classnames";
import sanitizeHtml from "sanitize-html";
import Remarkable from "remarkable";
import embedjs from "embedjs";
import { jsonParse } from "../../helpers/formatter";
import sanitizeConfig from "../../vendor/SanitizeConfig";
import { imageRegex, dtubeImageRegex } from "../../helpers/regexHelpers";
import htmlReady from "../../vendor/steemitHtmlReady";
import PostFeedEmbed from "./PostFeedEmbed";
import "./Body.less";

export const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: "“”‘’"
});

const getEmbed = link => {
  const embed = embedjs.get(link, {
    width: "100%",
    height: 400,
    autoplay: false
  });

  if (_.isUndefined(embed)) {
    return {
      provider_name: "",
      thumbnail: "",
      embed: link
    };
  }

  return embed;
};

// Should return text(html) if returnType is text
// Should return Object(React Compatible) if returnType is Object
export function getHtml(
  body,
  jsonMetadata = {},
  returnType = "Object",
  options = {}
) {
  const parsedJsonMetadata = jsonParse(jsonMetadata) || {};
  parsedJsonMetadata.image = parsedJsonMetadata.image || [];

  let parsedBody = body.replace(
    /<!--([\s\S]+?)(-->|$)/g,
    "(html comment removed: $1)"
  );

  parsedBody = parsedBody.replace(/^\s+</gm, "<");

  parsedBody.replace(imageRegex, img => {
    if (
      _.filter(parsedJsonMetadata.image, i => i.indexOf(img) !== -1).length ===
      0
    ) {
      parsedJsonMetadata.image.push(img);
    }
  });

  const htmlReadyOptions = {
    mutate: true,
    resolveIframe: returnType === "text"
  };
  parsedBody = remarkable.render(parsedBody);
  parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;
  parsedBody = parsedBody.replace(dtubeImageRegex, "");
  parsedBody = sanitizeHtml(parsedBody, sanitizeConfig({}));

  return parsedBody;
}

export default Body;
const renderHTML = () => {};
