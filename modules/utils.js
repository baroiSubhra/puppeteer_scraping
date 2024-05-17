import { createObjectCsvWriter } from "csv-writer";
import { promises as fs } from "fs";
import path from "path";
import csv from "csv-parser";

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
      noOfContent = await page.evaluate((selector) => {
        return document.querySelectorAll(selector).length;
      }, selector);
    }
  } catch (e) {
    console.error(e);
  }
};

export const scrollAndMountRequiredAllElementsInThread = async (
  page,
  selector
) => {
  let noOfContent = await page.evaluate((selector) => {
    return document.querySelectorAll(selector).length;
  }, selector);
  if (noOfContent != 0) return;
  try {
    while (noOfContent == 0) {
      await scrollToBottom(page);
      noOfContent = await page.evaluate((selector) => {
        return document.querySelectorAll(selector).length;
      }, selector);
    }
  } catch (e) {
    console.error(e);
  }
};

export const createCsv = async (baseFolder, filePath, header, values) => {
  await createDirectoryStructure(baseFolder);
  const csvWriter = createObjectCsvWriter({
    path: filePath,
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

// Create a function to read and parse the CSV file
const readCSV = async (filePath) => {
  try {
    const fileHandle = await fs.open(filePath, "r");
    const results = [];
    await new Promise((resolve, reject) => {
      fileHandle
        .createReadStream()
        .pipe(csv())
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", () => {
          resolve(results);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
    await fileHandle.close();
    return results;
  } catch (error) {
    throw new Error(`Error reading CSV file: ${error.message}`);
  }
};

export const getCsvData = async (filePath) => {
  try {
    return await readCSV(filePath);
  } catch (error) {
    console.log(error);
  }
};
