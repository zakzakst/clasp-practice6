/**
 * スクリプトプロパティを1件読む（未設定なら空文字）。
 * @param key プロパティのkey
 * @returns プロパティの内容
 */
const prop_ = (key: string): string => {
  try {
    return PropertiesService.getScriptProperties().getProperty(key) || "";
  } catch {
    return "";
  }
};

/**
 * 共有HTMLを置くDriveフォルダのID。
 * @returns スクリプトプロパティ FOLDER_ID
 */
export const folderId_ = (): string => {
  return prop_("FOLDER_ID");
};

/**
 * CRUDを許可するオーナーのメール
 * @returns スクリプトプロパティ OWNER_EMAIL
 */
const ownerEmail_ = (): string => {
  return prop_("OWNER_EMAIL");
};

/**
 * アクセス中のユーザーがオーナー本人か判定する。
 * @returns 判定結果
 */
const isOwner_ = (): boolean => {
  const owner = ownerEmail_();
  const active = Session.getActiveUser().getEmail();
  return !!owner && !!active && owner === active;
};

/**
 * オーナーでなければ例外を投げる（全ミューテーションの先頭で呼ぶ）。
 */
export const assertOwner_ = () => {
  if (!isOwner_()) {
    throw new Error("権限がありません");
  }
};

/**
 * HTMLテンプレートから別HTMLファイルの中身を取り込む（styles/app 用）。
 * @param filename HTMLファイル名
 * @returns ファイルの中身
 */
const include = (filename: string): string => {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};
