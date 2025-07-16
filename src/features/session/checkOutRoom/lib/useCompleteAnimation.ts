import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export const useCompleteAnimation = (
  isLoading: boolean,
  onComplete: () => void,
) => {
  const entryOpacity = useRef(new Animated.Value(0)).current;
  const entryTranslateY = useRef(new Animated.Value(60)).current;
  const clapOpacity = useRef(new Animated.Value(1)).current;
  const clapTranslateY = useRef(new Animated.Value(0)).current;

  const [clapCount, setClapCount] = useState(0);

  // 마운트 시 진입 애니메이션
  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(entryOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(entryTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, entryOpacity, entryTranslateY]);

  const handleLottieFinish = () => {
    if (clapCount < 1) {
      setClapCount(clapCount + 1); // 한 번 더 재생
    } else {
      // 박수 애니메이션 끝나고 위로 사라지기
      Animated.parallel([
        Animated.timing(clapOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(clapTranslateY, {
          toValue: -80,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete();
      });
    }
  };

  const animatedStyle = {
    opacity: Animated.multiply(entryOpacity, clapOpacity),
    transform: [
      { translateY: entryTranslateY },
      { translateY: clapTranslateY },
    ],
  };

  return {
    clapCount,
    animatedStyle,
    handleLottieFinish,
  };
};
