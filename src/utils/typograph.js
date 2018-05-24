const typograph = text => {
  return text
    .replace(/([\w])'/g, "$1’")
    .replace(/([\s]{0,})'/g, "$1‘")
    .replace(/([\w])"/g, "$1”")
    .replace(/([\s]{0,})"/g, "$1“");
};

export default typograph;
