import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoanPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loans, setLoans] = useState({});
  const [banksMapping, setBanksMapping] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:3000/account", {
          method: "GET",
          credentials: "include",
        });
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
      } finally {
        setLoading(false);
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

    fetchAccounts();
  }, [banksMapping]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Мои кредиты и рассрочки</h2>
      {loading && <div className="alert alert-info">Загрузка...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

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
                        <td>{banksMapping[loan.bankId] || "Загрузка..."}</td>
                        <td>{loan.status}</td>
                        <td>{loan.accountType}</td>
                        <td>{loan.interestRate}%</td>
                        <td>{loan.termMonths}</td>
                        <td>{loan.remainingBalance} credits</td>
                        <td>{new Date(loan.issueDate).toLocaleDateString()}</td>
                        <td>
                          {loan.status === "ACTIVE" ? (
                            <button
                              className="btn btn-success"
                              onClick={() => navigate(`/loans/repay/${loan.id}`)}
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
    </div>
  );
};

export default LoanPage;
