# Google Apps Script 문의 메일 설정

문의 폼에서 메일이 오려면 Google Apps Script 웹 앱이 `MailApp.sendEmail()`을 실행해야 합니다. 현재 홈페이지는 Apps Script URL로 문의 데이터를 보내므로, 아래 순서로 스크립트를 배포하세요.

## 적용 순서

1. Google Sheets에서 문의를 저장할 스프레드시트를 엽니다.
2. `확장 프로그램` > `Apps Script`를 엽니다.
3. 기존 코드가 있다면 백업한 뒤, `google-apps-script-consultation.gs` 내용을 붙여 넣습니다.
4. `CONFIG.recipientEmail`이 `graceyun07@gmail.com`인지 확인합니다.
5. 시트를 단독 Apps Script 프로젝트와 연결하는 경우 `CONFIG.spreadsheetId`에 Google Sheets ID를 입력합니다.
6. `배포` > `새 배포`를 누릅니다.
7. 유형은 `웹 앱`으로 선택합니다.
8. 실행 권한은 `나`, 액세스 권한은 `모든 사용자`로 설정합니다.
9. 배포 후 권한 승인 화면에서 메일 발송과 스프레드시트 접근 권한을 승인합니다.
10. 새 웹 앱 URL이 기존과 다르면 `index.html`의 `GOOGLE_APPS_SCRIPT_URL` 값을 새 URL로 교체합니다.

## Google Sheet를 못 찾을 때

기존 시트를 못 찾으면 새로 만들어도 됩니다.

1. Google Drive에서 새 Google Sheets 파일을 만듭니다.
2. 파일명을 `케이엠경영컨설팅 문의접수`처럼 알아보기 쉽게 바꿉니다.
3. 주소가 `https://docs.google.com/spreadsheets/d/스프레드시트ID/edit...` 형태로 보입니다.
4. `/d/`와 `/edit` 사이의 긴 문자열을 복사합니다.
5. Apps Script 코드에서 아래처럼 입력합니다.

```js
const CONFIG = {
  password: "KM_CONSULTING_2026!",
  recipientEmail: "graceyun07@gmail.com",
  spreadsheetId: "여기에_스프레드시트ID_붙여넣기",
  sheetName: "문의접수",
};
```

이렇게 하면 Apps Script를 시트에서 열지 않았더라도 정확한 시트에 문의가 저장됩니다.

## 확인 방법

홈페이지 문의 폼에서 테스트 문의를 보낸 뒤 아래 두 곳을 확인합니다.

- Google Sheet `문의접수` 탭에 새 행이 생기는지
- `graceyun07@gmail.com` 받은편지함 또는 스팸함에 `[케이엠경영컨설팅] 새 문의 접수` 메일이 오는지

메일이 안 오면 Apps Script 실행 기록에서 실패 로그를 먼저 확인하세요. 권한 승인을 하지 않았거나, 웹 앱 배포 URL이 홈페이지의 `GOOGLE_APPS_SCRIPT_URL`과 다르면 메일이 발송되지 않습니다.
