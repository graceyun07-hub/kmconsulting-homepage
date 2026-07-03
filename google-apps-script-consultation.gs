const CONFIG = {
  password: "KM_CONSULTING_2026!",
  recipientEmail: "graceyun07@gmail.com",
  spreadsheetId: "1VCcB5BSHARN1fL465dvWSWf4J1r8FI1v6z4fMbtIxPw",
  sheetName: "문의접수",
};

const HEADERS = [
  "접수일자",
  "이름",
  "연락처",
  "이메일",
  "연락가능시간",
  "문의분야",
  "사업자유형",
  "문의내용",
  "개인정보동의",
  "처리상태",
];

function doPost(event) {
  try {
    const payload = parsePayload_(event);

    if (payload.password !== CONFIG.password) {
      return json_({ ok: false, message: "Unauthorized" });
    }

    const saved = appendToSheet_(payload);
    sendNotificationEmail_(payload, saved);

    return json_({ ok: true, message: "Saved" });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, message: String(error && error.message ? error.message : error) });
  }
}

function parsePayload_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Missing request body");
  }

  return JSON.parse(event.postData.contents);
}

function appendToSheet_(payload) {
  const spreadsheet = CONFIG.spreadsheetId
    ? SpreadsheetApp.openById(CONFIG.spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("문의를 저장할 Google Sheet가 연결되지 않았습니다. CONFIG.spreadsheetId를 입력해주세요.");
  }

  const sheet = spreadsheet.getSheetByName(CONFIG.sheetName) || spreadsheet.insertSheet(CONFIG.sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  sheet.appendRow([
    payload["접수일자"] || payload.receivedAt || new Date().toISOString(),
    payload["이름"] || payload.name || "",
    payload["연락처"] || payload.phone || "",
    payload["이메일"] || payload.email || "",
    payload["연락가능시간"] || payload.contactTime || "",
    payload["문의분야"] || payload.inquiryCategory || "",
    payload["사업자유형"] || payload.businessType || "",
    payload["문의내용"] || payload.message || "",
    payload["개인정보동의"] || payload.privacyAgreed || "",
    payload["처리상태"] || payload.status || "신규",
  ]);

  SpreadsheetApp.flush();

  return {
    rowNumber: sheet.getLastRow(),
    sheetName: sheet.getName(),
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl(),
  };
}

function sendNotificationEmail_(payload, saved) {
  const name = payload["이름"] || payload.name || "";
  const phone = payload["연락처"] || payload.phone || "";
  const email = payload["이메일"] || payload.email || "";
  const contactTime = payload["연락가능시간"] || payload.contactTime || "미선택";
  const inquiryCategory = payload["문의분야"] || payload.inquiryCategory || "";
  const businessType = payload["사업자유형"] || payload.businessType || "";
  const message = payload["문의내용"] || payload.message || "";
  const receivedAt = payload["접수일자"] || payload.receivedAt || new Date().toISOString();

  const subject = `[케이엠경영컨설팅] 새 문의 접수 - ${name || "이름 미입력"} / 시트저장 ${saved ? "완료" : "확인필요"}`;
  const body = [
    "홈페이지에서 새 문의가 접수되었습니다.",
    "",
    `접수일자: ${receivedAt}`,
    `이름: ${name}`,
    `연락처: ${phone}`,
    `이메일: ${email || "미입력"}`,
    `연락 가능 시간: ${contactTime}`,
    `문의 분야: ${inquiryCategory}`,
    `사업자 유형: ${businessType}`,
    `저장 시트: ${saved && saved.spreadsheetUrl ? saved.spreadsheetUrl : "확인 필요"}`,
    `저장 탭: ${saved && saved.sheetName ? saved.sheetName : "확인 필요"}`,
    `저장 행: ${saved && saved.rowNumber ? saved.rowNumber : "확인 필요"}`,
    `저장 시트 ID: ${saved && saved.spreadsheetId ? saved.spreadsheetId : "확인 필요"}`,
    "",
    "문의 내용",
    message,
  ].join("\n");

  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject,
    body,
    replyTo: email || undefined,
    name: "케이엠경영컨설팅 홈페이지",
  });
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
