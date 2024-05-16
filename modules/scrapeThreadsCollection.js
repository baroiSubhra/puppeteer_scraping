import puppeteer from "puppeteer";
import {
  scrollAndMountRequiredNoOfElements,
  createCsv,
  getDateInStringFormat,
} from "./utils.js";
import {
  REQUIRED_NO_OF_ENTRIES,
  THREADS_COLLECTION_CSV_FOLDER_NAME,
  THREADS_COLLECTION_CSV_HEADER,
  THREADS_COLLECTION_LINK_SELECTOR,
  THREADS_COLLECTION_DATE_SELECTOR,
} from "./defaults.js";

const main = async () => {
  console.log("==Starting to scrape==");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://forum.valuepickr.com", {
    waitUntil: "networkidle2",
  });
  await page.setViewport({ width: 1080, height: 1024 });

  console.log("==Starting to scroll==");
  await scrollAndMountRequiredNoOfElements(
    REQUIRED_NO_OF_ENTRIES,
    page,
    THREADS_COLLECTION_LINK_SELECTOR
  );
  console.log("==Ending scroll==");

  console.log("==Starting to collect data==");
  const threadsCollectionData = await extractData(page);
  console.log("==Ending collect data==", threadsCollectionData.length);

  console.log("==Starting write csv==");
  await createCsv(
    THREADS_COLLECTION_CSV_FOLDER_NAME,
    THREADS_COLLECTION_CSV_HEADER,
    threadsCollectionData.slice(0, REQUIRED_NO_OF_ENTRIES)
  );
  console.log("==Ending write csv==");

  console.log("==Ending scrape==");
  await browser.close();
};

const extractData = async (page) => {
  const functionString = getDateInStringFormat.toString();
  return await page.evaluate(
    (functionString, linkSelector, dateSelector) => {
      const getDateInStringFormat = new Function(
        `return (${functionString})`
      )();
      const result = [];
      const forumElements = document.querySelectorAll(linkSelector);
      const dateElements = document.querySelectorAll(dateSelector);
      forumElements.forEach((element, index) => {
        result.push({
          srNo: index + 1,
          id: element.getAttribute("data-topic-id"),
          date: getDateInStringFormat(
            parseInt(dateElements[index].getAttribute("data-time"))
          ),
          topic: element.innerText,
          link: element.href,
        });
      });
      return result;
    },
    functionString,
    THREADS_COLLECTION_LINK_SELECTOR,
    THREADS_COLLECTION_DATE_SELECTOR
  );
};

export default main;
