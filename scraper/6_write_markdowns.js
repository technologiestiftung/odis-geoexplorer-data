"use strict";
// const fs = require("fs");
const fs = require("fs-extra");
const { getEncoding, encodingForModel } = require("js-tiktoken");
const enc = getEncoding("cl100k_base");
function replaceLinks(text) {
  return text.replace(/<([^<>]+)>/g, function (match, p1) {
    return p1.replace(/\bhttps?:\/\/\S+/gi, function (link) {
      return link;
    });
  });
}
let index = 0;

function writeSingleMarkdown(
  name,
  mainTitle,
  ckan,
  attributes,
  attributesDescription,
  htmlDescription
) {
  let markdown = "";

  ckan["title"] = attributes?.title ? attributes.title : mainTitle;
  markdown += "# " + ckan["title"] + "\n";

  // CkAN DATA
  const keyFullNames = {
    title: "Titel",
    serviceURL: "Service URL",
    url: "Fisbroker URL",
    techHtml: "Beschreibung URL",
    type: "Typ",
    name: "Name",
    tags: "Stichworte",
    notes: "Anmerkung",
    author: "Autor",
    pdf: "", // not added to final data
  };
  for (const key in ckan) {
    if (key === "pdf" || !keyFullNames[key]) {
    } else {
      markdown += "- " + keyFullNames[key] + ": ";

      if (key === "tag") {
        markdown += "`" + ckan[key].toString().trim() + "`";
      } else if (key === "notes") {
        let text = ckan[key].split("\n\n![Vorschaugrafik zu Datensatz")[0];
        text = text.replace(/\n\s*\n/g, "\n");

        markdown += "`" + text + "`";
      } else {
        markdown += "`" + ckan[key] + "`";
      }
      markdown += " $$$\n";
    }
  }

  if (attributes?.title) {
    markdown += "- Teildatensatz von: " + mainTitle + " $$$\n";
  }

  if (attributes) {
    // console.log("attributes", attributes);
    if (attributes.attributes) {
      markdown += "- Attribute: ";
      markdown += "`" + attributes.attributes.toString().trim() + "`";
      markdown += " $$$\n";
    }
    if (attributes.typeName) {
      markdown += "- Layer Name: ";
      markdown += "`" + attributes.typeName.toString().trim() + "`";
      markdown += " $$$\n";
    }
  }

  if (attributesDescription && attributesDescription.length !== 0) {
    markdown += "- Attribute Beschreibung: ";
    markdown += "`" + attributesDescription.toString().trim() + "`";
    markdown += " $$$\n";
  }

  if (htmlDescription) {
    markdown += "- Beschreibung: ";
    markdown += "`" + replaceLinks(htmlDescription) + "`";
    markdown += " $$$\n";
  }
  index++;

  const fileName =
    name +
    (attributes?.title
      ? "--" + attributes.title.replaceAll(" ", "").replaceAll("/", "-")
      : "");
  fs.writeFileSync(`./markdowns/${fileName}.mdx`, markdown);
}

function writeMarkdowns(mainCallback) {
  let listDatasets = JSON.parse(fs.readFileSync(LIST_DATASETS));

  fs.emptyDir("./markdowns")
    .then(() => {
      console.log("Directory emptied successfully");
      listDatasets.map((name) => {
        let attributes;
        let attributesDescription;
        let htmlDescription;
        let ckan;

        try {
          ckan = JSON.parse(
            fs.readFileSync(`./scraper/data/datasets/${name}/ckan.json`)
          );
        } catch (error) {}
        try {
          attributes = JSON.parse(
            fs.readFileSync(`./scraper/data/datasets/${name}/attributes.json`)
          );
        } catch (error) {}
        try {
          attributesDescription = JSON.parse(
            fs.readFileSync(
              `./scraper/data/datasets/${name}/attributesDescription.json`
            )
          );
        } catch (error) {}
        try {
          htmlDescription = JSON.parse(
            fs.readFileSync(
              `./scraper/data/datasets/${name}/htmlDescription.json`
            )
          );
        } catch (error) {}

        const mainTitle = ckan.title
          .replace("- [WFS]", "")
          .replace("- [WMS]", "")
          .trim();

        if (attributes && attributes.length) {
          attributes.forEach((attr) => {
            writeSingleMarkdown(
              name,
              mainTitle,
              ckan,
              attr,
              attributesDescription,
              htmlDescription
            );
          });
        } else {
          writeSingleMarkdown(
            name,
            mainTitle,
            ckan,
            attributes,
            attributesDescription,
            htmlDescription
          );
        }
      });
      console.log("Markdown written. Count:", index);
      mainCallback();
    })
    .catch((err) => {
      console.error("Error emptying directory:", err);
      mainCallback();
    });
}

module.exports = { writeMarkdowns };
