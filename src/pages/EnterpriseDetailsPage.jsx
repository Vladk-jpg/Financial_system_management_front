import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EnterpriseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [salaryProject, setSalaryProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salaryName, setSalaryName] = useState("");

  useEffect(() => {
    const fetchEnterprise = async () => {
      try {
        const response = await fetch(`http://localhost:3000/enterprise/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки предприятия");
        }

        const result = await response.json();
        setEnterprise(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/eaccount/enterprise/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка загрузки счетов");
        }

        const result = await response.json();
        setAccounts(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchSalaryProject = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/salary-projects/salary/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка загрузки зарплатного проекта");
        }

        const result = await response.json();
        setSalaryProject(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEnterprise();
    fetchAccounts();
    fetchSalaryProject();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить это предприятие?"))
      return;

    try {
      const response = await fetch(`http://localhost:3000/enterprise/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Ошибка удаления предприятия");
      }

      navigate("/enterprises");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateAccount = async () => {
    try {
      const response = await fetch(`http://localhost:3000/eaccount/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Ошибка создания счета");
      }

      const newAccount = await response.json();
      setAccounts([...accounts, newAccount.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateSalaryProject = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/salary-projects/salary/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: salaryName }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка создания зарплатного проекта");
      }

      alert("Зарплатный проект успешно создан!");
      setSalaryName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSalaryProject = async (projectId) => {
    if (
      !window.confirm("Вы уверены, что хотите удалить этот зарплатный проект?")
    )
      return;

    try {
      const response = await fetch(
        `http://localhost:3000/salary-projects/salary/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка удаления зарплатного проекта");
      }

      setSalaryProject(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      {loading && <div className="alert alert-info">Загрузка...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {enterprise && (
        <>
          <h2>{enterprise.name}</h2>
          <p>
            <strong>ID:</strong> {enterprise.id}
          </p>
          <p>
            <strong>Тип:</strong> {enterprise.type}
          </p>
          <p>
            <strong>УНП:</strong> {enterprise.unp}
          </p>
          <p>
            <strong>BIC:</strong> {enterprise.bic}
          </p>
          <p>
            <strong>Адрес:</strong> {enterprise.address}
          </p>

          <button className="btn btn-danger me-2" onClick={handleDelete}>
            Удалить предприятие
          </button>

          <button className="btn btn-success" onClick={handleCreateAccount}>
            Создать счет
          </button>

          <h3 className="mt-4">Счета</h3>
          {accounts.length > 0 ? (
            <ul className="list-group">
              {accounts.map((account) => (
                <li key={account.id} className="list-group-item">
                  <strong>IBAN:</strong> {account.IBAN} |{" "}
                  <strong>Баланс:</strong> {account.balance} credits |{" "}
                  <strong>Cтатус:</strong> {account.state}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">У предприятия пока нет счетов</p>
          )}

          {/*Форма для создания зарплатного проекта */}
          {!salaryProject && (
            <div>
              <h3 className="mt-4">Создать зарплатный проект</h3>
              <form onSubmit={handleCreateSalaryProject} className="mt-3">
                <div className="mb-3">
                  <label className="form-label">Название проекта</label>
                  <input
                    type="text"
                    className="form-control"
                    value={salaryName}
                    onChange={(e) => setSalaryName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Создать проект
                </button>
              </form>
            </div>
          )}

          <h3 className="mt-4">Зарплатный проект</h3>
          {salaryProject ? (
            <div className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                {salaryProject.name}{" "}
                {salaryProject.isActive ? "(Активен)" : "(Неактивен)"}
              </span>
              <div>
                <button
                  className="btn btn-primary me-2"
                  onClick={() =>
                    navigate(`/salary-project/${salaryProject.id}`)
                  }
                >
                  Подробнее
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteSalaryProject(salaryProject.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ) : (
            <p className="text-muted">Нет зарплатного проекта</p>
          )}
        </>
      )}
    </div>
  );
};

export default EnterpriseDetailsPage;
