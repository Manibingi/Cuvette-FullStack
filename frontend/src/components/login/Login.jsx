import React, { useEffect, useState } from "react";
import { login } from "../../services";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(loginFormData);
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      localStorage.setItem("token", data.token);
      alert("logged in successfully");
      navigate("/home");
    } else {
      console.log(res);
      alert("error");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          onChange={(e) =>
            setLoginFormData({
              ...loginFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={loginFormData.email}
          name="email"
          placeholder="enter email"
        />
        <br />
        <input
          type="password"
          onChange={(e) =>
            setLoginFormData({
              ...loginFormData,
              [e.target.name]: e.target.value,
            })
          }
          value={loginFormData.password}
          name="password"
          placeholder="enter password"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Login;
