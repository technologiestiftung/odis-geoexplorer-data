"use strict";
// Get the attributes via DescribeFeatureType
const fs = require("fs");
const path = require("path");
const { fromXML } = require("from-xml");

const fetchWfsAsText = require("./utils/fetchWfsAsText");
const findAllProperties = require("./utils/findAllProperties");

function getElements(data) {
  let sequence = findAllProperties(data, ["xsd:sequence", "sequence"]);
  let els = findAllProperties([sequence], ["xsd:element", "element"]);
  if (!els.length) {
    els = [els];
  }
  let elsNames = [];
  els.forEach((el) => {
    el.forEach((ell) => {
      elsNames.push(ell["@name"]);
    });
  });
  return elsNames;
}

function getAttributes(mainCallback) {
  let ckanData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "data/ckan_data_filtered.json"),
      "utf-8"
    )
  );

  const allGeoData = [];
  async function fetchAndParse(resource) {
    try {
      const wfsUrl = `${resource.serviceURL}?REQUEST=DescribeFeatureType&SERVICE=WFS&VERSION=2.0.0`;
      const wfsAsText = await fetchWfsAsText(wfsUrl);
      const wfsJson = fromXML(wfsAsText);
      const elements = getElements(wfsJson);
      console.log("wfsUrl:", wfsUrl);
      console.log("attributes: ", elements);
      resource.attributes = elements;
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
      resource.attributes = [];
    }
    allGeoData.push(resource);
  }

  async function run() {
    for (const item of ckanData) {
      if (item.type === "WFS") {
        await fetchAndParse(item);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        // Wait for 1000 milliseconds before moving to the next iteration
        item.attributes = [];
        allGeoData.push(item);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    // Write file and call mainCallback after all fetch operations are completed
    fs.writeFile(
      "./data/ckan_data_filtered_attr.json",
      JSON.stringify(allGeoData),
      {
        encoding: "utf8",
      },
      (err) => {
        mainCallback();
      }
    );
  }

  run();
}

module.exports = { getAttributes };
