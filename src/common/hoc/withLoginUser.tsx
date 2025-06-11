import React from "react";
import { useAtomValue } from "jotai";
import { UserStatusState } from "@hongpung/src/entities/member";

export const withLoginUser = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  const WithLoginUserComponent = (props: P) => {
    const loginUser = useAtomValue(UserStatusState);

    if (!loginUser) {
      return null;
    }

    return <Component {...props} />;
  };

  WithLoginUserComponent.displayName = `(${Component.displayName || Component.name})`;

  return WithLoginUserComponent;
};
