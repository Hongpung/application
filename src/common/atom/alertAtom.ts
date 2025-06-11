import { atom } from "jotai";
import { store } from "../lib/jotaiStroe";

type AlertProps =
  | {
      title: string;
      message: string;
      cancelable?: boolean;
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmText: string;
      cancelText: string;
      isVisible: boolean;
      type: "confirm";
      confirmButtonColor: "red" | "blue" | "green";
      cancelButtonColor: "red" | "blue" | "green";
    }
  | {
      title: string;
      message: string;
      cancelable?: boolean;
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmText: string;
      isVisible: boolean;
      type: "alert";
      confirmButtonColor: "red" | "blue" | "green";
    };

export const alertAtom = atom<AlertProps>({
  title: "확인",
  message: "내용을 확인해주세요.",
  isVisible: false,
  type: "alert",
  confirmText: "확인",
  confirmButtonColor: "blue",
  cancelable: true,
});

export const Alert = {
  alert: (
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      onConfirm?: () => void;
      confirmButtonColor?: "red" | "blue" | "green";
      cancelable?: boolean;
    },
  ) => {
    // 렌더링 중 상태 변경 방지를 위해 setTimeout 사용
    setTimeout(() => {
      store.set(alertAtom, {
        title,
        message,
        type: "alert",
        isVisible: true,
        confirmText: options?.confirmText ?? "확인",
        onConfirm: options?.onConfirm,
        confirmButtonColor: options?.confirmButtonColor ?? "blue",
        cancelable: options?.cancelable ?? true,
      });
    }, 0);
  },

  confirm: (
    title: string,
    message: string,
    options?: {
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
      confirmButtonColor?: "red" | "blue" | "green";
      cancelButtonColor?: "red" | "blue" | "green";
      cancelable?: boolean;
    },
  ) => {
    // 렌더링 중 상태 변경 방지를 위해 setTimeout 사용
    setTimeout(() => {
      store.set(alertAtom, {
        title,
        message,
        type: "confirm",
        isVisible: true,
        confirmText: options?.confirmText ?? "확인",
        cancelText: options?.cancelText ?? "취소",
        onConfirm: options?.onConfirm,
        onCancel: options?.onCancel,
        confirmButtonColor: options?.confirmButtonColor ?? "blue",
        cancelButtonColor: options?.cancelButtonColor ?? "blue",
        cancelable: options?.cancelable ?? true,
      });
    }, 0);
  },
};
