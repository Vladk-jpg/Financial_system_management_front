import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [recipientIBAN, setRecipientIBAN] = useState("");
  const [selectedSenderIBAN, setSelectedSenderIBAN] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recipientType, setRecipientType] = useState("ACCOUNT"); 

  const navigate = useNavigate();

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

  const handleTransfer = async (e) => {
    e.preventDefault();

    const transferData = {
      senderIBAN: selectedSenderIBAN,
      senderType: "ACCOUNT", // Отправитель всегда ACCOUNT
      recipientIBAN: recipientIBAN,
      recipientType: recipientType,
      amount: amount,
    };

    try {
      const response = await fetch("http://localhost:3000/transactions/transfer", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке перевода");
      }

      const result = await response.json();
      alert(result.data.message);
      navigate(0)
    } catch (err) {
      setError(err.message);
    }
  };

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
                <a href={`/accounts/${account.id}`} className="btn btn-primary">
                  Подробнее
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

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
            <option value="" disabled>Выберите счет</option>
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

        <button type="submit" className="btn btn-primary">Отправить</button>
      </form>
    </div>
  );
};

export default AccountsPage;
