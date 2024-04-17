"use strict";

const { JSDOM } = require("jsdom");

const { NodeHtmlMarkdown } = require("node-html-markdown");

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
  //   const decoder = new TextDecoder("iso-8859-1");
  //   const utf8Text = decoder.decode(buffer);
  const dom = new JSDOM(buffer);
  //   const document = dom.window.document;
  const documentString = dom.serialize();
  //   console.log(documentString);

  let markdown = NodeHtmlMarkdown.translate(documentString);

  console.log(markdown);

  return markdown;
}

module.exports = { getHtmlAsMarkdown };
