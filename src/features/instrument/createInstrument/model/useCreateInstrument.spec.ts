import { renderHook, act } from "@testing-library/react-native";
import { useCreateInstrument } from "./useCreateInstrument";

// Mock 함수들을 변수로 선언
const mockNavigateToInstrumentDetail = jest.fn();
const mockCreateInstrumentRequest = jest.fn();
const mockPickImageFromAlbum = jest.fn();
const mockResetImage = jest.fn();
const mockAlert = jest.fn();
const mockShowCreateInstrumentCompleteToast = jest.fn();
const mockParseInstrumentCreateBody = jest.fn();

// 외부 의존성 모킹
jest.mock("@hongpung/src/common", () => ({
  Alert: {
    alert: mockAlert,
  },
  useImagePicker: () => ({
    pickImageFromAlbum: mockPickImageFromAlbum,
    selectedImage: null,
    selectedImageUri: null,
    resetImage: mockResetImage,
  }),
  useValidatedForm: () => ({
    instrumentType: null,
    name: "",
    selectedImage: null,
    instrumentTypeValidation: { state: "BEFORE" },
    nameValidation: { state: "BEFORE" },
    selectedImageValidation: { state: "BEFORE" },
    setInstrumentType: jest.fn(),
    setName: jest.fn(),
    setSelectedImage: jest.fn(),
    validateInstrumentType: jest.fn(),
    validateName: jest.fn(),
    validateSelectedImage: jest.fn(),
  }),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  StackActions: {
    replace: jest.fn(),
  },
}));

jest.mock("../api/createInstrumentApi", () => ({
  useCreateInsrumentRequest: () => ({
    request: mockCreateInstrumentRequest,
    isLoading: false,
  }),
}));

jest.mock("../lib/parseInstrumentCreateBody", () => ({
  parseInstrumentCreateBody: mockParseInstrumentCreateBody,
}));

jest.mock("../constant/toastAction", () => ({
  showCreateInstrumentCompleteToast: mockShowCreateInstrumentCompleteToast,
}));

describe("useCreateInstrument Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateInstrumentRequest.mockResolvedValue({ instrumentId: 123 });
    mockParseInstrumentCreateBody.mockResolvedValue({
      name: "테스트 악기",
      instrumentType: "PIANO",
      selectedImage: new File([], "test.jpg"),
    });
  });

  it("초기 상태를 확인한다", () => {
    const { result } = renderHook(() =>
      useCreateInstrument({
        navigateToInstrumentDetail: mockNavigateToInstrumentDetail,
      })
    );

    expect(result.current.instrumentType).toBe(null);
    expect(result.current.name).toBe("");
    expect(result.current.selectedImage).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.createInstrumentRequest).toBe("function");
    expect(typeof result.current.pickImageFromAlbum).toBe("function");
    expect(typeof result.current.resetImage).toBe("function");
  });

  it("악기 종류가 선택되지 않았을 때 에러 메시지를 보여준다", async () => {
    // instrumentTypeValidation을 ERROR 상태로 모킹
    jest.doMock("@hongpung/src/common", () => ({
      Alert: {
        alert: mockAlert,
      },
      useImagePicker: () => ({
        pickImageFromAlbum: mockPickImageFromAlbum,
        selectedImage: null,
        selectedImageUri: null,
        resetImage: mockResetImage,
      }),
      useValidatedForm: () => ({
        instrumentType: null,
        name: "테스트 악기",
        selectedImage: new File([], "test.jpg"),
        instrumentTypeValidation: { state: "ERROR", errorText: "악기 종류를 선택해주세요." },
        nameValidation: { state: "VALID" },
        selectedImageValidation: { state: "VALID" },
        setInstrumentType: jest.fn(),
        setName: jest.fn(),
        setSelectedImage: jest.fn(),
        validateInstrumentType: jest.fn(),
        validateName: jest.fn(),
        validateSelectedImage: jest.fn(),
      }),
    }));

    const { result } = renderHook(() =>
      useCreateInstrument({
        navigateToInstrumentDetail: mockNavigateToInstrumentDetail,
      })
    );

    await act(async () => {
      await result.current.createInstrumentRequest();
    });

    expect(mockAlert).toHaveBeenCalledWith("오류", "악기 종류를 선택해주세요.");
    expect(mockCreateInstrumentRequest).not.toHaveBeenCalled();
    expect(mockNavigateToInstrumentDetail).not.toHaveBeenCalled();
  });

  it("악기 생성 성공 시 토스트 메시지와 네비게이션을 호출한다", async () => {
    // 유효한 폼 상태로 모킹
    jest.doMock("@hongpung/src/common", () => ({
      Alert: {
        alert: mockAlert,
      },
      useImagePicker: () => ({
        pickImageFromAlbum: mockPickImageFromAlbum,
        selectedImage: new File([], "test.jpg"),
        selectedImageUri: "file://test.jpg",
        resetImage: mockResetImage,
      }),
      useValidatedForm: () => ({
        instrumentType: "PIANO",
        name: "테스트 피아노",
        selectedImage: new File([], "test.jpg"),
        instrumentTypeValidation: { state: "VALID" },
        nameValidation: { state: "VALID" },
        selectedImageValidation: { state: "VALID" },
        setInstrumentType: jest.fn(),
        setName: jest.fn(),
        setSelectedImage: jest.fn(),
        validateInstrumentType: jest.fn(),
        validateName: jest.fn(),
        validateSelectedImage: jest.fn(),
      }),
    }));

    const { result } = renderHook(() =>
      useCreateInstrument({
        navigateToInstrumentDetail: mockNavigateToInstrumentDetail,
      })
    );

    await act(async () => {
      await result.current.createInstrumentRequest();
    });

    expect(mockParseInstrumentCreateBody).toHaveBeenCalled();
    expect(mockCreateInstrumentRequest).toHaveBeenCalled();
    expect(mockShowCreateInstrumentCompleteToast).toHaveBeenCalled();
    expect(mockNavigateToInstrumentDetail).toHaveBeenCalledWith(123);
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it("API 요청 실패 시 에러 메시지를 보여준다", async () => {
    const errorMessage = "서버 오류가 발생했습니다";
    mockCreateInstrumentRequest.mockRejectedValueOnce(new Error(errorMessage));

    // 유효한 폼 상태로 모킹
    jest.doMock("@hongpung/src/common", () => ({
      Alert: {
        alert: mockAlert,
      },
      useImagePicker: () => ({
        pickImageFromAlbum: mockPickImageFromAlbum,
        selectedImage: new File([], "test.jpg"),
        selectedImageUri: "file://test.jpg",
        resetImage: mockResetImage,
      }),
      useValidatedForm: () => ({
        instrumentType: "PIANO",
        name: "테스트 피아노",
        selectedImage: new File([], "test.jpg"),
        instrumentTypeValidation: { state: "VALID" },
        nameValidation: { state: "VALID" },
        selectedImageValidation: { state: "VALID" },
        setInstrumentType: jest.fn(),
        setName: jest.fn(),
        setSelectedImage: jest.fn(),
        validateInstrumentType: jest.fn(),
        validateName: jest.fn(),
        validateSelectedImage: jest.fn(),
      }),
    }));

    const { result } = renderHook(() =>
      useCreateInstrument({
        navigateToInstrumentDetail: mockNavigateToInstrumentDetail,
      })
    );

    await act(async () => {
      await result.current.createInstrumentRequest();
    });

    expect(mockAlert).toHaveBeenCalledWith("오류", `오류가 발생했어요.\n(${errorMessage})`);
    expect(mockShowCreateInstrumentCompleteToast).not.toHaveBeenCalled();
    expect(mockNavigateToInstrumentDetail).not.toHaveBeenCalled();
  });

  it("알 수 없는 오류 발생 시 기본 에러 메시지를 보여준다", async () => {
    mockCreateInstrumentRequest.mockRejectedValueOnce("알 수 없는 오류");

    // 유효한 폼 상태로 모킹
    jest.doMock("@hongpung/src/common", () => ({
      Alert: {
        alert: mockAlert,
      },
      useImagePicker: () => ({
        pickImageFromAlbum: mockPickImageFromAlbum,
        selectedImage: new File([], "test.jpg"),
        selectedImageUri: "file://test.jpg",
        resetImage: mockResetImage,
      }),
      useValidatedForm: () => ({
        instrumentType: "PIANO",
        name: "테스트 피아노",
        selectedImage: new File([], "test.jpg"),
        instrumentTypeValidation: { state: "VALID" },
        nameValidation: { state: "VALID" },
        selectedImageValidation: { state: "VALID" },
        setInstrumentType: jest.fn(),
        setName: jest.fn(),
        setSelectedImage: jest.fn(),
        validateInstrumentType: jest.fn(),
        validateName: jest.fn(),
        validateSelectedImage: jest.fn(),
      }),
    }));

    const { result } = renderHook(() =>
      useCreateInstrument({
        navigateToInstrumentDetail: mockNavigateToInstrumentDetail,
      })
    );

    await act(async () => {
      await result.current.createInstrumentRequest();
    });

    expect(mockAlert).toHaveBeenCalledWith(
      "오류",
      "알수 없는 원인에 의해 실패했어요.\n관리자에게 문의해주세요"
    );
    expect(mockShowCreateInstrumentCompleteToast).not.toHaveBeenCalled();
    expect(mockNavigateToInstrumentDetail).not.toHaveBeenCalled();
  });

  it("로딩 상태를 올바르게 반환한다", () => {
    jest.doMock("../api/createInstrumentApi", () => ({
      useCreateInsrumentRequest: () => ({
        request: mockCreateInstrumentRequest,
        isLoading: true,
      }),
    }));

    const { result } = renderHook(() =>
      useCreateInstrument({
        navigateToInstrumentDetail: mockNavigateToInstrumentDetail,
      })
    );

    expect(result.current.isLoading).toBe(true);
  });
}); 