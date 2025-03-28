import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  //const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [enterpriseAccounts, setEnterpriseAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [error, setError] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    IBAN: "",
    salary: "",
    position: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3000/salary-projects/salary/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Ошибка загрузки проекта");
        const result = await response.json();
        setProject(result.data);
        fetchEmployees(result.data.id);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchEmployees = async (projectId) => {
      try {
        const response = await fetch(`http://localhost:3000/salary-projects/employees/${projectId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Ошибка загрузки сотрудников");
        const result = await response.json();
        setEmployees(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProject();
  }, [id]);

  // Получение счетов предприятия
  useEffect(() => {
    const fetchEnterpriseAccounts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/eaccount/enterprise/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Ошибка загрузки счетов предприятия");
        const result = await response.json();
        setEnterpriseAccounts(result.data);
        if (result.data.length > 0) {
          setSelectedAccount(result.data[0].IBAN);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEnterpriseAccounts();
  }, [id]);

  const handleGetEmployees = async () => {
    try {
      const response = await fetch(`http://localhost:3000/salary-projects/employees/${project.id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка загрузки сотрудников");
      const result = await response.json();
      setEmployees(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:3000/salary-projects/employee/${project.id}?id=${employeeId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка удаления сотрудника");
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/salary-projects/employee/${project.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) throw new Error("Ошибка добавления сотрудника");
      await handleGetEmployees();
      setNewEmployee({ IBAN: "", salary: "", position: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  // Новый функционал: отправка зарплаты
  const handleSendSalary = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/transactions/salary/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IBAN: selectedAccount }),
      });
      if (!response.ok) throw new Error("Ошибка отправки зарплаты");
      alert("Зарплата успешно отправлена!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}

      {project && (
        <>
          <h2>{project.name}</h2>
          <p>{project.isActive ? "Активен" : "Неактивен"}</p>

          <h3>Сотрудники</h3>
          {employees.length > 0 ? (
            <ul className="list-group">
              {employees.map((emp) => (
                <li key={emp.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {emp.position} - {emp.salary} credits | <strong>IBAN:</strong> {emp.IBAN}
                  </span>
                  <button className="btn btn-danger" onClick={() => handleDeleteEmployee(emp.id)}>
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Нет сотрудников</p>
          )}

          <h3 className="mt-4">Добавить сотрудника</h3>
          <form onSubmit={handleAddEmployee} className="mt-3">
            <div className="mb-3">
              <label className="form-label">IBAN</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.IBAN}
                onChange={(e) => setNewEmployee({ ...newEmployee, IBAN: e.target.value })} 
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Зарплата</label>
              <input
                type="number"
                className="form-control"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })} 
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Должность</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} 
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Добавить</button>
          </form>

          {/* Новый раздел: Отправить зарплату */}
          <h3 className="mt-4">Отправить зарплату</h3>
          <form onSubmit={handleSendSalary} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Выберите счет для отправки зарплаты</label>
              <select
                className="form-select"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                required
              >
                {enterpriseAccounts.map((account) => (
                  <option key={account.id} value={account.IBAN}>
                    {account.IBAN}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Отправить зарплату</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
