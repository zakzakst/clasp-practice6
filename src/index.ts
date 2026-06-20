import { getFileById_ } from "./utils/drive/getFile";

const renderRawHtml_ = (file: GoogleAppsScript.Drive.File) => {
  const content = file.getBlob().getDataAsString("UTF-8");
  const title = file.getName().replace(/\.html?$/i, "");
  return HtmlService.createHtmlOutput(content)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
};

const doGet = (e: GoogleAppsScript.Events.DoGet) => {
  const params = (e && e.parameter) || {};
  const fileId = params.id;
  const file = getFileById_(fileId);
  if (!file) return;
  return renderRawHtml_(file);
};
