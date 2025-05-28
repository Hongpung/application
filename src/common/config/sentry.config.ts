import * as Sentry from "@sentry/react-native";

// 환경별 설정
const getEnvironment = () => {
  if (__DEV__) return "development";
  if (process.env.EXPO_PUBLIC_ENVIRONMENT === "staging") return "staging";
  return "production";
};

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

export const initializeSentry = () => {
  if (!process.env.EXPO_PUBLIC_SENTRY_DSN) {
    console.warn(
      "Sentry DSN이 설정되지 않았습니다. 성능 모니터링이 비활성화됩니다.",
    );
    return;
  }

  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: getEnvironment(),
    integrations: [navigationIntegration],

    // 에러 추적 설정
    beforeSend: (event) => {
      // 개발 환경에서는 콘솔에도 출력
      if (__DEV__) {
        console.error("Sentry Error:", event.exception);
      }

      // 민감한 정보 필터링
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }

      return event;
    },

    // 성능 모니터링 설정 (Expo에서는 제한적)
    tracesSampleRate: __DEV__ ? 0.1 : 0.01, // 실제 프로덕션에서는 낮게 설정

    // 릴리즈 추적 (Expo 업데이트 버전 사용)
    release: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",

    // 세션 추적
    enableAutoSessionTracking: true,

    // 첨부 파일 크기 제한
    maxBreadcrumbs: 50,

    // Expo 전용 설정
    enableNativeCrashHandling: true,
    enableNativeNagger: false, // Expo에서는 false 권장
  });

  // 사용자 정보 설정 (로그인 시 호출)
  Sentry.setUser({
    id: "guest",
    username: "anonymous",
  });
};

// 커스텀 성능 측정 유틸리티
export const performanceMonitor = {
  // 사용자 액션 추적
  trackUserAction: (actionName: string, data?: Record<string, unknown>) => {
    Sentry.addBreadcrumb({
      message: `User Action: ${actionName}`,
      level: "info",
      data,
    });
  },

  // 페이지 방문 추적
  trackPageView: (pageName: string) => {
    Sentry.addBreadcrumb({
      message: `Page View: ${pageName}`,
      level: "info",
      category: "navigation",
    });
  },

  // API 호출 추적
  trackAPICall: (endpoint: string, method: string, status?: number) => {
    Sentry.addBreadcrumb({
      message: `API Call: ${method} ${endpoint}`,
      level: status && status >= 400 ? "error" : "info",
      category: "http",
      data: { endpoint, method, status },
    });
  },

  // 비즈니스 메트릭 추적
  trackBusinessEvent: (
    eventName: string,
    value?: number,
    metadata?: Record<string, unknown>,
  ) => {
    Sentry.addBreadcrumb({
      message: `Business Event: ${eventName}`,
      level: "info",
      category: "business",
      data: { value, ...metadata },
    });
  },

  // Expo 특화 메트릭
  trackExpoUpdate: (updateId: string, isFirstRun: boolean) => {
    Sentry.setTag("expo.update_id", updateId);
    Sentry.setTag("expo.is_first_run", isFirstRun.toString());
  },

  // 네트워크 상태 추적
  trackNetworkStatus: (isConnected: boolean, networkType?: string) => {
    Sentry.setTag("network.connected", isConnected.toString());
    if (networkType) {
      Sentry.setTag("network.type", networkType);
    }
  },

  // 에러 컨텍스트 추가
  addErrorContext: (key: string, value: unknown) => {
    Sentry.setContext(key, value as { [key: string]: unknown } | null);
  },

  // 사용자 정보 설정
  setUser: (userId: string, email?: string, username?: string) => {
    Sentry.setUser({
      id: userId,
      email,
      username,
    });
  },

  // 수동 에러 리포팅
  captureError: (error: Error, context?: Record<string, unknown>) => {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext("error_context", context);
      }
      Sentry.captureException(error);
    });
  },

  // 성능 메트릭 (수동)
  startPerformanceTracking: (name: string) => {
    const startTime = Date.now();

    return {
      finish: () => {
        const duration = Date.now() - startTime;
        Sentry.addBreadcrumb({
          message: `Performance: ${name}`,
          level: "info",
          category: "performance",
          data: { duration },
        });
      },
    };
  },

  // 메모리 사용량 추적 (React Native에서는 제한적)
  trackMemoryUsage: () => {
    // React Native에서는 performance.memory가 없으므로 기본 메트릭만 추적
    Sentry.addBreadcrumb({
      message: "Memory Usage Check",
      level: "info",
      category: "performance",
      data: {
        timestamp: Date.now(),
        platform: "react-native",
      },
    });
  },
};

// API 빌더용 전용 함수들
export const trackApiCall = (
  endpoint: string,
  method: string,
  metadata?: Record<string, unknown>,
) => {
  const startTime = Date.now();

  // API 호출 시작 breadcrumb
  Sentry.addBreadcrumb({
    message: `API Call Start: ${method} ${endpoint}`,
    level: "info",
    category: "http",
    data: { endpoint, method, ...metadata },
  });

  return {
    setTag: (key: string, value: string | boolean) => {
      Sentry.setTag(key, value);
    },
    setMeasurement: (key: string, value: number) => {
      Sentry.addBreadcrumb({
        message: `API Measurement: ${key}`,
        level: "info",
        category: "performance",
        data: { key, value, endpoint, method },
      });
    },
    finish: () => {
      const duration = Date.now() - startTime;
      Sentry.addBreadcrumb({
        message: `API Call Complete: ${method} ${endpoint}`,
        level: "info",
        category: "http",
        data: { endpoint, method, duration },
      });
    },
  };
};

export const trackError = (
  message: string,
  context?: Record<string, unknown>,
) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("api_error", context);
    }
    scope.setLevel("error");
    Sentry.captureMessage(message);
  });
};
