import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = ({ isAuth, setIsAuth, role }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Ошибка при выходе");
      }

      setIsAuth(false);
      localStorage.setItem("role", "");
      navigate("/login");
      navigate(0);
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          🏦 Главная
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse d-flex justify-content-between"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">
                Профиль
              </NavLink>
            </li>
            {role !== "OPERATOR" && role !== "MANAGER" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/banks">
                    Банки
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/accounts">
                    Счета
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/loans">
                    Кредиты и рассрочки
                  </NavLink>
                </li>
              </>
            )}
            {(role === "ADMIN" || role === "ENTERPRISE_SPECIALIST") && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/enterprises">
                  Предприятия
                </NavLink>
              </li>
            )}
            {(role === "OPERATOR" || role === "MANAGER") && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/operator-panel">
                  Панель оператора
                </NavLink>
              </li>
            )}
            {(role === "MANAGER") && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/manager-panel">
                  Панель менеджера
                </NavLink>
              </li>
            )}
            {role === "ADMIN" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin-panel">
                  Админ панель
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex">
            {isAuth ? (
              <button className="btn btn-danger" onClick={handleLogout}>
                Выйти
              </button>
            ) : (
              <NavLink className="btn btn-primary" to="/login">
                Войти
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
