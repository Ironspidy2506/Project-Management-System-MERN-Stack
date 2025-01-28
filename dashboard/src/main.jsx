import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AdminContextProvider from "./context/AdminContext.jsx";
import UserContextProvider from "./context/UserContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import ManagerContextProvider from "./context/ManagerContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <ManagerContextProvider>
        <UserContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </UserContextProvider>
      </ManagerContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
