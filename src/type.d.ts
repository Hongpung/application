// 프로젝트 루트 또는 `src/types/` 경로에 배치 가능
declare global {
    type IsAny<T> = 0 extends (1 & T) ? true : false;

}

export {}; // 글로벌 타입 선언을 위해 필요
