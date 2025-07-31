<p align="center">
  <a href="https://green-bath-cc7.notion.site/1b62749b6fda80c69245f995bab2e031" target="blank"><img src="https://github.com/Hongpung/.github/raw/main/profile/Hongpung_Banner.png" width="100%" alt="HongPung-Banner" /></a>
</p>


<br/>

## 홍풍<a href="https://green-bath-cc7.notion.site/1b62749b6fda80c69245f995bab2e031" target="blank"><img src="https://play-lh.googleusercontent.com/tJ84QKArlyPTyavYnR6AJQgx6dyWk36KBHJxIMb9FmaukdoYkCYELypP83-qlU3JzQ=w480-h960-rw" align=left width=100></a>
홍익대학교 풍물패연합 연습실 예약 어플리케이션, 홍풍 **모바일 앱** 저장소

<br/><br/>

<details>
<summary><h3 style="color:rgb(124, 211, 255);">프로젝트 관련 블로그 글 모음 (클릭하여 열기/닫기)</h3></summary>

- [홍풍 프로젝트 이야기; 고비부터 배포까지](https://almondine-hibiscus-9bf.notion.site/1d5f7b6d2d0f8086887edb8e610ead44?pvs=74)
- [Feature-Sliced Design(FSD) 아키텍처 적용기](https://almondine-hibiscus-9bf.notion.site/fsd-241f7b6d2d0f80238e6ce431fc9dbea6)
- [npm에 팀 라이브러리 배포하기](https://almondine-hibiscus-9bf.notion.site/npm-237f7b6d2d0f800ca4eac21f5a725bda)
- [실시간 데이터 처리하기](https://almondine-hibiscus-9bf.notion.site/socket-io-241f7b6d2d0f8043a286d0a11cfa07d1)
- [api 훅빌더로 네이밍 훅 쉽게 만들기](https://almondine-hibiscus-9bf.notion.site/api-hook-builder-RTK-a2a3686f01754b80b4dc9c7c69ecc051)
- [Zod로 안전한 폼 검증 훅 만들기](https://almondine-hibiscus-9bf.notion.site/zod-input-241f7b6d2d0f8018a4f5c0c07c6e5f6d?pvs=74)

</details>


## 1. 서비스 소개

홍풍은 홍익대학교 풍물패 연합의 연습실 예약을 위한 모바일 애플리케이션입니다. 동아리원들이 쉽고 편리하게 연습실을 예약하고 관리할 수 있도록 도와줍니다.

**주요 기능:**
- **간편한 예약**: QR 코드 스캔으로 빠른 예약
- **동아리 관리**: 동아리원 정보 및 권한 관리
- **악기 관리**: 악기 등록 및 관리 시스템
- **세션 관리**: 연습 세션 생성 및 참여
- **실시간 알림**: 푸시 알림으로 예약 상태 확인

### [홍풍 간단히 알아보기](https://green-bath-cc7.notion.site/1b62749b6fda80c69245f995bab2e031)

<br/><br/>

## 2. 사용 스택

<div align="left">
<div>
<img src="https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white">
<img src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white">
</div>
<div>
<img src="https://img.shields.io/badge/Jotai-000000?style=flat-square&logo=jotai&logoColor=white">
<img src="https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white">
<img src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white">
<img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white">
</div>
</div>

<br/><br/>

## 3. 아키텍처

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 기반으로 구성되어 있습니다.

```bash
src/
├── app/                    # 애플리케이션 설정
│   ├── AppContainer.tsx    # 앱 컨테이너
│   ├── index.tsx          # 진입점
│   └── lib/               # 앱 레벨 유틸리티
├── entities/              # 비즈니스 엔티티
│   ├── auth/              # 인증 엔티티
│   ├── club/              # 동아리 엔티티
│   ├── member/            # 이용자 엔티티
│   ├── instrument/        # 악기 엔티티
│   ├── reservation/       # 예약 엔티티
│   ├── session/           # 세션 엔티티
│   ├── notification/      # 알림 엔티티
│   ├── banner/            # 배너 엔티티
│   ├── notice/            # 공지사항 엔티티
│   └── session-log/       # 세션 로그 엔티티
├── features/              # 비즈니스 기능
│   ├── auth/              # 인증 기능
│   ├── club/              # 동아리 관리 기능
│   ├── member/            # 이용자 관리 기능
│   ├── instrument/        # 악기 관리 기능
│   ├── reservation/       # 예약 기능
│   ├── session/           # 세션 관리 기능
│   ├── notification/      # 알림 관리 기능
│   └── permission/        # 권한 관리 기능
├── widgets/               # UI 위젯
│   ├── auth/              # 인증 위젯
│   ├── club/              # 동아리 위젯
│   ├── member/            # 이용자 위젯
│   ├── instrument/        # 악기 위젯
│   ├── reservation/       # 예약 위젯
│   ├── session/           # 세션 위젯
│   ├── notification/      # 알림 위젯
│   ├── banner/            # 배너 위젯
│   ├── notice/            # 공지사항 위젯
│   └── session-log/       # 세션 로그 위젯
├── pages/                 # 페이지 컴포넌트
│   ├── auth/              # 인증 페이지
│   ├── club/              # 동아리 페이지
│   ├── member/            # 이용자 페이지
│   ├── instrument/        # 악기 페이지
│   ├── reservation/       # 예약 페이지
│   ├── session/           # 세션 페이지
│   ├── notification/      # 알림 페이지
│   ├── notice/            # 공지사항 페이지
│   ├── permission/        # 권한 페이지
│   ├── session-log/       # 세션 로그 페이지
│   ├── setting/           # 설정 페이지
│   ├── tutorial/          # 튜토리얼 페이지
│   └── webview/           # 웹뷰 페이지
├── common/                # 공통 모듈
│   ├── api/               # API 관련
│   ├── atom/              # Jotai 상태 관리
│   ├── config/            # 설정 파일
│   ├── constant/          # 상수
│   ├── hoc/               # 고차 컴포넌트
│   ├── lib/               # 유틸리티 함수
│   ├── navigation/        # 네비게이션
│   ├── types/             # 타입 정의
│   └── ui/                # 공통 UI 컴포넌트
└── navigation/            # 네비게이션 설정
```


## 4. 주요 기능

### 인증 시스템
- 로그인/로그아웃
- 회원가입
- 비밀번호 재설정
- 자동 로그인
- 회원 탈퇴

### 동아리 관리
- 동아리 선택
- 동아리 정보 조회
- 동아리원 관리

### 악기 관리
- 악기 등록/수정/삭제
- 악기 목록 조회
- 악기 설정 관리

###  예약 시스템
- 연습실 예약
- 예약 수정/취소
- 예약 내역 조회
- QR 코드 스캔

### 세션 관리
- 세션 생성/수정/삭제
- 세션 참여/퇴장
- 세션 로그 관리

### 알림 시스템
- 푸시 알림
- 알림 토큰 관리
- 읽지 않은 알림 관리

### 기타 기능
- 배너 관리
- 공지사항
- 권한 관리
- 튜토리얼

## 5. 개발 가이드

### 코드 스타일
- TypeScript 사용
- ESLint + Prettier 적용
- FSD 아키텍처 준수

### 상태 관리
- **Jotai**: 전역 상태 관리
- **React Query**: 서버 상태 관리

### API 통신
- fetch 기반 API 클라이언트
- Zod를 통한 타입 검증

### 브랜치 전략
- `main`: 프로덕션 브랜치
- `dev`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `fix/*`: 버그 수정 브랜치

<br/><br/>

## 6. 참여자

<table>
  <tr align="center">
    <td>
      FE, UI•UX
    </td>
  </tr>
  <tr align="center">
    <td>
      <a href="https://github.com/Wide-Pants">
        <img src="https://github.com/Wide-Pants.png?size=100"/>
      </a>
      <br>
      <a href="https://github.com/Wide-Pants">강윤호@Wide-Pants</a>
    </td>
  </tr>
</table>
