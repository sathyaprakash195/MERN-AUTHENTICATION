import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function VerifyEmail() {
  const [message, setMessage] = React.useState("");
  const params = useParams();
  const { token } = params;

  const verifyEmail = async () => {
    try {
      const response = await axios.post(`/api/auth/verify-email`, { token });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
      console.log(error);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <div className="flex items-center justify-center text-white bg-blue-800 h-screen">
      <h1>{message}</h1>
    </div>
  );
}

export default VerifyEmail;
