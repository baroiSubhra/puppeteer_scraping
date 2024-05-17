import scrapeThreadsCollection from "./modules/scrapeThreadsCollection.js";
import scrapeThread from "./modules/scrapeThread.js";
import { getCsvData } from "./modules/utils.js";
import { THREADS_COLLECTION_CSV_FOLDER_NAME } from "./modules/defaults.js";
import path from "path";

const driver = async () => {
  const fileName = await scrapeThreadsCollection();
  const __dirname = path.resolve();
  const csvFilePath = path.join(
    __dirname,
    THREADS_COLLECTION_CSV_FOLDER_NAME,
    fileName
  );
  const data = await getCsvData(csvFilePath);
  for (let i = 0; i < data.length; i++) {
    await scrapeThread(data[i].link);
  }
};

driver();