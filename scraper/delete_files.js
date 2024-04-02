const fs = require("fs");

const RUN_UPDATE = false;
LIST_DATASETS = RUN_UPDATE
  ? "./data/datasetsNew.json"
  : "./data/datasetsAll.json";

let listDatasets = JSON.parse(fs.readFileSync(LIST_DATASETS));

const FILENAME = "htmlDescription.json";
for (const datasetName of listDatasets) {
  const filePath = `./data/datasets/${datasetName}/${FILENAME}`;
  try {
    fs.unlinkSync(filePath);
    console.log(`File ${filePath} deleted successfully`);
  } catch (err) {
    console.error(`Error deleting file ${filePath}: ${err}`);
  }
}
