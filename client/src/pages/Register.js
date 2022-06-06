import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const registerHandler = async () => {
    try {
      
      toast.loading("Registering...");
      const response = await axios.post("/api/auth/register", {
        name,
        password,
        email,
      });
      toast.remove();
      if (response.data.success) {
        toast.success("Registered successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen justify-center items-center p-5">
      <div className="flex justify-end pr-32">
        <div className="flex flex-col space-y-5 w-[500]  p-5">
          <div>
            <h1 className=" text-3xl font-bold text-gray-600">
              HEY , WELCOME TO SHEY
            </h1>
            <p className="mt-2 text-gray-500">Register to continue , Will see u inside</p>
          </div>
          <hr />
          <input
            type="text"
            className=" border-gray-400 border-2 focus:outline-none py-1 px-3 border-r-0 border-t-0 text-gray-500"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <div className="flex justify-between items-end">
            <div className="flex flex-col space-y-5">
              <Link className="underline text-gray-500" to="/login">
                Click Here To Login
              </Link>
            </div>
            <button
              className="bg-green-800 px-5 py-1 text-white text-md"
              onClick={registerHandler}
            >
              REGISTER
            </button>
          </div>
        </div>
      </div>
      <div>
        <img src="images/register.png" alt="" className="h-[500px]" />
      </div>
    </div>
  );
}

export default Register;
