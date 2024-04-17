async = require("async");
path = require("path");
dirName = __dirname;

const RUN_UPDATE = true;
LIST_DATASETS = RUN_UPDATE
  ? "./data/datasetsNew.json"
  : "./data/datasetsAll.json";

const { getCKANData } = require("./1_get_ckan_data");
const { parseCKANData } = require("./2_parse_ckan_data");
const { getAttributes } = require("./3_get_attributes");
const { getFisBrokerDescription } = require("./4_get_fisbroker_description");
const { getHtmlInfo } = require("./5_get_html_info");
const { writeMarkdowns } = require("./6_write_markdowns.js");
const { countTokens } = require("./7_count_tokens.js");

// run these functions in order
async.waterfall(
  [
    // getCKANData,
    // parseCKANData,
    // getAttributes,
    // getFisBrokerDescription,
    getHtmlInfo,
    // writeMarkdowns,
  ],
  function (err, result) {
    console.log("All scraper scripts have run");
  }
);
