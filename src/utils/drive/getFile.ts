import { isHtmlFile_ } from "@common/gas-html-share";

/**
 * フォルダ ID から File を取得（HTML 以外なら null）。
 * @param id ファイルID
 * @returns Google Driveのファイル（HTML 以外なら null）
 */
export const getFileById_ = (
  id: string,
): GoogleAppsScript.Drive.File | null => {
  try {
    const file = DriveApp.getFileById(id);
    return isHtmlFile_(file.getName(), file.getMimeType()) ? file : null;
  } catch {
    // 不正なID / アクセス不可
    return null;
  }
};
