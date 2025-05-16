import { atom } from "jotai";
import { store } from "../lib/jotaiStroe";

type AlertProps =
  | {
      title: string;
      message: string;
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmText: string;
      cancelText: string;
      isVisible: boolean;
      type: "confirm";
    }
  | {
      title: string;
      message: string;
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmText: string;
      isVisible: boolean;
      type: "alert";
    };

export const alertAtom = atom<AlertProps>({
  title: "확인",
  message: "내용을 확인해주세요.",
  isVisible: false,
  type: "alert",
  confirmText: "확인",
});

export const Alert = {
  alert: (
    title: string,
    message: string,
    options?: { confirmText?: string; onConfirm?: () => void }
  ) => {
    store.set(alertAtom, {
      title,
      message,
      type: "alert",
      isVisible: true,
      confirmText: options?.confirmText ?? "확인",
      onConfirm: options?.onConfirm,
    });
  },

  confirm: (
    title: string,
    message: string,
    options?: {
      onConfirm?: () => void;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    }
  ) => {
    store.set(alertAtom, {
      title,
      message,
      type: "confirm",
      isVisible: true,
      confirmText: options?.confirmText ?? "확인",
      cancelText: options?.cancelText ?? "취소",
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel,
    });
  },
};
