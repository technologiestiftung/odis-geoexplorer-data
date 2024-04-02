"use strict";
const fs = require("fs");
const { getEncoding, encodingForModel } = require("js-tiktoken");

function countTokens(mainCallback) {
  console.log("Checking if token length is exceeded...");

  let listDatasets = JSON.parse(fs.readFileSync(LIST_DATASETS));
  const enc = getEncoding("cl100k_base");
  let status = "all good";

  for (const datasetName of listDatasets) {
    // console.log(datasetName);
    // try {
    let markdownDescription = fs.readFileSync(
      `./data/markdowns/${datasetName}.mdx`,
      "utf8"
    );

    const tokenLength = enc.encode(markdownDescription);

    // console.log("tokenLength: ", tokenLength.length);
    if (tokenLength > 8191) {
      console.log("!! tokenLength exceeded: ", tokenLength);
      status = " file(s) too long";
    }
    // } catch (error) {
    //   // console.error("Error fetching or parsing data:", error);
    // }
  }
  console.log("token length checked: " + status);

  mainCallback();
}

module.exports = { countTokens };
