"use strict";
const fs = require("fs");
const { JSDOM } = require("jsdom");

function getHtmlInfo(url, name, fileName) {
  async function extractDescriptionInfo(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch HTML content: ${response.status} ${response.statusText}`
      );
    }

    // Read the response body as an ArrayBuffer
    const buffer = await response.arrayBuffer();
    // Convert ISO-8859-1 to UTF-8
    const decoder = new TextDecoder("iso-8859-1");
    const utf8Text = decoder.decode(buffer);
    const dom = new JSDOM(utf8Text);
    const document = dom.window.document;

    const titleTag = document.querySelector("title");
    const title = titleTag ? `- Title: ${titleTag.textContent.trim()}\n` : "";

    let contentText = "";

    document.querySelectorAll("p, ul, table").forEach((element) => {
      if (element.tagName === "TABLE") {
        let tableRows = element.querySelector("tbody").children;
        tableRows = Array.from(tableRows).filter(
          (col) => !col.querySelector("table")
        );
        let tableContent = "";
        tableRows.forEach((row) => {
          const cols = row.querySelectorAll("td, th");
          const rowContent = Array.from(cols)
            .map((col) => col.textContent.trim())
            .join(" | ");
          tableContent += `${rowContent}\n`;
        });
        contentText += `\n${tableContent}`;
      } else if (element.tagName !== "TABLE") {
        contentText += `${element.textContent.trim()}\n`;
      }
    });

    if (contentText) {
      contentText = "- Content: " + contentText;
      contentText += "\n";
    }

    let htmlText = `${title}${contentText}`;
    console.log("htmlText", htmlText);
    fs.writeFileSync("text.md", htmlText, { encoding: "utf-8" });
  }

  const link =
    // "https://fbinter.stadt-berlin.de/fb/?loginkey=alphaDataStart&alphaDataId=s_brw_2011@senstadt";
    "https://fbinter.stadt-berlin.de/fb_daten/beschreibung/datenformatbeschreibung/Datenformatbeschreibung_eladeinfrstr.html";

  //   const link =
  //     "https://fbinter.stadt-berlin.de/fb_daten/beschreibung/datenformatbeschreibung/Datenformatbeschreibung_eladeinfrstr.html";
  extractDescriptionInfo(link);
}

module.exports = { getHtmlInfo };

// ("https://fbinter.stadt-berlin.de/fb/?loginkey=alphaDataStart&alphaDataId")
