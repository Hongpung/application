import React from "react";

import { RecoilRoot } from "recoil";
import { AppContainer } from "./AppContainer";

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <AppContainer />
    </RecoilRoot>
  );
};



export default App;
