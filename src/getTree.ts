import { folderId_ } from "./utils";
import { buildTree_, isHtmlFile_ } from "./utils/common/gas-html-share";

type TreeFolder = {
  id: string;
  name: string;
};

type TreeFile = {
  id: string;
  name: string;
  parentId: string;
};

/**
 * 1フォルダ直下のHTMLをfiles配列へpushする。
 * @param folder 対象のフォルダ
 * @param parentId 対象のフォルダのID
 * @param files push先
 */
const collectHtml_ = (
  folder: GoogleAppsScript.Drive.Folder,
  parentId: string,
  files: TreeFile[],
) => {
  const fi = folder.getFiles();
  while (fi.hasNext()) {
    const f = fi.next();
    if (isHtmlFile_(f.getName(), f.getMimeType())) {
      files.push({
        id: f.getId(),
        name: f.getName(),
        parentId: parentId,
      });
    }
  }
};

/**
 * FOLDER_ID直下のサブフォルダと、root直下サブフォルダ内のHTMLを表示用グループ配列へ整形して返す（buildTree_で整形）。
 * 読み取りのためowner限定にはしない（同一ドメインの閲覧者も利用）。
 * @returns 表示用のグループ配列
 */
export const getTree = () => {
  const rootFolderId = folderId_();
  const root = DriveApp.getFolderById(rootFolderId);
  const subFolders: TreeFolder[] = [];
  const files: TreeFile[] = [];
  collectHtml_(root, rootFolderId, files);
  const subs = root.getFolders();
  while (subs.hasNext()) {
    const sub = subs.next();
    subFolders.push({ id: sub.getId(), name: sub.getName() });
    collectHtml_(sub, sub.getId(), files);
  }
  return buildTree_({ rootFolderId, subFolders, files });
};
