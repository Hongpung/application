import { useCameraPermissions } from "expo-camera";
import { useCallback } from "react";

export const useCameraPermission = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const isLoading = permission === null;

  const handleRequestPermission = useCallback(async () => {
    const result = await requestPermission();
    return result.granted;
  }, [requestPermission]);

  return {
    hasPermission: permission?.granted ?? false,
    isLoading,
    requestPermission: handleRequestPermission,
  };
}; 