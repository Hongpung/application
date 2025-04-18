import React, {
  createContext,
  useContext,
  useState,
  Children,
  ComponentType,
  ReactNode,
  isValidElement,
  useMemo,
} from "react";

export interface StepScreenProps<T = unknown> {
  name: string;
  screen: ComponentType<T>;
}

export const StepScreen = <T,>(props: StepScreenProps<T>) => {
  return null; // 실제 렌더링은 StepContainer에서 함
};

interface StepContextType {
  current: string;
  goTo: (name: string) => void;
}

const StepContext = createContext<StepContextType | null>(null);

export const useStep = <T extends Record<string, unknown>>() => {
  const context = useContext(StepContext);
  if (!context) throw new Error("useStep must be used within a StepContainer");
  return {
    current: context.current as keyof T,
    goTo: context.goTo as (name: keyof T) => void,
  };
};

interface StepContainerProps<T extends Record<string, unknown>> {
  children: ReactNode;
  initialStep?: keyof T & string;
}

export const StepContainer = <T extends Record<string, unknown>>({
  children,
  initialStep,
}: StepContainerProps<T>) => {
  const screens = useMemo(() => {
    const map: Record<string, ComponentType> = {};
    Children.toArray(children)
      .filter(isValidElement)
      .forEach((child) => {
        const props = child.props as StepScreenProps;
        map[props.name] = props.screen;
      });
    return map;
  }, [children]);

  const [current, setCurrent] = useState<string>(
    initialStep || Object.keys(screens)[0]
  );

  const CurrentComponent = screens[current];
  const goTo = (name: string) => {
    if (name in screens) setCurrent(name);
  };

  return (
    <StepContext.Provider value={{ current, goTo }}>
      {CurrentComponent && <CurrentComponent />}
    </StepContext.Provider>
  );
};
