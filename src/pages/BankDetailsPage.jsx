import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BankDetailsPage = () => {
  const { id } = useParams(); // Получаем id банка из URL
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [accountMessage, setAccountMessage] = useState("");

  const [enterpriseForm, setEnterpriseForm] = useState({
    name: "",
    type: "",
    unp: "",
    bic: "",
    address: "",
    isBank: false,
  });
  const [enterpriseMessage, setEnterpriseMessage] = useState("");

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/banks/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных банка");
        }
        const result = await response.json();
        setBank(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, [id]);

  useEffect(() => {
    if (bank) {
      setEnterpriseForm((prev) => ({
        ...prev,
        bic: bank.bic,
      }));
    }
  }, [bank]);

  const handleCreateAccount = async () => {
    try {
      const response = await fetch(`http://localhost:3000/account/${id}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Ошибка создания счета");
      }
      setAccountMessage("Счет успешно создан!");
    } catch (err) {
      setAccountMessage(err.message);
    }
  };

  const handleEnterpriseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnterpriseForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEnterpriseSubmit = async (e) => {
    e.preventDefault();
    var role = localStorage.getItem('role');
    var url = "http://localhost:3000/enterprise/create";
    if (role === "ADMIN")
      url = "http://localhost:3000/enterprise/admin/create";
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enterpriseForm),
      });
      if (!response.ok) {
        throw new Error("Ошибка создания предприятия, повторите попытку позже");
      }
      setEnterpriseMessage("Предприятие успешно создано!");

      setEnterpriseForm({
        name: "",
        type: "",
        unp: "",
        bic: bank ? bank.bic : "",
        address: "",
        isBank: false,
      });
    } catch (err) {
      setEnterpriseMessage(err.message);
    }
  };

  if (loading) {
    return <div className="container mt-4 alert alert-info">Загрузка...</div>;
  }
  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Детали банка</h2>
      {bank ? (
        <div className="card shadow-sm p-4 mb-4">
          <h4>{bank.name}</h4>
          <p>
            <strong>ID:</strong> {bank.id}
          </p>
          <p>
            <strong>BIC:</strong> {bank.bic}
          </p>
          <p>
            <strong>Адрес:</strong> {bank.address}
          </p>
        </div>
      ) : (
        <div className="alert alert-warning">Банк не найден</div>
      )}

      {/* Раздел создания счета */}
      <div className="mb-4">
        <h3>Создать счет</h3>
        <button className="btn btn-primary" onClick={handleCreateAccount}>
          Создать счет в этом банке
        </button>
        {accountMessage && (
          <div className="mt-2 alert alert-info">{accountMessage}</div>
        )}
      </div>

      {/* Раздел создания предприятия */}
      <div className="mb-4">
        <h3>Создать предприятие</h3>
        <form onSubmit={handleEnterpriseSubmit}>
          <div className="mb-3">
            <label className="form-label">Название</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={enterpriseForm.name}
              onChange={handleEnterpriseChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Тип</label>
            <input
              type="text"
              className="form-control"
              name="type"
              value={enterpriseForm.type}
              onChange={handleEnterpriseChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">УНП</label>
            <input
              type="text"
              className="form-control"
              name="unp"
              value={enterpriseForm.unp}
              onChange={handleEnterpriseChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">BIC</label>
            <input
              type="text"
              className="form-control bg-light"
              name="bic"
              value={enterpriseForm.bic}
              onChange={handleEnterpriseChange}
              required
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Адрес</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={enterpriseForm.address}
              onChange={handleEnterpriseChange}
              required
            />
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              name="isBank"
              checked={enterpriseForm.isBank}
              onChange={handleEnterpriseChange}
            />
            <label className="form-check-label">Это банк?</label>
          </div>
          <button type="submit" className="btn btn-success">
            Создать предприятие
          </button>
          {enterpriseMessage && (
            <div className="mt-2 alert alert-info">{enterpriseMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BankDetailsPage;
