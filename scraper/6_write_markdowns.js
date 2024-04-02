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

function writeMarkdowns(mainCallback) {
  let listDatasets = JSON.parse(fs.readFileSync(LIST_DATASETS));

  fs.emptyDir("./data/markdowns")
    .then(() => {
      console.log("Directory emptied successfully");
      listDatasets.map((name) => {
        index++;
        let attributes;
        let attributesDescription;
        let htmlDescription;
        let ckan;
        let markdown = "";
        try {
          ckan = JSON.parse(
            fs.readFileSync(`./data/datasets/${name}/ckan.json`)
          );
        } catch (error) {
          console.log("!!!!!! ", name);
        }
        try {
          attributes = JSON.parse(
            fs.readFileSync(`./data/datasets/${name}/attributes.json`)
          );
        } catch (error) {}
        try {
          attributesDescription = JSON.parse(
            fs.readFileSync(
              `./data/datasets/${name}/attributesDescription.json`
            )
          );
        } catch (error) {}
        try {
          htmlDescription = JSON.parse(
            fs.readFileSync(`./data/datasets/${name}/htmlDescription.json`)
          );
        } catch (error) {}

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
          pdf: "nooooo - not added to final data",
        };
        console.log("ckan", ckan);
        ckan["title"] = ckan["title"]
          .replace("- [WFS]", "")
          .replace("- [WMS]", "")
          .trim();

        markdown += "# " + ckan["title"] + "\n";

        // CkAN DATA
        for (const key in ckan) {
          if (key === "pdf" || !keyFullNames[key]) {
          } else {
            markdown += "- " + keyFullNames[key] + ": ";

            if (key === "tag") {
              markdown += ckan[key].toString().trim();
            } else if (key === "notes") {
              let text = ckan[key].split(
                "\n\n![Vorschaugrafik zu Datensatz"
              )[0];
              text = text.replace(/\n\s*\n/g, "\n");

              markdown += text;
            } else {
              markdown += ckan[key];
            }
            markdown += " $$$\n";
          }
        }

        if (attributes) {
          markdown += "- Attribute: ";
          markdown += attributes.toString().trim();
          markdown += " $$$\n";
        }

        if (attributesDescription && attributesDescription.length !== 0) {
          markdown += "- Attribute Beschreibung: ";
          markdown += attributesDescription.toString().trim();
          markdown += " $$$\n";
        }

        if (htmlDescription) {
          markdown += "- Beschreibung: ";
          markdown += replaceLinks(htmlDescription);
          markdown += " $$$\n";
        }
        fs.writeFileSync(`./data/markdowns/${name}.mdx`, markdown);
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
