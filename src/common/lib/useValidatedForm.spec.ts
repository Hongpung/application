import { renderHook, act } from "@testing-library/react-native";
import { z } from "zod";
import { useValidatedForm } from "./useValidatedForm";

// 테스트용 스키마 정의
const TestSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
    ),
  name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
});

type TestFormData = z.infer<typeof TestSchema>;

describe("useValidatedForm 테스트", () => {
  const defaultValues: TestFormData = {
    email: "",
    password: "",
    name: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("초기 상태 테스트", () => {
    it("기본값으로 폼 데이터가 초기화된다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      expect(result.current.email).toBe("");
      expect(result.current.password).toBe("");
      expect(result.current.name).toBe("");
    });

    it("모든 필드의 검증 상태가 BEFORE로 초기화된다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      expect(result.current.emailValidation).toEqual({ state: "BEFORE" });
      expect(result.current.passwordValidation).toEqual({ state: "BEFORE" });
      expect(result.current.nameValidation).toEqual({ state: "BEFORE" });
    });

    it("초기 검증 상태를 커스텀으로 설정할 수 있다", () => {
      const initialValidation = {
        email: { state: "VALID" as const },
      };

      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
          initialValidation,
        })
      );

      expect(result.current.emailValidation).toEqual({ state: "VALID" });
      expect(result.current.passwordValidation).toEqual({ state: "BEFORE" });
    });
  });

  describe("필드 값 설정 테스트", () => {
    it("이메일 값 설정 시 상태가 PENDING으로 변경된다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      act(() => {
        result.current.setEmail("test@example.com");
      });

      expect(result.current.email).toBe("test@example.com");
      expect(result.current.emailValidation).toEqual({ state: "PENDING" });
    });

    it("비밀번호 값 설정 시 상태가 PENDING으로 변경된다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      act(() => {
        result.current.setPassword("newPassword123!");
      });

      expect(result.current.password).toBe("newPassword123!");
      expect(result.current.passwordValidation).toEqual({ state: "PENDING" });
    });

    it("이름 값 설정 시 상태가 PENDING으로 변경된다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      act(() => {
        result.current.setName("홍길동");
      });

      expect(result.current.name).toBe("홍길동");
      expect(result.current.nameValidation).toEqual({ state: "PENDING" });
    });
  });

  describe("Zod 기반 검증 테스트", () => {
    describe("이메일 검증", () => {
      it("유효한 이메일 입력 시 검증이 성공한다", () => {
        const { result } = renderHook(() =>
          useValidatedForm({
            schema: TestSchema,
            defaultValues,
          })
        );

        act(() => {
          result.current.setEmail("test@example.com");
        });

        act(() => {
          result.current.validateEmail();
        });

        expect(result.current.emailValidation).toEqual({ state: "VALID" });
      });

      it("빈 이메일 입력 시 에러 메시지를 보여준다", () => {
        const { result } = renderHook(() =>
          useValidatedForm({
            schema: TestSchema,
            defaultValues,
          })
        );

        act(() => {
          result.current.setEmail("");
        });

        act(() => {
          result.current.validateEmail();
        });

        expect(result.current.emailValidation).toEqual({
          state: "ERROR",
          errorText: "이메일을 입력해주세요.",
        });
      });

      it("잘못된 이메일 형식 입력 시 에러 메시지를 보여준다", () => {
        const { result } = renderHook(() =>
          useValidatedForm({
            schema: TestSchema,
            defaultValues,
          })
        );

        act(() => {
          result.current.setEmail("invalid-email");
        });

        act(() => {
          result.current.validateEmail();
        });

        expect(result.current.emailValidation).toEqual({
          state: "ERROR",
          errorText: "올바른 이메일 형식이 아닙니다.",
        });
      });
    });

    describe("비밀번호 검증", () => {
      it("유효한 비밀번호 입력 시 검증이 성공한다", () => {
        const { result } = renderHook(() =>
          useValidatedForm({
            schema: TestSchema,
            defaultValues,
          })
        );

        act(() => {
          result.current.setPassword("validPassword123!");
        });

        act(() => {
          result.current.validatePassword();
        });

        expect(result.current.passwordValidation).toEqual({ state: "VALID" });
      });

      it("짧은 비밀번호 입력 시 에러 메시지를 보여준다", () => {
        const { result } = renderHook(() =>
          useValidatedForm({
            schema: TestSchema,
            defaultValues,
          })
        );

        act(() => {
          result.current.setPassword("short");
        });

        act(() => {
          result.current.validatePassword();
        });

        expect(result.current.passwordValidation).toEqual({
          state: "ERROR",
          errorText: "비밀번호는 8자 이상이어야 합니다.",
        });
      });

      it("형식에 맞지 않는 비밀번호 입력 시 에러 메시지를 보여준다", () => {
        const { result } = renderHook(() =>
          useValidatedForm({
            schema: TestSchema,
            defaultValues,
          })
        );

        act(() => {
          result.current.setPassword("onlyletters");
        });

        act(() => {
          result.current.validatePassword();
        });

        expect(result.current.passwordValidation).toEqual({
          state: "ERROR",
          errorText: "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.",
        });
      });
    });

    describe("이름 검증", () => {
      it("유효한 이름 입력 시 검증이 성공한다", () => {
        const { result } = renderHook(() =>
          useValidatedForm({
            schema: TestSchema,
            defaultValues,
          })
        );

        act(() => {
          result.current.setName("홍길동");
        });

        act(() => {
          result.current.validateName();
        });

        expect(result.current.nameValidation).toEqual({ state: "VALID" });
      });

      it("짧은 이름 입력 시 에러 메시지를 보여준다", () => {
        const { result } = renderHook(() =>
          useValidatedForm({
            schema: TestSchema,
            defaultValues,
          })
        );

        act(() => {
          result.current.setName("홍");
        });

        act(() => {
          result.current.validateName();
        });

        expect(result.current.nameValidation).toEqual({
          state: "ERROR",
          errorText: "이름은 2자 이상이어야 합니다.",
        });
      });
    });
  });

  describe("검증 상태 직접 설정 테스트", () => {
    it("이메일 검증 상태를 직접 설정할 수 있다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      const customValidation = {
        state: "ERROR" as const,
        errorText: "커스텀 에러 메시지",
      };

      act(() => {
        result.current.setEmailValidation(customValidation);
      });

      expect(result.current.emailValidation).toEqual(customValidation);
    });

    it("비밀번호 검증 상태를 직접 설정할 수 있다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      const customValidation = { state: "VALID" as const };

      act(() => {
        result.current.setPasswordValidation(customValidation);
      });

      expect(result.current.passwordValidation).toEqual(customValidation);
    });
  });

  describe("복합 시나리오 테스트", () => {
    it("사용자가 유효한 폼을 순차적으로 입력하면 모든 검증이 성공한다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      // 이메일 입력 및 검증
      act(() => {
        result.current.setEmail("user@example.com");
      });

      act(() => {
        result.current.validateEmail();
      });

      // 비밀번호 입력 및 검증
      act(() => {
        result.current.setPassword("securePassword123!");
      });

      act(() => {
        result.current.validatePassword();
      });

      // 이름 입력 및 검증
      act(() => {
        result.current.setName("김철수");
      });

      act(() => {
        result.current.validateName();
      });

      expect(result.current.emailValidation).toEqual({ state: "VALID" });
      expect(result.current.passwordValidation).toEqual({ state: "VALID" });
      expect(result.current.nameValidation).toEqual({ state: "VALID" });
    });

    it("사용자가 잘못된 값들을 입력하면 각각에 맞는 에러 메시지를 보여준다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      // 잘못된 이메일 입력
      act(() => {
        result.current.setEmail("invalid");
      });
      act(() => {
        result.current.validateEmail();
      });

      // 짧은 비밀번호 입력
      act(() => {
        result.current.setPassword("short");
      });
      act(() => {
        result.current.validatePassword();
      });

      // 짧은 이름 입력
      act(() => {
        result.current.setName("김");
      });
      act(() => {
        result.current.validateName();
      });
      

      expect(result.current.emailValidation).toEqual({
        state: "ERROR",
        errorText: "올바른 이메일 형식이 아닙니다.",
      });
      expect(result.current.passwordValidation).toEqual({
        state: "ERROR",
        errorText: "비밀번호는 8자 이상이어야 합니다.",
      });
      expect(result.current.nameValidation).toEqual({
        state: "ERROR",
        errorText: "이름은 2자 이상이어야 합니다.",
      });
    });

    it("값 변경 후 다시 검증하면 새로운 검증 결과를 반영한다", () => {
      const { result } = renderHook(() =>
        useValidatedForm({
          schema: TestSchema,
          defaultValues,
        })
      );

      // 처음에는 잘못된 이메일
      act(() => {
        result.current.setEmail("invalid");
      });
      act(() => {
        result.current.validateEmail();
      });
      expect(result.current.emailValidation.state).toBe("ERROR");

      // 올바른 이메일로 수정
      act(() => {
        result.current.setEmail("valid@example.com");
      });
      act(() => {
        result.current.validateEmail();
      });

      expect(result.current.emailValidation).toEqual({ state: "VALID" });
    });
  });
}); 