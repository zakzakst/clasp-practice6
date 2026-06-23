// TODO: コードコメントの書き方勉強になる。覚えておく
/**
 * Drive の特定フォルダ配下にある HTML ファイルを配信・管理するための GAS ウェブアプリ。
 *
 * 動作:
 *   - ?file=<名前> または ?id=<fileId> が無いとき … 2ペイン管理画面を表示
 *   - ?file=<名前> を指定したとき          … サブフォルダも再帰検索して HTML をそのまま表示
 *   - ?id=<fileId> を指定したとき          … その ID の HTML をそのまま表示（重複名でも一意）
 *
 * 表示方式について:
 *   資料では ContentService 推奨だが、Google は ContentService で MimeType.HTML を
 *   指定してもブラウザでレンダリングしない仕様（テキスト/ダウンロード扱い）に変更している。
 *   「そのまま表示」を確実に満たすため HtmlService を使う。
 */
// 設定は Apps Script の「プロジェクトの設定 → スクリプト プロパティ」で手動登録する:
//   FOLDER_ID   … 共有する HTML を置く Drive フォルダの ID（フォルダ URL の末尾）
//   OWNER_EMAIL … CRUD を許可するオーナーのメール（アクセス中ユーザーと一致で管理者判定）
import { escapeHtml_ } from "@common/gas-html-share";
import { getFileById_ } from "@drive/getFile";

/**
 * 指定された HTML ファイルの中身をそのまま返す。
 * @param file Google Driveのファイル
 * @returns HTMLの出力
 */
const renderRawHtml_ = (
  file: GoogleAppsScript.Drive.File,
): GoogleAppsScript.HTML.HtmlOutput => {
  const content = file.getBlob().getDataAsString("UTF-8");
  const title = file.getName().replace(/\.html?$/i, "");
  return HtmlService.createHtmlOutput(content)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
};

/**
 * シンプルなメッセージページを返す。
 * @param title ページタイトル
 * @param bodyHtml すでにエスケープ済みの HTML 断片
 * @returns HTMLの出力
 */
const renderMessage_ = (
  title: string,
  bodyHtml: string,
): GoogleAppsScript.HTML.HtmlOutput => {
  const html =
    '<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    "<title>" +
    escapeHtml_(title) +
    "</title>" +
    "<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:48px auto;padding:0 16px;" +
    "color:#1f2937;line-height:1.7}h1{font-size:1.4rem}a{color:#2563eb}</style></head>" +
    "<body><h1>" +
    escapeHtml_(title) +
    "</h1><p>" +
    bodyHtml +
    "</p></body></html>";
  return HtmlService.createHtmlOutput(html)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
};

/* ───────────── 実行 ───────────── */

/**
 * ウェブアプリのエントリポイント。
 * @param e リクエストイベント
 * @returns HTMLの出力
 */
const doGet = (
  e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.HTML.HtmlOutput | undefined => {
  const params = (e && e.parameter) || {};
  const fileId = params.id;
  const file = getFileById_(fileId);
  if (!file) return;
  return renderRawHtml_(file);
};
