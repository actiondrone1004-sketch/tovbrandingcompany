# 토브 브랜딩 컴퍼니 홈페이지

- `brandlab/index.html`: 사이트 원본 (한 파일)
- `brandlab/img/`: 사이트 이미지
- `build-site.mjs`: 배포용 `site/` 폴더를 만든다 (페이지에서 쓰는 이미지만 담는다)
- `netlify/functions/`: 서버 함수
  - `contact.mjs` → `/api/contact` 상담 신청 저장 (회사명 · 대표자명 · 연락처)
  - `track.mjs` → `/api/track` 날짜별 방문 집계 (개인 식별 정보 없음)
  - `admin.mjs` → `/api/admin/login`, `/api/admin/data` 관리자 로그인 · 통계 · 문의 목록
- `netlify.toml`: Netlify 배포 설정

데이터는 Netlify Blobs(저장소 `inquiries`, `stats`)에 저장된다.

## 처음 한 번: 관리자 비밀번호 설정

Netlify 화면 → 이 사이트 → Project configuration → Environment variables에서 아래 값을 추가한 뒤 다시 배포한다.

- Key: `ADMIN_PASSWORD`
- Value: 관리자 비밀번호

비밀번호는 저장소에 절대 넣지 않는다. 바꾸려면 이 값을 바꾸고 다시 배포하면 된다. 그러면 기존 로그인도 모두 풀린다.

## 관리자 화면

사이트 맨 아래 `관리자` 링크(또는 주소 끝에 `#admin`)를 누르고 비밀번호를 입력한다.

- 통계: 오늘 · 7일 · 30일 방문자, 30일 페이지뷰, 문의 수, 최근 14일 그래프, 많이 본 페이지
- 문의 목록: 접수일시 · 회사명 · 대표자명 · 연락처, 엑셀(CSV) 내려받기

## 수정하고 올리기

1. `brandlab/index.html` 또는 `brandlab/img/`를 고친다.
2. 내 PC에서 확인하려면 `node build-site.mjs`를 실행한 뒤 `site/index.html`을 연다. 이 화면에서는 신청 · 관리자 기능이 동작하지 않는다.
3. 커밋하고 `git push`하면 Netlify가 자동으로 다시 배포한다.
