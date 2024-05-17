import puppeteer from "puppeteer";
import {
  scrollAndMountRequiredAllElementsInThread,
  createCsv,
  getDateInStringFormat,
} from "./utils.js";
import {
  THREAD_CSV_FOLDER_NAME,
  THREAD_CSV_HEADER,
  THREAD_COLLECTION_PAGE_END_SELECTOR,
  THREAD_COMMENTS_PARENT_SELECTOR,
  THREAD_TEXT_SELECTOR,
  THREAD_DATE_SELECTOR,
  THREAD_USER_NAME_SELECTOR,
} from "./defaults.js";

const main = async (url) => {
  const urlList = new URL(url)?.pathname?.split("/");
  const topic = urlList[urlList.length - 2];
  console.log(`==Starting to scrape ${topic}==`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  await page.setViewport({ width: 1080, height: 1024 });

  console.log(`==Starting to scroll${topic}==`);
  await scrollAndMountRequiredAllElementsInThread(
    page,
    THREAD_COLLECTION_PAGE_END_SELECTOR
  );
  console.log(`==Ending scroll ${topic}==`);
  console.log(`==Starting to collect data ${topic}==`);
  const threadsData = await extractData(page);
  console.log(`==Ending collect data ${topic}==`);

  console.log(`==Starting write csv ${topic}==`);
  const today = new Date().valueOf();
  const stringDate = getDateInStringFormat(today, "_");
  const filePath = `${THREAD_CSV_FOLDER_NAME}/thread_${topic}_date_${stringDate}_comments_${
    threadsData?.length
  }_id_${today.valueOf()}.csv`;
  await createCsv(
    THREAD_CSV_FOLDER_NAME,
    filePath,
    THREAD_CSV_HEADER,
    threadsData
  );
  console.log(`==Ending write csv ${topic}==`);

  console.log(`==Ending scrape ${topic}==`);
  await browser.close();
};

const extractData = async (page) => {
  const getDateInStringFormatString = getDateInStringFormat.toString();
  return await page.evaluate(
    (
      getDateInStringFormatString,
      parentSelector,
      textSelector,
      dateSelector,
      userNameSelector
    ) => {
      const getDateInStringFormat = new Function(
        `return (${getDateInStringFormatString})`
      )();
      const result = [];
      const threadParents = document.querySelectorAll(parentSelector);
      threadParents.forEach((parentElement, index) => {
        const textElemet = parentElement.querySelector(textSelector);
        const dateElement = parentElement.querySelector(dateSelector);
        const userName =
          parentElement.querySelector(userNameSelector)?.innerText;
        result.push({
          srNo: index + 1,
          topicId: parentElement.getAttribute("data-topic-id"),
          postId: parentElement.getAttribute("data-post-id"),
          userId: parentElement.getAttribute("data-user-id"),
          userName: userName,
          date: getDateInStringFormat(
            parseInt(dateElement.getAttribute("data-time"))
          ),
          text: textElemet?.innerText,
          html: textElemet?.innerHTML,
        });
      });
      return result;
    },
    getDateInStringFormatString,
    THREAD_COMMENTS_PARENT_SELECTOR,
    THREAD_TEXT_SELECTOR,
    THREAD_DATE_SELECTOR,
    THREAD_USER_NAME_SELECTOR
  );
};

export default main;
