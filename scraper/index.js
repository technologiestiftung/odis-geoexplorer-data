async = require("async");
path = require("path");
dirName = __dirname;

const { getCKANData } = require("./1_get_ckan_data");
const { parseCKANData } = require("./2_parse_ckan_data");
const { getAttributes } = require("./3_get_attributes");
const { getFisBrokerDescription } = require("./4_get_fisbroker_description");
const { getHtmlInfo } = require("./5_getHtmlInfo");

// run these functions in order
async.waterfall([getHtmlInfo], function (err, result) {
  console.log("FINAL doneddd");
});
