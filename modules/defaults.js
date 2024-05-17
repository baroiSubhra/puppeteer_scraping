export const REQUIRED_NO_OF_ENTRIES = 100;
export const THREADS_COLLECTION_LINK_SELECTOR =
  "a.title.raw-link.raw-topic-link";
export const THREADS_COLLECTION_DATE_SELECTOR = "span.relative-date";
export const THREADS_COLLECTION_CSV_FOLDER_NAME = "threads_collections";
export const THREAD_CSV_FOLDER_NAME = "individual_threads";
export const THREADS_COLLECTION_CSV_HEADER = [
  { id: "srNo", title: "srNo" },
  { id: "id", title: "id" },
  { id: "date", title: "date" },
  { id: "topic", title: "topic" },
  { id: "link", title: "link" },
];
export const THREAD_COLLECTION_PAGE_END_SELECTOR = "#suggested-topics-title";
export const THREAD_COMMENTS_PARENT_SELECTOR = "article.boxed.onscreen-post";
export const THREAD_TEXT_SELECTOR = "div.cooked";
export const THREAD_DATE_SELECTOR = "span.relative-date";
export const THREAD_USER_NAME_SELECTOR = "span > a";
export const THREAD_CSV_HEADER = [
  { id: "srNo", title: "srNo" },
  { id: "topicId", title: "topicId" },
  { id: "postId", title: "postId" },
  { id: "userId", title: "userId" },
  { id: "userName", title: "userName" },
  { id: "date", title: "date" },
  { id: "text", title: "text" },
  { id: "html", title: "html" },
];
