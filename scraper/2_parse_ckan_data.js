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
    fs.readFileSync(path.join(dirName, "/data/ckan_data.json"), "utf-8")
  );

  const newDatasets = [];
  const allDatasets = [];
  ckanData.map((item) => {
    let geoResource;
    let geoData = {};
    // get only WFS and WMS
    item.resources.forEach(function (resource) {
      if (
        (resource.url
          .toLowerCase()
          .includes("REQUEST=GetCapabilities&SERVICE=wms".toLowerCase()) ||
          resource.url
            .toLowerCase()
            .includes("REQUEST=GetCapabilities&SERVICE=wfs".toLowerCase())) &&
        (resource.format === "WFS" || resource.format === "WMS")
      ) {
        geoResource = resource;
      }
    });

    if (!geoResource) return;

    // get the metadata about the geo data
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
      if (
        resource.format === "HTML" &&
        resource.description === "Technische Beschreibung"
      ) {
        geoData.techHtml = resource.url;
      }
    });

    const existingFiles = fs.readFileSync(
      path.join(dirName, "data/datasetsAll.json"),
      "utf-8"
    );

    if (!existingFiles.includes(geoData.name)) {
      newDatasets.push(geoData.name);
    }

    // check if the dataset has a folder
    // if not add one and write file
    const filePath = `./scraper/data/datasets/${geoData.name}`;
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
      fs.writeFileSync(filePath + "/ckan.json", JSON.stringify(geoData));
    }
    allDatasets.push(geoData.name);
  });

  console.log("Amount of new datasets: ", newDatasets.length);
  console.log("Amount of all datasets: ", allDatasets.length);

  fs.writeFile(
    "./scraper/data/datasetsNew.json",
    JSON.stringify(newDatasets),
    {
      encoding: "utf8",
    },
    (err) => {
      fs.writeFile(
        "./data/datasetsAll.json",
        JSON.stringify(allDatasets),
        {
          encoding: "utf8",
        },
        (err) => {
          mainCallback();
        }
      );
    }
  );
}

module.exports = { parseCKANData };
