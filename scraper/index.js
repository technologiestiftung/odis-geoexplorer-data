async = require("async");
path = require("path");
yargs = require("yargs");

dirName = __dirname;

const { getCKANData } = require("./1_get_ckan_data");
const { parseCKANData } = require("./2_parse_ckan_data");
const { getAttributes } = require("./3_get_attributes");
const { getFisBrokerDescription } = require("./4_get_fisbroker_description");
const { getHtmlInfo } = require("./5_get_html_info");
const { writeMarkdowns } = require("./6_write_markdowns.js");
const { countTokens } = require("./7_count_tokens.js");

async function runScraper() {
  const argv = await yargs.option("update", {
    alias: "u",
    description: "Run update",
    type: "boolean",
  }).argv;

  const RUN_UPDATE = argv.update;
  LIST_DATASETS = RUN_UPDATE
    ? "./scraper/data/datasetsNew.json"
    : "./scraper/data/datasetsAll.json";

  console.log("RUN_UPDATE:  ", RUN_UPDATE);

  // run these functions in order
  async.waterfall(
    [
      // getCKANData,
      // parseCKANData,
      // getAttributes,
      // getFisBrokerDescription,
      // getHtmlInfo,
      writeMarkdowns,
    ],
    function (err, result) {
      console.log("All scraper scripts have run");
    }
  );
}

async function main() {
  await runScraper();
}

main();
