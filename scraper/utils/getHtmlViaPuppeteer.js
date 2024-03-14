const puppeteer = require("puppeteer");

async function getHtmlViaPuppeteer(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the URL containing the frames
  await page.goto(url);

  // Get all frames on the page
  const frames = page.frames();

  // Find the frame with id "right_frame"
  const rightFrame = frames.find((frame) => frame.name() === "right_frame");
  await rightFrame.waitForSelector(".ColorBodyAlphadata");

  // Get the text content
  const textContents = await rightFrame.evaluate(() => {
    const tds = document.querySelectorAll(".ColorBodyAlphadata");
    return Array.from(tds).map((td) => td.textContent.trim());
  });

  await browser.close();
  return textContents;
}

module.exports = { getHtmlViaPuppeteer };
