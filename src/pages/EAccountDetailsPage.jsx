import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InstallmentApplicationForm from "../components/InstallmentApplicationForm";

const EAccountDetailsPage = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [bankName, setBankName] = useState("Загрузка...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [loanAmount, setLoanAmount] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("3");
  const [customTerm, setCustomTerm] = useState("");
  const [interestRate, setInterestRate] = useState(5);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch(`http://localhost:3000/eaccount/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Ошибка загрузки счета");
        }
        const result = await response.json();
        setAccount(result.data);
        fetchBank(result.data.bank);
        fetchTransactions(result.data.IBAN);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async (iban) => {
      try {
        const response = await fetch(
          `http://localhost:3000/transactions/account?IBAN=${iban}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Ошибка загрузки транзакций");
        }
        const result = await response.json();
        setTransactions(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchBank = async (bankId) => {
      try {
        const response = await fetch(`http://localhost:3000/banks/${bankId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Ошибка загрузки банка");
        }
        const result = await response.json();
        setBankName(result.data.name);
      } catch (err) {
        setBankName("Ошибка загрузки банка");
      }
    };

    fetchAccount();
  }, [id]);

  const termMapping = {
    3: 5,
    6: 7,
    12: 10,
    24: 12.5,
  };

  const handleTermChange = (e) => {
    const value = e.target.value;
    setSelectedTerm(value);
    if (value === "custom") {
      setInterestRate(15);
    } else {
      setInterestRate(termMapping[value]);
    }
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    const termMonths =
      selectedTerm === "custom" ? Number(customTerm) : Number(selectedTerm);
    const payload = {
      amount: Number(loanAmount),
      accountIBAN: account ? account.IBAN : "",
      interestRate,
      termMonths,
    };

    try {
      const response = await fetch("http://localhost:3000/loan/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Ошибка отправки заявки на кредит");
      }
      alert("Заявка на кредит успешно отправлена!");
      setLoanAmount("");
      setSelectedTerm("3");
      setCustomTerm("");
      setInterestRate(termMapping["3"]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBlockAccount = async () => {
    const isConfirmed = window.confirm(
      `Вы уверены, что хотите заблокировать счет?`
    );

    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/eaccount/block/${id}`,
          {
            method: "PATCH",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Ошибка блокировки счета");

        alert("Счет успешно заблокирован");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="container mt-4">
      {loading && <div className="alert alert-info">Загрузка...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {account && (
        <>
          <h2>Детали счета</h2>
          <p>
            <strong>IBAN:</strong> {account.IBAN}
          </p>
          <p>
            <strong>Баланс:</strong> {account.balance} credits
          </p>
          <p>
            <strong>Статус:</strong> {account.state}
          </p>
          <p>
            <strong>Банк:</strong> {bankName}
          </p>

          {/* Кнопка для блокировки счета */}
          <button className="btn btn-danger mt-3" onClick={handleBlockAccount}>
            Заблокировать счет
          </button>

          <hr />

          <h3 className="mt-4">Заявка на кредит</h3>
          <form onSubmit={handleLoanSubmit} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Сумма кредита</label>
              <input
                type="number"
                className="form-control"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Срок кредита (в месяцах)</label>
              <select
                className="form-select"
                value={selectedTerm}
                onChange={handleTermChange}
                required
              >
                <option value="3">3 месяца</option>
                <option value="6">6 месяцев</option>
                <option value="12">12 месяцев</option>
                <option value="24">24 месяца</option>
                <option value="custom">Другой (указать самому)</option>
              </select>
            </div>

            {selectedTerm === "custom" && (
              <div className="mb-3">
                <label className="form-label">
                  Укажите срок кредита (в месяцах)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={customTerm}
                  onChange={(e) => setCustomTerm(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Процентная ставка (%)</label>
              <input
                type="number"
                className="form-control"
                value={interestRate}
                readOnly
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Отправить заявку
            </button>
          </form>

          <hr />

          <InstallmentApplicationForm accountIBAN={account.IBAN} />

          <h3 className="mt-4">Движение средств</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions
                  .slice()
                  .reverse()
                  .map((tx, index) => (
                    <tr key={index}>
                      <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      <td>
                        {tx.senderId === account.id ? <>-</> : <>+</>}
                        {tx.amount} credits
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Нет данных
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EAccountDetailsPage;
