import { createContext, useState } from "react";

export const ManagerContext = createContext();

const ManagerContextProvider = (props) => {
  const [mtoken, setMToken] = useState(
    localStorage.getItem("mtoken") ? localStorage.getItem("mtoken") : ""
  );
  const value = {
    mtoken,
    setMToken,
  };

  return (
    <ManagerContext.Provider value={value}>
      {props.children}
    </ManagerContext.Provider>
  );
};

export default ManagerContextProvider;
