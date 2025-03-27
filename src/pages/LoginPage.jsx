import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsAuth }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (response.ok) {
        setMessage("Авторизация успешна!");
        
        setIsAuth(true);
        navigate("/profile");
      } else {
        const data = await response.json();
        setMessage(data.message || "Ошибка авторизации!");
      }
    } catch (error) {
      setMessage("Ошибка соединения с сервером!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Авторизация</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Пароль
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Войти
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
