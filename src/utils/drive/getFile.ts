export const getFileById_ = (
  id: string,
): GoogleAppsScript.Drive.File | null => {
  try {
    const file = DriveApp.getFileById(id);
    return file;
  } catch (error) {
    // 不正なID / アクセス不可
    return null;
  }
};
