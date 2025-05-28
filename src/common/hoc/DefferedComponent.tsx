import React, { PropsWithChildren, useEffect, useState } from "react";

const DEFERRED_TIME = 200;

export const DeferredComponent: React.FC<
  PropsWithChildren<{
    delay?: number;
  }>
> = ({ children, delay = DEFERRED_TIME }) => {
  const [isDeferred, setIsDeferred] = useState(false);

  useEffect(() => {
    // 200ms 지난 후 children Render
    const timeoutId = setTimeout(() => {
      setIsDeferred(true);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [delay]);

  if (!isDeferred) {
    return null;
  }

  return <>{children}</>;
};
