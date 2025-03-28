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
  const [loans, setLoans] = useState({});
  const [banksMapping, setBanksMapping] = useState({});

  const [recipientIBAN, setRecipientIBAN] = useState("");
  const [selectedSenderIBAN, setSelectedSenderIBAN] = useState("");
  const [amount, setAmount] = useState(0);
  const [recipientType, setRecipientType] = useState("ACCOUNT");

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
        result.data.forEach((account) => {
          fetchLoans(account.IBAN);
        });
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchLoans = async (iban) => {
      try {
        const response = await fetch(
          `http://localhost:3000/loan/by-iban?iban=${iban}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Ошибка загрузки кредитов");
        }
        const result = await response.json();
        setLoans((prevLoans) => ({ ...prevLoans, [iban]: result.data }));

        result.data.forEach((loan) => {
          if (!banksMapping[loan.bankId]) {
            fetchBankName(loan.bankId);
          }
        });
      } catch (err) {
        console.error("Ошибка загрузки кредитов:", err);
      }
    };

    const fetchBankName = async (bankId) => {
      try {
        const response = await fetch(`http://localhost:3000/banks/${bankId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Ошибка загрузки банка");
        }
        const result = await response.json();
        setBanksMapping((prev) => ({ ...prev, [bankId]: result.data.name }));
      } catch (err) {
        console.error(`Ошибка загрузки банка для bankId ${bankId}:`, err);
        setBanksMapping((prev) => ({ ...prev, [bankId]: "Ошибка загрузки" }));
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
  }, [id, banksMapping]);

  const handleTransfer = async (e) => {
    e.preventDefault();

    const transferData = {
      senderIBAN: selectedSenderIBAN,
      senderType: "ENTERPRISE", // Отправитель всегда ENTERPRISE
      recipientIBAN: recipientIBAN,
      recipientType: recipientType,
      amount: amount,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/transactions/transfer",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transferData),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при отправке перевода");
      }

      const result = await response.json();
      alert(result.data.message);
      navigate(0);
    } catch (err) {
      alert(err.message);
      setError(err.message);
    }
  };

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
        throw new Error("Ошибка создания заявки на зарплатный проект");
      }

      alert("Заявка успешно создана!");
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
            <div className="row">
              {accounts.map((account) => (
                <div className="col-md-4" key={account.id}>
                  <div className="card shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="card-title">IBAN: {account.IBAN}</h5>
                      <p className="card-text">
                        <strong>Баланс:</strong> {account.balance} credits
                      </p>
                      <p className="card-text">
                        <strong>Статус:</strong> {account.state}
                      </p>
                      <a
                        href={`/eaccounts/${account.id}`}
                        className="btn btn-primary"
                      >
                        Подробнее
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">У предприятия пока нет счетов</p>
          )}

          {/* Форма перевода */}
          <h3 className="mt-4">Отправить деньги</h3>
          <form onSubmit={handleTransfer}>
            <div className="mb-3">
              <label className="form-label">Выберите счет отправителя</label>
              <select
                className="form-select"
                value={selectedSenderIBAN}
                onChange={(e) => setSelectedSenderIBAN(e.target.value)}
                required
              >
                <option value="" disabled>
                  Выберите счет
                </option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.IBAN}>
                    {account.IBAN}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">IBAN получателя</label>
              <input
                type="text"
                className="form-control"
                value={recipientIBAN}
                onChange={(e) => setRecipientIBAN(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Сумма перевода</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Тип получателя</label>
              <select
                className="form-select"
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                required
              >
                <option value="ACCOUNT">Клиент</option>
                <option value="ENTERPRISE">Предприятие</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Отправить
            </button>
          </form>

          <h2 className="mt-4">Кредиты и рассрочки</h2>
          {accounts.map((account) => (
            <div key={account.id} className="mb-4">
              <h4>Счет: {account.IBAN}</h4>
              {loans[account.IBAN] ? (
                loans[account.IBAN].length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Сумма</th>
                          <th>Банк</th>
                          <th>Статус</th>
                          <th>Тип счета</th>
                          <th>Процентная ставка</th>
                          <th>Срок (мес.)</th>
                          <th>Остаток</th>
                          <th>Дата выдачи</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loans[account.IBAN].map((loan) => (
                          <tr key={loan.id}>
                            <td>{loan.amount} credits</td>
                            <td>
                              {banksMapping[loan.bankId] || "Загрузка..."}
                            </td>
                            <td>{loan.status}</td>
                            <td>{loan.accountType}</td>
                            <td>{loan.interestRate}%</td>
                            <td>{loan.termMonths}</td>
                            <td>{loan.remainingBalance} credits</td>
                            <td>
                              {new Date(loan.issueDate).toLocaleDateString()}
                            </td>
                            <td>
                              {loan.status === "ACTIVE" ? (
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    navigate(`/loans/repay/${loan.id}`)
                                  }
                                >
                                  Погасить
                                </button>
                              ) : (
                                <p>Нет</p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">Нет кредитов или рассрочек</p>
                )
              ) : (
                <p className="text-muted">Загрузка кредитов и рассрочек...</p>
              )}
            </div>
          ))}

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
                  onClick={() => navigate(`/salary-project/${id}`)}
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
