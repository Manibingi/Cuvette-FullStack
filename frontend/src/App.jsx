import { useState } from "react";
import "./App.css";
import { login, register } from "./services";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.status === 200) {
      alert("registered successfully");
    } else {
      console.log(res);
      alert("error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(loginFormData);
    if (res.status === 200) {
      alert("logged in successfully");
    } else {
      console.log(res);
      alert("error");
    }
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          value={formData.name}
          name="name"
          placeholder="Enter name"
        />
        <input
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          value={formData.mobile}
          name="mobile"
          placeholder="Enter mobile"
        />
        <input
          type="email"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          value={formData.email}
          name="email"
          placeholder="Enter email"
        />
        <input
          type="password"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          value={formData.password}
          name="password"
          placeholder="Enter password"
        />
        <button type="submit">Submit</button>
      </form>

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
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
