const fs = require("fs");
const INJECTED_FILENAME = "BASIC.md";
const MARK_BEGIN = "<!-- basic -->";
const MARK_END = "<!-- basicstop -->";

const inject = destFileName => {
  const content = fs.readFileSync(INJECTED_FILENAME).toString();
  let destContent = fs.readFileSync(destFileName).toString();
  destContent = destContent.replace(
    new RegExp(`${MARK_BEGIN}([\r\n\s\S.]*)${MARK_END}`),
    `${MARK_BEGIN}\n${content}\n${MARK_END}`
  );
  fs.writeFileSync(destFileName, destContent);
};

inject("README.md");
inject("DOCUMENT.md");
