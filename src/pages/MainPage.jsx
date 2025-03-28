import React from "react";

const MainPage = () => {
  return (
    <div className="container text-center mt-5">
      <header className="mb-4">
        <h1 className="display-4 fw-bold">Межбанковская коммуникационная система</h1>
        <p className="lead text-muted">
          Надежные и безопасные решения для финансовых организаций.
        </p>
      </header>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <a href="/login" className="btn btn-primary btn-lg">
          Войти
        </a>
        <a href="/register" className="btn btn-outline-primary btn-lg">
          Регистрация
        </a>
      </div>

      <div className="card shadow-lg p-4 mb-5 bg-white rounded">
        <h2 className="text-center mb-3">Наши ключевые сервисы</h2>
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Название</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Платежные операции</td>
              <td>Обеспечение быстрых и безопасных транзакций.</td>
            </tr>
            <tr>
              <td>Кредитование</td>
              <td>Гибкие условия кредитования для бизнеса и частных клиентов.</td>
            </tr>
            <tr>
              <td>Отчеты и аналитика</td>
              <td>Подробные финансовые отчеты и аналитические инструменты.</td>
            </tr>
            <tr>
              <td>Верификация</td>
              <td>Система защиты и идентификации клиентов.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className="mt-5 text-muted">
        <p>&copy; 2025 Межбанковская система. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default MainPage;
