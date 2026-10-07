# 토브 브랜딩 컴퍼니 홈페이지

- `brandlab/index.html`: 사이트 원본 (한 파일)
- `brandlab/img/`: 사이트 이미지
- `build-site.mjs`: 배포용 `site/` 폴더를 만든다. 숨김 처리한 사례(`hidden: true`)는 배포본에서 빠진다.
- `netlify.toml`: Netlify 배포 설정

## 수정하고 올리기

1. `brandlab/index.html` 또는 `brandlab/img/`를 고친다.
2. 내 PC에서 확인하려면 `node build-site.mjs`를 실행한 뒤 `site/index.html`을 연다.
3. 커밋하고 `git push`하면 Netlify가 자동으로 다시 배포한다.

## 상담 신청 확인

Netlify 관리자 화면 → 이 사이트 → Forms → `contact`.
CSV로 내려받을 수 있고, 이메일 알림은 Forms 설정의 Form notifications에서 켤 수 있다.
