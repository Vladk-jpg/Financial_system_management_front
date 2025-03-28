import React, { useEffect, useState } from "react";

const OperatorPanel = () => {
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchTransactions();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3000/salary-projects/inactive", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка загрузки проектов");

      const result = await response.json();
      setProjects(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3000/transactions/latest", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка загрузки транзакций");

      const result = await response.json();
      setTransactions(result.data.filter(tx => tx.senderType === "ACCOUNT").reverse());
    } catch (err) {
      alert(err.message);
    }
  };

  const activateProject = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/salary-projects/salary/activate/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка активации проекта");

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteProject = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/salary-projects/salary/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка удаления проекта");

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelTransaction = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/transactions/cancel/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка отмены транзакции");

      fetchTransactions();
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/enterprise/by-salary-project/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка загрузки данных предприятия");

      const result = await response.json();
      setDetails(result.data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Заявки на зарплатный проект</h2>

      {loading && <div className="alert alert-info">Загрузка...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Таблица с проектами */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => activateProject(project.id)}>
                    Подтвердить
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => deleteProject(project.id)}>
                    Удалить
                  </button>
                  <button className="btn btn-info btn-sm" onClick={() => fetchDetails(project.id)}>
                    Подробнее
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">Нет активных заявок</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Таблица с транзакциями */}
      <h2 className="mt-5">Последние транзакции пользователей</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Отправитель</th>
            <th>Получатель</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.state}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
                <td>{tx.senderType} #{tx.senderId}</td>
                <td>{tx.recipientType} #{tx.recipientId}</td>
                <td>{tx.amount} credits</td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => cancelTransaction(tx.id)}>
                    Отменить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">Нет транзакций</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Детали проекта */}
      {details && (
        <div className="card mt-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between">
            <h5 className="mb-0">Детали проекта</h5>
            <button className="btn btn-light btn-sm" onClick={() => setDetails(null)}>Закрыть</button>
          </div>
          <div className="card-body">
            <table className="table">
              <tbody>
                <tr><th>ID</th><td>{details.id}</td></tr>
                <tr><th>Название</th><td>{details.name}</td></tr>
                <tr><th>Тип</th><td>{details.type}</td></tr>
                <tr><th>УНП</th><td>{details.unp}</td></tr>
                <tr><th>BIC</th><td>{details.bic}</td></tr>
                <tr><th>Адрес</th><td>{details.address}</td></tr>
                <tr><th>Зарплатный проект</th><td>{details.salaryProject.name} (ID: {details.salaryProject.id})</td></tr>
                <tr><th>Статус проекта</th><td>{details.salaryProject.isActive ? "Активен" : "Неактивен"}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorPanel;
