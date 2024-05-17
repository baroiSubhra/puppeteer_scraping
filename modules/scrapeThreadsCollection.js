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
  console.log("==Starting to scrape for collection==");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://forum.valuepickr.com", {
    waitUntil: "networkidle2",
  });
  await page.setViewport({ width: 1080, height: 1024 });

  console.log("==Starting to scroll for collection==");
  await scrollAndMountRequiredNoOfElements(
    REQUIRED_NO_OF_ENTRIES,
    page,
    THREADS_COLLECTION_LINK_SELECTOR
  );
  console.log("==Ending scroll for collection==");

  console.log("==Starting to collect data for collection==");
  const threadsCollectionData = await extractData(page);
  console.log("==Ending collect data for collection==");

  console.log("==Starting write csv for collection==");
  const today = new Date().valueOf();
  const stringDate = getDateInStringFormat(today, "_");
  const filePath = `${THREADS_COLLECTION_CSV_FOLDER_NAME}/collection_${stringDate}_first_${REQUIRED_NO_OF_ENTRIES}_values_id_${today.valueOf()}.csv`;
  const fileName = `collection_${stringDate}_first_${REQUIRED_NO_OF_ENTRIES}_values_id_${today.valueOf()}.csv`;
  await createCsv(
    THREADS_COLLECTION_CSV_FOLDER_NAME,
    filePath,
    THREADS_COLLECTION_CSV_HEADER,
    threadsCollectionData.slice(0, REQUIRED_NO_OF_ENTRIES)
  );
  console.log("==Ending write csv for collection==");

  console.log("==Ending scrape for collection==");
  await browser.close();
  return fileName;
};

const extractData = async (page) => {
  const getDateInStringFormatString = getDateInStringFormat.toString();
  return await page.evaluate(
    (getDateInStringFormatString, linkSelector, dateSelector) => {
      const getDateInStringFormat = new Function(
        `return (${getDateInStringFormatString})`
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
    getDateInStringFormatString,
    THREADS_COLLECTION_LINK_SELECTOR,
    THREADS_COLLECTION_DATE_SELECTOR
  );
};

export default main;
