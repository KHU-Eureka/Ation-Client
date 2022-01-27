# Sensation-Client
KHU 컴퓨터공학과X산업디자인학과 연합 웹 개발 프로젝트
<br/>
### commit 메시지 규칙
#### 타입

- Feat: 기능 추가
- Style: css 추가 및 수정
- Chore: 코드 정리, 폴더 정리, 파일 정리
- Refactor: 리팩토링
- Fix: 오류 수정

#### 충돌 문제 방지

- package-lock.json: 버전 통일
- 태그의 className으로 인한 css 충돌 문제: css파일에서 꼭 최상위요소 지정해주기, 최상위요소 클래스명은 맞추기

- 파일 구조 통일

**2버전 폴더**

src > component
1. lounge
2. **lounge-white**(공통 폴더)
3. lounge-wait

assets > css
1. lounge
2. **lounge-white**(공통 폴더)
3. lounge-wait

