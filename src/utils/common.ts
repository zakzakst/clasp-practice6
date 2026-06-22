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
