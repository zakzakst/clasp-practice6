import { assertOwner_ } from "./utils";

/**
 * ファイル名を変更。
 * @param fileId 名前を変更するファイルのID
 * @param name 変更後のファイル名
 * @returns 変更後のファイル情報
 */
const renameFile_ = (
  fileId: string,
  name: string,
): { id: string; name: string } => {
  assertOwner_();
  const file = DriveApp.getFileById(fileId);
  // TODO: ensureHtmlName_
  file.setName(name);
  return { id: file.getId(), name: file.getName() };
};

/**
 * ファイルを別フォルダへ移動。
 * @param fileId 移動するファイルのID
 * @param folderId 移動先のフォルダのID
 */
const moveFile_ = (fileId: string, folderId: string) => {
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
