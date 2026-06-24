import { assertOwner_, folderId_ } from "./utils";
import { isHtmlFile_ } from "@common/gas-html-share";

/**
 * 名前に拡張子が無ければ.htmlを補う。
 * @param name 名前
 * @returns 補足後の名前
 */
const ensureHtmlName_ = (name: string): string => {
  const n = String(name).trim();
  return /\.html?$/i.test(n) ? n : n + ".html";
};

/**
 * ルート直下にフォルダを作成。
 * @param name 作成するフォルダ名
 * @returns 作成したフォルダ情報
 */
const createFolder = (name: string): { id: string; name: string } => {
  assertOwner_();
  const folder = DriveApp.getFolderById(folderId_()).createFolder(
    String(name).trim(),
  );
  return { id: folder.getId(), name: folder.getName() };
};

/**
 * フォルダ名を変更。
 * @param id フォルダのID
 * @param name 変更後のフォルダ名
 */
const renameFolder = (id: string, name: string) => {
  assertOwner_();
  DriveApp.getFolderById(id).setName(String(name).trim());
};

/**
 * フォルダを中身ごとゴミ箱へ。
 * @param id 削除するフォルダのID
 */
const deleteFolder = (id: string) => {
  assertOwner_();
  DriveApp.getFolderById(id).setTrashed(true);
};

/**
 * 指定フォルダにHTMLを新規作成。
 * @param folderId フォルダのID
 * @param name 新規作成するHTMLのファイル名
 * @param html 新規作成するHTMLの文字列
 * @returns 作成したファイルの情報
 */
const uploadFile = (
  folderId: string,
  name: string,
  html: string,
): { id: string; name: string } => {
  assertOwner_();
  const file = DriveApp.getFolderById(folderId).createFile(
    ensureHtmlName_(name),
    String(html),
    "text/html",
  );
  return { id: file.getId(), name: file.getName() };
};

/**
 * 既存ファイルの中身だけ差し替え（id/URL/名前は不変）。
 * @param fileId 中身を差し替えるファイルのID
 * @param html 差し替え後のHTML文字列
 */
const updateFile = (fileId: string, html: string) => {
  assertOwner_();
  const file = DriveApp.getFileById(fileId);
  if (!isHtmlFile_(file.getName(), file.getMimeType())) {
    throw new Error("HTMLファイルではありません");
  }
  file.setContent(String(html));
};

/**
 * ファイル名を変更。
 * @param fileId 名前を変更するファイルのID
 * @param name 変更後のファイル名
 * @returns 変更後のファイル情報
 */
const renameFile = (
  fileId: string,
  name: string,
): { id: string; name: string } => {
  assertOwner_();
  const file = DriveApp.getFileById(fileId);
  file.setName(ensureHtmlName_(name));
  return { id: file.getId(), name: file.getName() };
};

/**
 * ファイルを別フォルダへ移動。
 * @param fileId 移動するファイルのID
 * @param folderId 移動先のフォルダのID
 */
const moveFile = (fileId: string, folderId: string) => {
  assertOwner_();
  DriveApp.getFileById(fileId).moveTo(DriveApp.getFolderById(folderId));
};

/**
 * ファイルをゴミ箱へ。
 * @param fileId 削除するファイルのID
 */
const deleteFile_ = (fileId: string) => {
  assertOwner_();
  DriveApp.getFileById(fileId).setTrashed(true);
};
