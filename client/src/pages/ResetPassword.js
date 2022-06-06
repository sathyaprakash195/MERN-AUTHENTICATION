import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

function ResetPassword() {
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const params = useParams();
  const { token } = params;

  const restPassword = async () => {
    try {
      toast.loading("Resetting password...");
      const response = await axios.post(`/api/auth/reset-password`, {
        password,
        token,
      });
      toast.remove();
      if (response.data.success) {
        setPasswordResetSuccess(true);
        toast.success("Password reset successfully!");
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const verifyForgotPasswordToken = async () => {
    try {
      const response = await axios.post(
        `/api/auth/verify-forgot-password-token`,
        { token }
      );
      if (!response.data.success) {
        setIsTokenValid(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyForgotPasswordToken();
  }, []);

  return (
    <div className="flex h-screen justify-center items-center">
      {isTokenValid ? (
        <>
          {!passwordResetSuccess ? (
            <div className="flex flex-col space-y-5 w-96 shadow-md bg-white p-5 border">
              <h1 className="text-gray-600 text-2xl font-bold">
                RESET PASSWORD
              </h1>
              <hr />

              <input
                type="password"
                className="border border-gray-500 focus:outline-none py-1 px-3"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                className="border border-gray-500 focus:outline-none py-1 px-3"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <button
                  className="bg-green-800 px-5 py-1 text-white text-xl"
                  onClick={restPassword}
                >
                  RESET
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-5">
              <h1 className="text-md text-green-500">
                Your password has been changed successfully
              </h1>
              <Link to="/login" className="underline">Click Here To Login</Link>
            </div>
          )}
        </>
      ) : (
        <h1>Password Reset Link Is Invalid or Expired</h1>
      )}
    </div>
  );
}

export default ResetPassword;
