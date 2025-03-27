import React, { useEffect, useState } from "react";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:3000/account", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }

        const result = await response.json();
        setAccounts(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Банковские счета</h2>

      {loading && <div className="alert alert-info">Загрузка...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {accounts.map((account) => (
          <div className="col-md-4" key={account.id}>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">IBAN: {account.IBAN}</h5>
                <p className="card-text"><strong>Баланс:</strong> {account.balance} credits</p>
                <p className="card-text"><strong>Статус:</strong> {account.state}</p>
                <a href={`/account/${account.id}`} className="btn btn-primary">
                  Подробнее
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;
