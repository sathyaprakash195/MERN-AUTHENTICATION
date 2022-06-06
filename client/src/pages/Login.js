import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordLinkSent, setForgotPasswordLinkSent] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      toast.loading("Logging in...");
      const response = await axios.post("/api/auth/login", { email, password });
      toast.remove();
      if (response.data.success) {
        toast.success("Logged in successfully!");
        localStorage.setItem("token", response.data.data);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const forgotPasswordHandler = async () => {
    try {
      toast.loading("Sending reset link...");
      const response = await axios.post("/api/auth/send-reset-password-link", {
        email,
      });
      toast.remove();
      if (response.data.success) {
        toast.success("Reset link sent successfully!");
        setForgotPasswordLinkSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.remove();
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen justify-center items-center p-5">
      <div className="flex justify-center">
        <img src="images/login.png" alt="" className="h-[500px]" />
      </div>
      <div className="pr-32">
        {!showForgotPassword ? (
          <div className="flex flex-col space-y-5 w-96 p-5">
            <div>
              <h1 className=" text-3xl font-bold text-gray-600">
                HEY , WELCOME BACK
              </h1>
              <p className="mt-2 text-gray-500">
                Login to continue <b>or</b>{" "}
                <Link to="/register" className="underline">
                  Click Here To Register
                </Link>
              </p>
            </div>
            <hr />
            <input
              type="text"
              className="border-gray-400 border-2 focus:outline-none py-1 px-3 border-r-0 border-t-0 text-gray-500"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="border-gray-400 border-2 focus:outline-none py-1 px-3 border-r-0 border-t-0 text-gray-500"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex space-x-5 items-end justify-between">
              <button
                className="bg-green-800 px-5 py-1 text-white text-xl max-w-max"
                onClick={loginHandler}
              >
                LOGIN
              </button>
              <h1
                to="/register"
                className="underline cursor-pointer"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex flex-col shadow-md border p-5 bg-white space-y-5">
            <h1 className="text-gray-600 text-2xl font-semibold">
              FORGOT PASSWORD
            </h1>
            <hr />
            {forgotPasswordLinkSent ? (
              <h1 className="text-green-600 text-md">
                Password reset link sent successfully to your email address
              </h1>
            ) : (
              <div className="flex flex-col space-y-5">
                <p>
                  A password reset link will be sent to the below email address
                </p>

                <input
                  type="text"
                  className="border border-gray-500 focus:outline-none py-1 px-3 text-gray-500"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  className="bg-green-800 px-5 py-1 text-white text-md max-w-max"
                  onClick={forgotPasswordHandler}
                >
                  Send Password Reset Link
                </button>
              </div>
            )}

            <h1
              className="underline cursor-pointer"
              onClick={() => setShowForgotPassword(false)}
            >
              Login
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
