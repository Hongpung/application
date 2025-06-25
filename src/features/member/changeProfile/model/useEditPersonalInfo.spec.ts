import { renderHook } from "@testing-library/react-native";
import { useValidatedForm } from "@hongpung/src/common";
import { useEditPersonalInfo } from "./useEditPersonalInfo";
import { editPersonalInfoSchema, type EditPersonalInfoSchema } from "./editPersonalInfoSchema";

// Mock dependencies
jest.mock("@hongpung/src/common");

const mockUseValidatedForm = useValidatedForm as jest.MockedFunction<typeof useValidatedForm>;

describe("useEditPersonalInfo", () => {
  const mockValidatedFormReturn = {
    nickname: "",
    setNickname: jest.fn(),
    nicknameValidation: { state: "VALID" as const },
    validateNickname: jest.fn(),

    enrollmentNumber: "",
    setEnrollmentNumber: jest.fn(),
    enrollmentNumberValidation: { state: "VALID" as const },
    validateEnrollmentNumber: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseValidatedForm.mockReturnValue(mockValidatedFormReturn as any);
  });

  describe("초기화", () => {
    it("초기값으로 useValidatedForm을 올바르게 호출한다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: "홍길동",
        enrollmentNumber: "21",
      };

      renderHook(() => useEditPersonalInfo({ initialValues }));

      expect(mockUseValidatedForm).toHaveBeenCalledWith({
        schema: editPersonalInfoSchema,
        defaultValues: {
          nickname: "홍길동",
          enrollmentNumber: "21",
        },
        initialValidation: {
          nickname: { state: "VALID" },
          enrollmentNumber: { state: "VALID" },
        },
      });
    });

    it("빈 초기값으로 useValidatedForm을 올바르게 호출한다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: "",
        enrollmentNumber: "",
      };

      renderHook(() => useEditPersonalInfo({ initialValues }));

      expect(mockUseValidatedForm).toHaveBeenCalledWith({
        schema: editPersonalInfoSchema,
        defaultValues: {
          nickname: "",
          enrollmentNumber: "",
        },
        initialValidation: {
          nickname: { state: "VALID" },
          enrollmentNumber: { state: "VALID" },
        },
      });
    });

    it("undefined 속성이 있는 초기값을 처리한다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: undefined as any,
        enrollmentNumber: "23",
      };

      renderHook(() => useEditPersonalInfo({ initialValues }));

      expect(mockUseValidatedForm).toHaveBeenCalledWith({
        schema: editPersonalInfoSchema,
        defaultValues: {
          nickname: undefined,
          enrollmentNumber: "23",
        },
        initialValidation: {
          nickname: { state: "VALID" },
          enrollmentNumber: { state: "VALID" },
        },
      });
    });
  });

  describe("반환값", () => {
    it("useValidatedForm의 모든 속성을 반환한다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: "김철수",
        enrollmentNumber: "20",
      };

      const { result } = renderHook(() => useEditPersonalInfo({ initialValues }));

      // useValidatedForm에서 반환하는 모든 속성이 포함되어야 함
      expect(result.current).toHaveProperty("nickname");
      expect(result.current).toHaveProperty("setNickname");
      expect(result.current).toHaveProperty("nicknameValidation");
      expect(result.current).toHaveProperty("validateNickname");
      expect(result.current).toHaveProperty("enrollmentNumber");
      expect(result.current).toHaveProperty("setEnrollmentNumber");
      expect(result.current).toHaveProperty("enrollmentNumberValidation");
      expect(result.current).toHaveProperty("validateEnrollmentNumber");
    });

    it("useValidatedForm 반환값을 그대로 스프레드하여 반환한다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: "이영희",
        enrollmentNumber: "22",
      };

      const customMockReturn = {
        nickname: "이영희",
        setNickname: jest.fn(),
        nicknameValidation: { state: "VALID" as const },
        validateNickname: jest.fn(),
        enrollmentNumber: "22",
        setEnrollmentNumber: jest.fn(),
        enrollmentNumberValidation: { state: "VALID" as const },
        validateEnrollmentNumber: jest.fn(),
        customProperty: "test", // 추가 속성
      };

      mockUseValidatedForm.mockReturnValue(customMockReturn as any);

      const { result } = renderHook(() => useEditPersonalInfo({ initialValues }));

      expect(result.current).toEqual(customMockReturn);
    });
  });

  describe("다양한 초기값 테스트", () => {
    it("최대 길이의 유효한 값들로 초기화된다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: "김이름이긴편인사람",
        enrollmentNumber: "99",
      };

      renderHook(() => useEditPersonalInfo({ initialValues }));

      expect(mockUseValidatedForm).toHaveBeenCalledWith({
        schema: editPersonalInfoSchema,
        defaultValues: {
          nickname: "김이름이긴편인사람",
          enrollmentNumber: "99",
        },
        initialValidation: {
          nickname: { state: "VALID" },
          enrollmentNumber: { state: "VALID" },
        },
      });
    });

    it("최소 길이의 유효한 값들로 초기화된다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: "김",
        enrollmentNumber: "01",
      };

      renderHook(() => useEditPersonalInfo({ initialValues }));

      expect(mockUseValidatedForm).toHaveBeenCalledWith({
        schema: editPersonalInfoSchema,
        defaultValues: {
          nickname: "김",
          enrollmentNumber: "01",
        },
        initialValidation: {
          nickname: { state: "VALID" },
          enrollmentNumber: { state: "VALID" },
        },
      });
    });
  });

  describe("useValidatedForm 호출 검증", () => {
    it("editPersonalInfoSchema를 올바른 스키마로 전달한다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: "테스트",
        enrollmentNumber: "12",
      };

      renderHook(() => useEditPersonalInfo({ initialValues }));

      const callArgs = mockUseValidatedForm.mock.calls[0][0];
      expect(callArgs.schema).toBe(editPersonalInfoSchema);
    });

    it("항상 같은 initialValidation 객체를 전달한다", () => {
      const initialValues: EditPersonalInfoSchema = {
        nickname: "테스트",
        enrollmentNumber: "34",
      };

      renderHook(() => useEditPersonalInfo({ initialValues }));

      const callArgs = mockUseValidatedForm.mock.calls[0][0];
      expect(callArgs.initialValidation).toEqual({
        nickname: { state: "VALID" },
        enrollmentNumber: { state: "VALID" },
      });
    });
  });

  describe("props 변경 처리", () => {
    it("initialValues가 변경되어도 새로운 렌더링에서 올바르게 처리된다", () => {
      const initialValues1: EditPersonalInfoSchema = {
        nickname: "첫번째",
        enrollmentNumber: "11",
      };

      const initialValues2: EditPersonalInfoSchema = {
        nickname: "두번째",
        enrollmentNumber: "22",
      };

      const { rerender } = renderHook(
        ({ initialValues }) => useEditPersonalInfo({ initialValues }),
        { initialProps: { initialValues: initialValues1 } }
      );

      expect(mockUseValidatedForm).toHaveBeenLastCalledWith({
        schema: editPersonalInfoSchema,
        defaultValues: {
          nickname: "첫번째",
          enrollmentNumber: "11",
        },
        initialValidation: {
          nickname: { state: "VALID" },
          enrollmentNumber: { state: "VALID" },
        },
      });

      rerender({ initialValues: initialValues2 });

      expect(mockUseValidatedForm).toHaveBeenLastCalledWith({
        schema: editPersonalInfoSchema,
        defaultValues: {
          nickname: "두번째",
          enrollmentNumber: "22",
        },
        initialValidation: {
          nickname: { state: "VALID" },
          enrollmentNumber: { state: "VALID" },
        },
      });
    });
  });

  describe("타입 안전성", () => {
    it("올바른 타입의 initialValues를 받는다", () => {
      // 이는 TypeScript 컴파일 타임에 검증되지만, 런타임에서도 확인
      const validInitialValues: EditPersonalInfoSchema = {
        nickname: "유효한닉네임",
        enrollmentNumber: "12",
      };

      expect(() => {
        renderHook(() => useEditPersonalInfo({ initialValues: validInitialValues }));
      }).not.toThrow();
    });
  });
}); 