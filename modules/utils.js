import { createObjectCsvWriter } from "csv-writer";
import { promises as fs } from "fs";
import path from "path";

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const scrollToBottom = async (page, sleepTime = 3000) => {
  const previousHeight = await page.evaluate("document.body.scrollHeight");
  await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
  await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
  await sleep(sleepTime);
};

export const scrollAndMountRequiredNoOfElements = async (
  requireNoOfContent,
  page,
  selector
) => {
  let noOfContent = 0;
  try {
    while (noOfContent <= requireNoOfContent) {
      await scrollToBottom(page);
      noOfContent = await page.evaluate(() => {
        return document.querySelectorAll(selector).length;
      });
    }
    console.log("Final No Of Content", noOfContent);
  } catch (e) {
    console.error(e);
  }
};

export const createCsv = async (folderPath, header, values) => {
  const today = new Date().valueOf();
  const stringDate = getDateInStringFormat(today, "_");
  await createDirectoryStructure(folderPath);
  const csvWriter = createObjectCsvWriter({
    path: `${folderPath}/collection_${stringDate}_first_${
      values?.length
    }_values_id_${today.valueOf()}`,
    header,
  });
  return csvWriter.writeRecords(values);
};

const createDirectoryStructure = async (dirPath) => {
  try {
    const fullPath = path.resolve(dirPath);
    try {
      await fs.access(fullPath);
    } catch {
      await fs.mkdir(fullPath, { recursive: true });
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

export const getDateInStringFormat = (unicodeDate, delimiter = "-") => {
  const date = new Date(unicodeDate);
  const stringDate = `${date.getDate()}${delimiter}${
    date.getMonth() + 1
  }${delimiter}${date.getFullYear()}`;
  return stringDate;
};
