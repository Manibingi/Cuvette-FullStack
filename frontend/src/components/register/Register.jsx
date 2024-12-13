import React, { useState } from "react";
import { register } from "../../services";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
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
    </>
  );
}

export default Register;
