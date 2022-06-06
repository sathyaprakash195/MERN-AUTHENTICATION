import React, { useEffect } from "react";
import axios from "axios";
function Home() {
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/user/get-userinfo-by-id", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    if(localStorage.getItem("token")) {
      getUserData();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <div className="flex items-center justify-center bg-blue-900 text-white h-screen">
      <div className="flex flex-col space-y-2">
        <h1>{error}</h1>
        <h1>{data?.name}</h1>
        <h2>{data?.email}</h2>
        <h1 className="underline cursor-pointer" onClick={logout}>Logout</h1>
      </div>
    </div>
  );
}

export default Home;
