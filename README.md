# 토브 파트너스 홈페이지

- `brandlab/index.html`: 사이트 원본 (한 파일)
- `brandlab/img/`: 사이트 이미지
- `build-site.mjs`: 배포용 `site/` 폴더를 만든다 (페이지에서 쓰는 이미지만 담는다)
- `firebase.json`: Firebase Hosting 설정 (배포 전에 `build-site.mjs`가 자동 실행된다)
- `firestore.rules`: 데이터 보호 규칙

## 데이터 (Firestore)

- `inquiries`: 상담 신청 (회사명 · 대표자명 · 연락처). 방문자는 새로 쓰기만, 읽기는 관리자만.
- `daily`, `pageviews`: 날짜별 방문 집계 (개인 식별 정보 없음). 방문자는 숫자를 1씩 올리기만 한다.

## 관리자

사이트 맨 아래 `관리자` 링크(또는 주소 끝에 `#admin`)에서 비밀번호를 입력한다.
관리자 계정은 Firebase Authentication의 `admin@tovpartners.kr` (이메일/비밀번호) 하나다.
비밀번호를 바꾸려면 Firebase 콘솔 → Authentication → 사용자에서 바꾼다. 비밀번호는 저장소에 넣지 않는다.

## 수정하고 올리기

1. `brandlab/index.html` 또는 `brandlab/img/`를 고친다.
2. 내 PC에서 확인하려면 `node build-site.mjs`를 실행한 뒤 `site/index.html`을 연다. 이 화면에서는 신청 · 관리자 기능이 동작하지 않는다.
3. `npx firebase-tools deploy`로 올린다. 커밋하고 `git push`해서 기록도 남긴다.
