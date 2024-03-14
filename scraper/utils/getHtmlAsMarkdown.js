"use strict";

const { JSDOM } = require("jsdom");
var TurndownService = require("turndown");
var turndownPluginGfm = require("turndown-plugin-gfm");

function htmlToMarkdownTable(html) {
  var markdownTable = "";
  // Parse HTML table structure using jsdom
  const dom = new JSDOM(html);
  const rows = dom.window.document.querySelectorAll("tr");

  // Construct Markdown table
  rows.forEach(function (row) {
    var cells = row.querySelectorAll("td, th");
    var rowContent = "";
    cells.forEach(function (cell, index) {
      var content = cell.textContent.trim();
      rowContent += (index > 0 ? " | " : "") + content;
    });
    markdownTable += rowContent + "\n";
  });

  return markdownTable;
}

async function getHtmlAsMarkdown(url) {
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

  var turndownService = new TurndownService();
  var tables = turndownPluginGfm.tables;
  turndownService.use([tables]);
  var markdown = turndownService.turndown(document);

  // Extract the table using regular expressions
  var tableRegex = /<table[\s\S]*?<\/table>/;
  var tableMatches = markdown.match(tableRegex);
  var tableHtml = tableMatches ? tableMatches[0] : "";

  // Replace the extracted table with desired content
  markdown = markdown.replace(tableHtml, htmlToMarkdownTable(tableHtml));

  if (markdown) {
    markdown = "- Content: " + markdown;
    markdown += "\n";
  }

  let htmlText = `${title}${markdown}`;

  return htmlText;
}

module.exports = { getHtmlAsMarkdown };

// const link =
// // "https://fbinter.stadt-berlin.de/fb/?loginkey=alphaDataStart&alphaDataId=s_brw_2011@senstadt";
// "https://fbinter.stadt-berlin.de/fb_daten/beschreibung/umweltatlas/datenformatbeschreibung/Datenformatbeschreibung_06_06einwohnerdichte2015.html";

// //   const link =
// //     "https://fbinter.stadt-berlin.de/fb_daten/beschreibung/datenformatbeschreibung/Datenformatbeschreibung_eladeinfrstr.html";
// extractDescriptionInfo(link);
