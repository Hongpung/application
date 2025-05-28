import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useEntryAnimation = () => {
  const entryOpacity = useRef(new Animated.Value(0)).current;
  const entryTranslateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entryOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(entryTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [entryOpacity, entryTranslateY]);

  const animatedStyle = {
    opacity: entryOpacity,
    transform: [{ translateY: entryTranslateY }],
  };

  return { animatedStyle };
};
