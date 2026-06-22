/**
 * MIMEタイプまたは拡張子でHTMLファイルか判定する。
 * @param name ファイル名
 * @param mimeType MIME タイプ
 * @returns 判定結果
 */
export const isHtmlFile_ = (name: string, mimeType: string): boolean => {
  if (mimeType === "text/html") return true;
  return /\.html?$/i.test(String(name));
};

/**
 * 比較用にファイル名を正規化する（trim・.html 除去・小文字化）。
 * @param name ファイル名
 * @returns 正規化したファイル名
 */
export const normalizeName_ = (name: string): string => {
  return String(name)
    .trim()
    .replace(/\.html?$/i, "")
    .toLowerCase();
};

type BuildTreeArgs = {
  rootFolderId: string;
  subFolders: { id: string; name: string }[];
  files: { id: string; name: string; parentId: string }[];
};

type BuildTreeGroup = {
  id: string;
  name: string;
  isRoot: boolean;
  files: {
    id: string;
    name: string;
  }[];
};

/**
 * フラットなフォルダ/ファイル情報を、表示用のグループ配列へ整形する。
 * @param rootFolderId ルートフォルダのID
 * @param subFolders 直下のサブフォルダ情報の配列
 * @param files files root と直下サブフォルダ内の HTMLファイル情報の配列
 * @returns 表示用のグループ配列
 */
export const buildTree_ = ({
  rootFolderId,
  subFolders,
  files,
}: BuildTreeArgs): BuildTreeGroup[] => {
  const groups: Record<string, BuildTreeGroup> = {};
  groups[rootFolderId] = {
    id: rootFolderId,
    name: "ルート（未分類）",
    isRoot: true,
    files: [],
  };
  subFolders.forEach((folder) => {
    groups[folder.id] = {
      id: folder.id,
      name: folder.name,
      isRoot: false,
      files: [],
    };
  });
  files.forEach((file) => {
    const g = groups[file.parentId] || groups[rootFolderId];
    g.files.push({
      id: file.id,
      name: file.name,
    });
  });
  const list: BuildTreeGroup[] = Object.keys(groups).map(function (k) {
    return groups[k];
  });
  list.forEach((g) => {
    g.files.sort((a, b) => {
      return String(a.name).localeCompare(String(b.name), "ja");
    });
  });
  list.sort((a, b) => {
    if (a.isRoot) return -1;
    if (b.isRoot) return 1;
    return String(a.name).localeCompare(String(b.name), "ja");
  });
  return list;
};

/**
 * HTML エスケープ。
 * @param html エスケープするHTML
 * @returns エスケープしたHTML
 */
export const escapeHtml_ = (html: string): string => {
  return String(html)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};
