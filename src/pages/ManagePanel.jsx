import React, { useEffect, useState } from "react";

const ManagePanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [accountType, setAccountType] = useState("client");

  useEffect(() => {
    fetchTransactions();
    fetchLoans();
    fetchInactiveUsers();
  }, []);

  const fetchInactiveUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/inactive", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка загрузки пользователей");

      const result = await response.json();
      setInactiveUsers(result.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const activateUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/users/activate/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      fetchInactiveUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchInactiveUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/transactions/latest",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Ошибка загрузки транзакций");
      const result = await response.json();
      setTransactions(result.data.reverse());
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await fetch("http://localhost:3000/loan/pending", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка загрузки заявок на кредит");
      const result = await response.json();
      setLoans(result.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelTransaction = async (id) => {
    try {
      await fetch(`http://localhost:3000/transactions/cancel/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      fetchTransactions();
    } catch (err) {
      alert(err.message);
    }
  };

  const activateLoan = async (id) => {
    try {
      await fetch(`http://localhost:3000/loan/activate/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      fetchLoans();
    } catch (err) {
      alert(err.message);
    }
  };

  const cancelLoan = async (id) => {
    try {
      await fetch(`http://localhost:3000/loan/cancel/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      fetchLoans();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAccountIdChange = (e) => {
    setAccountId(e.target.value);
  };

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = "";
    if (accountType === "client") {
      url = `http://localhost:3000/account/freeze/${accountId}`;
    } else if (accountType === "enterprise") {
      url = `http://localhost:3000/eaccount/freeze/${accountId}`;
    }

    try {
      const response = await fetch(url, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка выполнения операции");

      alert("Аккаунт заморожен успешно");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Новые пользователи</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Номер паспорта</th>
            <th>ИНН</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {inactiveUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.passportNumber}</td>
              <td>{user.identificationNumber}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => activateUser(user.id)}
                >
                  Подтвердить
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(user.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-5">Заморозка аккаунта</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="accountId" className="form-label">
            ID аккаунта
          </label>
          <input
            type="number"
            className="form-control"
            id="accountId"
            value={accountId}
            onChange={handleAccountIdChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="accountType" className="form-label">
            Тип аккаунта
          </label>
          <select
            className="form-select"
            id="accountType"
            value={accountType}
            onChange={handleAccountTypeChange}
            required
          >
            <option value="client">Клиентский аккаунт</option>
            <option value="enterprise">Аккаунт предприятия</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Заморозить
        </button>
      </form>

      <h2 className="mt-5">Заявки на кредиты и рассрочки</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Сумма</th>
            <th>Банк</th>
            <th>IBAN</th>
            <th>Тип счета</th>
            <th>Процентная ставка</th>
            <th>Срок (мес)</th>
            <th>Дата заявки</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.amount}</td>
              <td>{loan.bankId}</td>
              <td>{loan.accountIBAN}</td>
              <td>{loan.accountType}</td>
              <td>{loan.interestRate}%</td>
              <td>{loan.termMonths}</td>
              <td>{new Date(loan.issueDate).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => activateLoan(loan.id)}
                >
                  Подтвердить
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => cancelLoan(loan.id)}
                >
                  Отказать
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-5">Последние транзакции</h2>
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
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.state}</td>
              <td>{new Date(tx.createdAt).toLocaleString()}</td>
              <td>
                {tx.senderType} #{tx.senderId}
              </td>
              <td>
                {tx.recipientType} #{tx.recipientId}
              </td>
              <td>{tx.amount} credits</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => cancelTransaction(tx.id)}
                >
                  Отменить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePanel;
