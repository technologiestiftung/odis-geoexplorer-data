"use strict";
const fs = require("fs");

function getCKANData(mainCallback) {
  console.log("1. getCKANData ...");

  const baseUrl = "https://datenregister.berlin.de/api/3/action/package_search";
  const rowsPerPage = 1000;
  let start = 0;
  let allEntries = [];

  const fetchAllEntries = async () => {
    while (true) {
      const url = `${baseUrl}?start=${start}&rows=${rowsPerPage}`;
      console.log("fetching", start, " ");

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          const packages = data.result.results;
          if (packages.length === 0) {
            // No more results, break the loop
            break;
          }

          // Add the current page of results to the allEntries array
          allEntries = allEntries.concat(packages);
          start += rowsPerPage;
        } else {
          console.error("API request failed:", data.error);
          break;
        }
      } catch (error) {
        console.error("Error making API request:", error);
        break;
      }
    }

    return allEntries;
  };

  async function sumFileFormats() {
    fetchAllEntries()
      .then((data) => {
        fs.writeFile(
          "./data/ckan_data.json",
          JSON.stringify(data),
          {
            encoding: "utf8",
          },
          (err) => {
            mainCallback();
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching entries:", error);
      });
  }

  sumFileFormats();
}

module.exports = { getCKANData };
