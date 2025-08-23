import React, { useState, useEffect, useRef, forwardRef, Ref } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  Pressable,
  KeyboardTypeOptions,
} from "react-native";
import { Color } from "../../constant/color";
import { josa } from "es-hangul";
import { Icons } from "../Icons/Icons";
import { ValidationState } from "../../types/ValidationState";

// 입력 상태 입력전, 입력 중, 입력 완료, 오류
// 오류 판별은 외부에 일임해야함

type InputProps = {
  ref?: Ref<TextInput>;
  label: string;
  // register 스프레드 지
  onChange?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  validation?: ValidationState;
  // 기존 props (선택적)
  placeholder?: string;
  isEditible?: boolean;
  isRequired?: boolean;
  isEncryption?: boolean;
  keyboardType?: KeyboardTypeOptions;
  color?: "red" | "blue" | "green";
  maxLength?: number;
  requireMark?: boolean;
  value?: string;
  setValue?: (text: string) => void;
};

export const BasicInput = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      // register 스프레드 지원
      onChange,
      onBlur,
      onFocus,
      error,
      validation,
      // 기존 props
      isEncryption = false,
      color = "blue",
      isEditible = true,
      isRequired = true,
      requireMark = false,
      value,
      setValue,
      keyboardType = "default",
      placeholder = "",
      maxLength = undefined,
    },
    ref
  ) => {
    // 암호화 상태일때 보이는지 안보이는지 판별
    const [isVisible, setIsVisible] = useState(!isEncryption);

    const labelAnimation = useRef(new Animated.Value(0)).current; // 애니메이션 초기 값

    //언더라인 색상 - 기본은 파란색
    const underlineColor = Color[color + "500"];

    // register 스프레드와 기존 방식 호환
    const currentValue = value || "";
    const currentError =
      error ||
      (validation?.state === "ERROR" ? validation.errorText : "") ||
      "";
    const hasError = !!error || validation?.state === "ERROR";

    const labelStyle = {
      fontSize: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [12, 10],
      }),
      top: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [5, 3],
      }),
    };
    //유저가 값을 기입하면 레이블 축소 됨
    useEffect(() => {
      Animated.timing(labelAnimation, {
        toValue: currentValue.length > 0 ? 1 : 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }, [currentValue, labelAnimation]);

    return (
      <View style={[styles.inputGroup]}>
        <Animated.Text style={[styles.labelText, labelStyle]}>
          {label}
          {requireMark && <Text style={{ color: "red" }}>*</Text>}
        </Animated.Text>
        <TextInput
          key={label}
          ref={ref}
          style={[
            styles.InputBox,
            {
              borderBottomColor: hasError ? Color["red500"] : underlineColor,
            },
          ]}
          placeholder={
            placeholder ||
            `${josa(label, "을/를")} 입력하세요` +
              `${!isRequired ? " (없으면 빈칸)" : ``}`
          }
          placeholderTextColor={Color["grey400"]}
          value={currentValue}
          onChangeText={(text) => {
            // register 스프레드와 기존 방식 모두 지원
            onChange?.(text);
            setValue?.(text);
          }}
          secureTextEntry={isEncryption ? !isVisible : false}
          editable={isEditible}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={() => {
            onFocus?.();
          }}
          onBlur={() => {
            onBlur?.();
          }}
          returnKeyType="done"
          multiline={false}
        />
        {isEncryption && (
          <Pressable
            style={[styles.VisibleBtn]}
            onPress={() => {
              setIsVisible(!isVisible);
            }}
          >
            <Icons name={isVisible ? "eye-outline" : "eye-off-outline"}></Icons>
          </Pressable>
        )}
        {hasError && currentError && (
          <Text style={styles.errorText}>{currentError}</Text>
        )}
      </View>
    );
  }
);

BasicInput.displayName = "BasicInput";

const styles = StyleSheet.create({
  inputGroup: {
    width: "100%",
    height: "auto",
  },
  InputBox: {
    color: Color["grey800"],
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  labelText: {
    color: Color["grey800"],
    fontSize: 10,
    fontFamily: "NanumSquareNeo-Bold",
    height: 20,
  },
  errorText: {

    top: 8,
    color: Color["red500"],
    fontFamily: "NanumSquareNeo-Bold",
    paddingHorizontal: 4,
    fontSize: 12,
  },
  VisibleBtn: {
    position: "absolute",
    right: 4,
    top: 16,
    width: 32,
    height: 32,
  },
});
