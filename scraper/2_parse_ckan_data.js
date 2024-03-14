"use strict";
const fs = require("fs");

function removeParametersFromURL(url) {
  const urlObject = new URL(url);
  urlObject.search = "";
  return urlObject.toString();
}

function parseCKANData(mainCallback) {
  console.log("2. parseCKANData ...");

  let ckanData = JSON.parse(
    fs.readFileSync(path.join(dirName, "data/ckan_data.json"), "utf-8")
  );

  const allGeoData = [];
  ckanData.map((item) => {
    let geoResource;
    let geoData = {};
    item.resources.forEach(function (resource) {
      if (
        (resource.url.includes("REQUEST=GetCapabilities&SERVICE=wms") ||
          resource.url.includes("REQUEST=GetCapabilities&SERVICE=wfs")) &&
        (resource.format === "WFS" || resource.format === "WMS")
      ) {
        geoResource = resource;
      }
    });

    if (!geoResource) return;

    geoData.title = item.title;
    geoData.serviceURL = removeParametersFromURL(geoResource.url);
    geoData.type = geoResource.format;
    geoData.name = item.name;
    geoData.tags = item.tags.map((d) => {
      return d.name;
    });
    geoData.notes = item.notes;
    geoData.url = item.url;
    geoData.author = item.author;
    item.resources.forEach(function (resource) {
      if (resource.format === "PDF") {
        geoData.pdf = resource.url;
      }
    });
    item.resources.forEach(function (resource) {
      if (
        resource.format === "HTML" &&
        resource.description === "Technische Beschreibung"
      ) {
        geoData.techHtml = resource.url;
      }
    });

    allGeoData.push(geoData);
  });

  console.log("Amount of datasets: ", allGeoData.length);

  fs.writeFile(
    "./data/ckan_data_filtered.json",
    JSON.stringify(allGeoData),
    {
      encoding: "utf8",
    },
    (err) => {
      mainCallback();
    }
  );
}

module.exports = { parseCKANData };
