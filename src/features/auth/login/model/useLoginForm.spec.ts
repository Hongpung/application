import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useLoginForm } from './useLoginForm';

// Mocks
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-navigation/native');
jest.mock('react-native-toast-message');
jest.mock('react-native');
jest.mock('@hongpung/src/entities/auth');
jest.mock('@hongpung/src/common');

jest.mock('lodash', () => ({
  debounce: (fn: any) => fn, // debounce를 그냥 통과시킴
}));

describe('useLoginForm Hook', () => {


  describe('초기 상태 확인', () => {
    it('초기값이 올바르게 설정된다', () => {
      const { result } = renderHook(() => useLoginForm());

      expect(result.current.email).toBe('');
      expect(result.current.password).toBe('');
      expect(result.current.options.autoLogin).toBe(false);
      expect(result.current.options.saveID).toBe(false);
      expect(result.current.emailValidation.state).toBe('BEFORE');
      expect(result.current.passwordValidation.state).toBe('BEFORE');
    });
  });

  describe('저장된 로그인 설정 로드', () => {
    it('ID 저장이 활성화되어 있고 저장된 이메일이 있으면 이메일을 자동으로 입력한다', async () => {
      const savedEmail = 'test@example.com';

      const { result } = renderHook(() => useLoginForm());

      await waitFor(() => {
        expect(result.current.email).toBe(savedEmail);
        expect(result.current.options.saveID).toBe(true);
        expect(result.current.emailValidation.state).toBe('VALID');
      });
    });

    it('ID 저장이 활성화되어 있지만 저장된 이메일이 없으면 saveID를 false로 설정한다', async () => {
      mockAsyncStorage.getItem
        .mockResolvedValueOnce('true') // saveID
        .mockResolvedValueOnce(null); // Email

      const { result } = renderHook(() => useLoginForm());

      await waitFor(() => {
        expect(result.current.options.saveID).toBe(false);
      });
    });
  });

  describe('옵션 설정', () => {
    it('ID 저장을 활성화하면 saveID 옵션이 true가 된다', () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.setSaveID(true);
      });

      expect(result.current.options.saveID).toBe(true);
    });

    it('ID 저장을 비활성화하면 autoLogin도 함께 비활성화된다', () => {
      const { result } = renderHook(() => useLoginForm());

      // 먼저 자동로그인을 활성화
      act(() => {
        result.current.setAutoLogin(true);
      });

      // ID 저장을 비활성화
      act(() => {
        result.current.setSaveID(false);
      });

      expect(result.current.options.saveID).toBe(false);
      expect(result.current.options.autoLogin).toBe(false);
    });

    it('자동로그인을 활성화하면 ID 저장도 함께 활성화된다', () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.setAutoLogin(true);
      });

      expect(result.current.options.autoLogin).toBe(true);
      expect(result.current.options.saveID).toBe(true);
    });
  });

  describe('폼 검증', () => {
    it('사용자가 유효하지 않은 이메일을 입력하면 에러 메시지를 보여준다', async () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.setEmail('invalid-email');
      });

      act(() => {
        result.current.validateEmail();
      });

      await waitFor(() => {
        expect(result.current.emailValidation.state).toBe('ERROR');
        if (result.current.emailValidation.state === 'ERROR') {
          expect(result.current.emailValidation.errorText).toBe('올바른 이메일 형식이 아닙니다.');
        }
      });
    });

    it('사용자가 유효한 이메일을 입력하면 검증이 통과된다', async () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.setEmail('test@example.com');
      });

      act(() => {
        result.current.validateEmail();
      });

      await waitFor(() => {
        expect(result.current.emailValidation.state).toBe('VALID');
      });
    });

    it('사용자가 8자 미만의 비밀번호를 입력하면 에러 메시지를 보여준다', async () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.setPassword('1234567');
      });

      act(() => {
        result.current.validatePassword();
      });

      await waitFor(() => {
        expect(result.current.passwordValidation.state).toBe('ERROR');
        if (result.current.passwordValidation.state === 'ERROR') {
          expect(result.current.passwordValidation.errorText).toBe('비밀번호는 8자 이상이어야 합니다.');
        }
      });
    });

    it('사용자가 영문, 숫자, 특수문자가 포함되지 않은 비밀번호를 입력하면 에러 메시지를 보여준다', async () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.setPassword('12345678');
      });

      act(() => {
        result.current.validatePassword();
      });

      await waitFor(() => {
        expect(result.current.passwordValidation.state).toBe('ERROR');
        if (result.current.passwordValidation.state === 'ERROR') {
          expect(result.current.passwordValidation.errorText).toBe('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.');
        }
      });
    });

    it('사용자가 유효한 비밀번호를 입력하면 검증이 통과된다', async () => {
      const { result } = renderHook(() => useLoginForm());

      act(() => {
        result.current.setPassword('Password123!');
      });

      act(() => {
        result.current.validatePassword();
      });

      await waitFor(() => {
        expect(result.current.passwordValidation.state).toBe('VALID');
      });
    });
  });

  describe('로그인 처리', () => {
    it('로그인 성공 시 토큰을 저장하고 메인 화면으로 이동한다', async () => {
      const mockToken = 'mock-token';
      const mockLoginRequest = jest.fn().mockResolvedValue({ token: mockToken });
      
      mockUseLoginRequest.mockReturnValue({
        request: mockLoginRequest,
        isLoading: false,
      });

      const { result } = renderHook(() => useLoginForm());

      // 유효한 폼 데이터 설정
      act(() => {
        result.current.setEmail('test@example.com');
        result.current.setPassword('Password123!');
        result.current.setAutoLogin(true);
      });

      // 검증 통과시키기
      act(() => {
        result.current.validateEmail();
        result.current.validatePassword();
      });

      await waitFor(() => {
        expect(result.current.emailValidation.state).toBe('VALID');
        expect(result.current.passwordValidation.state).toBe('VALID');
      });

      // 로그인 시도
      await act(async () => {
        await result.current.onLogin();
      });

      expect(mockLoginRequest).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(mockSaveToken).toHaveBeenCalledWith('token', mockToken);
      expect(mockNavigation.dispatch).toHaveBeenCalled();
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('autoLogin', 'true');
      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: '앞으로 앱 실행시 자동으로 로그인 돼요',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 3000,
      });
    });

    it('로그인 실패 시 적절한 에러 메시지를 보여준다', async () => {
      const mockLoginRequest = jest.fn().mockRejectedValue(new Error('Check Email Or Password!'));
      
      mockUseLoginRequest.mockReturnValue({
        request: mockLoginRequest,
        isLoading: false,
      });

      const { result } = renderHook(() => useLoginForm());

      // 유효한 폼 데이터 설정
      act(() => {
        result.current.setEmail('test@example.com');
        result.current.setPassword('Password123!');
      });

      // 검증 통과시키기
      act(() => {
        result.current.validateEmail();
        result.current.validatePassword();
      });

      await waitFor(() => {
        expect(result.current.emailValidation.state).toBe('VALID');
        expect(result.current.passwordValidation.state).toBe('VALID');
      });

      // 로그인 시도
      await act(async () => {
        await result.current.onLogin();
      });

      expect(result.current.emailValidation.state).toBe('ERROR');
      expect(result.current.passwordValidation.state).toBe('ERROR');
      if (result.current.passwordValidation.state === 'ERROR') {
        expect(result.current.passwordValidation.errorText).toBe('비밀번호가 틀리거나 가입되지 않은 이메일이에요.');
      }
    });

    it('가입 승인 대기 중인 계정으로 로그인 시 토스트 메시지를 보여준다', async () => {
      const mockLoginRequest = jest.fn().mockRejectedValue(new Error("You're not accepted"));
      
      mockUseLoginRequest.mockReturnValue({
        request: mockLoginRequest,
        isLoading: false,
      });

      const { result } = renderHook(() => useLoginForm());

      // 유효한 폼 데이터 설정
      act(() => {
        result.current.setEmail('test@example.com');
        result.current.setPassword('Password123!');
      });

      // 검증 통과시키기
      act(() => {
        result.current.validateEmail();
        result.current.validatePassword();
      });

      await waitFor(() => {
        expect(result.current.emailValidation.state).toBe('VALID');
        expect(result.current.passwordValidation.state).toBe('VALID');
      });

      // 로그인 시도
      await act(async () => {
        await result.current.onLogin();
      });

      expect(mockToast.show).toHaveBeenCalledWith({
        type: 'fail',
        text1: '가입이 진행중인 계정입니다\n(승낙시 확인 메일이 발송돼요)',
        position: 'bottom',
        bottomOffset: 60,
        visibilityTime: 3000,
      });
    });

    it('폼 검증 실패 시 로그인 요청을 보내지 않는다', async () => {
      const mockLoginRequest = jest.fn();
      
      mockUseLoginRequest.mockReturnValue({
        request: mockLoginRequest,
        isLoading: false,
      });

      const { result } = renderHook(() => useLoginForm());

      // 유효하지 않은 폼 데이터 설정
      act(() => {
        result.current.setEmail('invalid-email');
        result.current.setPassword('123');
      });

      // 로그인 시도 (검증 실패 상태)
      await act(async () => {
        await result.current.onLogin();
      });

      expect(mockLoginRequest).not.toHaveBeenCalled();
    });
  });

  describe('폼 상태 변경', () => {
    it('이메일 입력 시 상태가 업데이트된다', () => {
      const { result } = renderHook(() => useLoginForm());
      const testEmail = 'test@example.com';

      act(() => {
        result.current.setEmail(testEmail);
      });

      expect(result.current.email).toBe(testEmail);
      expect(result.current.emailValidation.state).toBe('PENDING');
    });

    it('비밀번호 입력 시 상태가 업데이트된다', () => {
      const { result } = renderHook(() => useLoginForm());
      const testPassword = 'Password123!';

      act(() => {
        result.current.setPassword(testPassword);
      });

      expect(result.current.password).toBe(testPassword);
      expect(result.current.passwordValidation.state).toBe('PENDING');
    });

    it('onBlurValidateAllInput 호출 시 이미 검증된 필드만 재검증한다', () => {
      const { result } = renderHook(() => useLoginForm());

      // 먼저 이메일을 검증 상태로 만들기
      act(() => {
        result.current.setEmail('test@example.com');
        result.current.validateEmail();
      });

      act(() => {
        result.current.onBlurValidateAllInput();
      });

      // BEFORE 상태인 password는 검증하지 않고, 이미 검증된 email만 재검증
      expect(result.current.emailValidation.state).toBe('VALID');
      expect(result.current.passwordValidation.state).toBe('BEFORE');
    });
  });
});
