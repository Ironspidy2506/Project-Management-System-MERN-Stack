import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext.jsx";
import { ManagerContext } from "../context/ManagerContext.jsx";
import KorusImg from "../assets/Korus.png";

const Login = () => {
  const [state, setState] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken } = useContext(AdminContext);
  const { setMToken } = useContext(ManagerContext);
  const { setToken } = useContext(UserContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(
          `http://localhost:5000/api/admin/login`,
          {
            email,
            password,
          }
        );

        if (data.success) {
          localStorage.setItem("atoken", data.atoken);
          setAToken(data.atoken);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `http://localhost:5000/api/user/login`,
          {
            email,
            password,
          }
        );

        if (data.success) {
          if (data.mtoken) {
            localStorage.setItem("mtoken", data.mtoken);
            setMToken(data.mtoken);
          } else if (data.token) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
          } else {
            console.error("No valid token received.");
          }
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center"
        onSubmit={onSubmitHandler}
      >
        {/* Logo and Company Name */}
        <img
          src={KorusImg}
          alt="Korus Engineering Solutions"
          className="mb-4 w-14 h-14"
        />
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Korus Engineering Solutions Pvt. Ltd.
        </h2>

        {/* Login Form */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {state} Login
        </h2>
        <div className="mb-4 w-full">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
          />
        </div>
        <div className="mb-6 w-full">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <div className="mt-6 text-center text-gray-600">
          {state === "Admin" ? (
            <p>
              User Login?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setState("User")}
              >
                Click Here
              </span>
            </p>
          ) : (
            <p>
              Admin Login?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setState("Admin")}
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
