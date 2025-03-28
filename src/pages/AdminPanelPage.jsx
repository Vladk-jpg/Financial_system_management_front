import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  // Состояния
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [errorLogs, setErrorLogs] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankBIC, setBankBIC] = useState("");
  const [bankAddress, setBankAddress] = useState("");

  const [deleteBankId, setDeleteBankId] = useState("");

  const [deleteEnterpriseId, setDeleteEnterpriseId] = useState("");
  const [deleteUserId, setDeleteUserId] = useState("");
  const [deleteAccountUserId, setDeleteAccountUserId] = useState("");
  const [deleteAccountEnterpriseId, setDeleteAccountEnterpriseId] =
    useState("");
  const [deleteLoanId, setDeleteLoanId] = useState("");

  // Получение логов
  useEffect(() => {
    const fetchLogs = async () => {
      setLoadingLogs(true);
      try {
        const response = await fetch("http://localhost:3000/admin/logs", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Ошибка загрузки логов");

        const data = await response.json();
        setLogs(data.data.logs || []);
      } catch (error) {
        setErrorLogs("Ошибка при загрузке логов");
      }
      setLoadingLogs(false);
    };

    fetchLogs();
  }, []);

  // Отправка формы для создания банка
  const handleCreateBank = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/banks", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: bankName,
          bic: bankBIC,
          address: bankAddress,
        }),
      });

      if (!response.ok) throw new Error("Ошибка при создании банка");

      alert("Банк успешно создан!");
      setBankName("");
      setBankBIC("");
      setBankAddress("");
    } catch (error) {
      alert("Ошибка при создании банка");
    }
  };

  // Отправка запроса на удаление банка
  const handleDeleteBank = async (e) => {
    e.preventDefault();
    if (!window.confirm("Вы уверены, что хотите удалить банк?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/banks/${deleteBankId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Ошибка при удалении банка");

      alert("Банк успешно удален!");
      setDeleteBankId("");
    } catch (error) {
      alert("Ошибка при удалении банка");
    }
  };

  const handleDelete = async (url, id, setId) => {
    if (!window.confirm(`Вы уверены, что хотите удалить запись с id: ${id}?`))
      return;

    try {
      const response = await fetch(`http://localhost:3000/${url}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка при удалении");

      alert("Запись успешно удалена!");
      setId("");
    } catch (error) {
      alert("Ошибка при удалении записи");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>

      {/* Логи */}
      <h3 className="mt-4">Логи приложения</h3>
      {loadingLogs && <p>Загрузка логов...</p>}
      {errorLogs && <p className="text-danger">{errorLogs}</p>}
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        <div>
          {logs.length > 0 ? (
            [...logs].reverse().map((log, index) => (
              <div
                key={index}
                style={{ borderBottom: "1px solid #ccc", padding: "5px 0" }}
              >
                {log}
              </div>
            ))
          ) : (
            <div className="text-center">Логи отсутствуют</div>
          )}
        </div>
      </div>

      <hr />

      {/* Форма создания банка */}
      <h3 className="mt-4">Создание банка</h3>
      <form onSubmit={handleCreateBank}>
        <div className="mb-3">
          <label className="form-label">Название банка</label>
          <input
            type="text"
            className="form-control"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">BIC</label>
          <input
            type="text"
            className="form-control"
            value={bankBIC}
            onChange={(e) => setBankBIC(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Адрес</label>
          <input
            type="text"
            className="form-control"
            value={bankAddress}
            onChange={(e) => setBankAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          Создать банк
        </button>
      </form>

      <hr />

      {/* Форма удаления банка */}
      <h3 className="mt-4">Удаление банка</h3>
      <form onSubmit={handleDeleteBank}>
        <div className="mb-3">
          <label className="form-label">ID банка</label>
          <input
            type="text"
            className="form-control"
            value={deleteBankId}
            onChange={(e) => setDeleteBankId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Удалить банк
        </button>
      </form>

      <hr />

      {/* Форма удаления предприятия */}
      <h3 className="mt-4">Удаление предприятия</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete("enterprise", deleteEnterpriseId, setDeleteEnterpriseId);
        }}
      >
        <div className="mb-3">
          <label className="form-label">ID предприятия</label>
          <input
            type="text"
            className="form-control"
            value={deleteEnterpriseId}
            onChange={(e) => setDeleteEnterpriseId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Удалить предприятие
        </button>
      </form>

      <hr />

      {/* Форма удаления пользователя */}
      <h3 className="mt-4">Удаление пользователя</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete("users", deleteUserId, setDeleteUserId);
        }}
      >
        <div className="mb-3">
          <label className="form-label">ID пользователя</label>
          <input
            type="text"
            className="form-control"
            value={deleteUserId}
            onChange={(e) => setDeleteUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Удалить пользователя
        </button>
      </form>

      <hr />

      {/* Форма удаления счета пользователя */}
      <h3 className="mt-4">Удаление счета пользователя</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete("account", deleteAccountUserId, setDeleteAccountUserId);
        }}
      >
        <div className="mb-3">
          <label className="form-label">ID счета пользователя</label>
          <input
            type="text"
            className="form-control"
            value={deleteAccountUserId}
            onChange={(e) => setDeleteAccountUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Удалить счет пользователя
        </button>
      </form>

      <hr />

      {/* Форма удаления счета предприятия */}
      <h3 className="mt-4">Удаление счета предприятия</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete(
            "eaccount",
            deleteAccountEnterpriseId,
            setDeleteAccountEnterpriseId
          );
        }}
      >
        <div className="mb-3">
          <label className="form-label">ID счета предприятия</label>
          <input
            type="text"
            className="form-control"
            value={deleteAccountEnterpriseId}
            onChange={(e) => setDeleteAccountEnterpriseId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Удалить счет предприятия
        </button>
      </form>

      <hr />

      {/* Форма удаления кредита */}
      <h3 className="mt-4">Удаление кредита</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete("loan", deleteLoanId, setDeleteLoanId);
        }}
      >
        <div className="mb-3">
          <label className="form-label">ID кредита</label>
          <input
            type="text"
            className="form-control"
            value={deleteLoanId}
            onChange={(e) => setDeleteLoanId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Удалить кредит
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
