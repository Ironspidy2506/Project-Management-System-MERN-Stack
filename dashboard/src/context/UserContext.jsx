import { createContext, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const value = {
    token,
    setToken,
  };

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
