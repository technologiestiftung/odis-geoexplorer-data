"use strict";
// Get the attributes via DescribeFeatureType
const fs = require("fs");
const { fromXML } = require("from-xml");

const fetchWfsAsText = require("./utils/fetchWfsAsText");
const findAllProperties = require("./utils/findAllProperties");
const findAllObject = require("./utils/findAllObject");
const errorList = [];

// xsd:element name=
async function getElements(resource, data) {
  let complexTypes = findAllProperties(data, [
    "xsd:complexType",
    "complexType",
  ]);

  let wfsLayersWithAttr = [];
  if (complexTypes[0].length) {
    console.log("MULTI LAYER");
    complexTypes = complexTypes[0];
    // the wfs has multiple layers - get the Titles for GetCapabilities
    //
    const getCapabilitiesURL = `${resource.serviceURL}?SERVICE=WFS&REQUEST=GetCapabilities&ACCEPTVERSIONS=2.0.0,1.1.0,1.0.0`;
    const getCapabilitiesAsText = await fetchWfsAsText(getCapabilitiesURL);
    const getCapabilitiesAsJSON = fromXML(getCapabilitiesAsText);
    let featureType = findAllProperties(getCapabilitiesAsJSON, ["FeatureType"]);
    let featureTypeName = findAllProperties(featureType, ["Name"]);
    let featureTypeNameNoBase = featureTypeName.map((d) => {
      return d.split(":")[1];
    });
    let featureTypeTitle = findAllProperties(featureType, ["Title"]);

    const capaHelper = {};
    featureTypeNameNoBase.forEach((d, i) => {
      capaHelper[d] = {
        title: featureTypeTitle[i],
        name: featureTypeName[i],
      };
    });

    complexTypes.forEach((cT, i) => {
      const layerNameNoType = cT["@name"].replace("Type", "");
      let sequence = findAllProperties(cT, ["xsd:sequence", "sequence"]);
      let els = findAllProperties([sequence], ["xsd:element", "element"]);
      let attrNames = findAllProperties([els], ["@name", "name"]);

      wfsLayersWithAttr.push({
        title: capaHelper[layerNameNoType].title,
        attributes: attrNames,
        typeName: capaHelper[layerNameNoType].name,
      });
    });
  } else {
    console.log("SINGLE LAYER");

    let xsdElement = findAllObject(data, ["@substitutionGroup"]);
    let xsdElementType = findAllProperties(xsdElement, ["@type"])[0];
    let sequence = findAllProperties(complexTypes, [
      "xsd:sequence",
      "sequence",
    ]);
    let els = findAllProperties([sequence], ["xsd:element", "element"]);
    let attrNames = findAllProperties([els], ["@name", "name"]);
    wfsLayersWithAttr.push({
      attributes: attrNames,
      typeName: xsdElementType,
    });
  }

  // console.log("wfsLayersWithAttr", JSON.stringify(wfsLayersWithAttr));

  return wfsLayersWithAttr;
}

function getAttributes(mainCallback) {
  let listDatasets = JSON.parse(fs.readFileSync(LIST_DATASETS));
  // let listDatasets = [
  //   "energieverbrauch-strom-umweltatlas-wfs-238921d9",
  //   "alkis-berlin-gemeinde-wfs-3fbfcbce",
  // ];

  async function fetchAndParse(datasetName, resource) {
    const wfsUrl = `${resource.serviceURL}?REQUEST=DescribeFeatureType&SERVICE=WFS&VERSION=2.0.0`;

    try {
      console.log("---------------------");
      console.log("DATASET NAME: ", datasetName);
      console.log("DescribeFeatureType: ", wfsUrl);

      const wfsAsText = await fetchWfsAsText(wfsUrl);
      const wfsJson = fromXML(wfsAsText);
      let attributes = await getElements(resource, wfsJson);

      // console.log("wfsUrl:", wfsUrl);
      console.log("ATTRIBUTES: ", JSON.stringify(attributes));
      fs.writeFileSync(
        `./scraper/data/datasets/${datasetName}/attributes.json`,
        JSON.stringify(attributes)
      );
    } catch (error) {
      console.error(
        "Error fetching or parsing data (DescribeFeatureType):",
        error
      );
      errorList.push([datasetName, wfsUrl]);
    }
  }

  async function run() {
    for (const datasetName of listDatasets) {
      let datasetInfo = JSON.parse(
        fs.readFileSync(`./scraper/data/datasets/${datasetName}/ckan.json`)
      );

      if (datasetInfo.type === "WFS") {
        await fetchAndParse(datasetName, datasetInfo);
        // Wait for 1000 milliseconds before moving to the next iteration
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    console.log("errorList: ", errorList);

    mainCallback();
  }

  run();
}

// getAttributes();
module.exports = { getAttributes };
