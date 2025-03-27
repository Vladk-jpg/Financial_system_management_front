import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EnterprisesPage = () => {
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const response = await fetch("http://localhost:3000/enterprise/user", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }

        const result = await response.json();
        setEnterprises(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Мои предприятия</h2>

      {loading && <div className="alert alert-info">Загрузка...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {enterprises.map((enterprise) => (
          <div className="col-md-4" key={enterprise.id}>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">{enterprise.name}</h5>
                <p className="card-text"><strong>ID:</strong> {enterprise.id}</p>
                <p className="card-text"><strong>Тип:</strong> {enterprise.type}</p>
                <p className="card-text"><strong>УНП:</strong> {enterprise.unp}</p>
                <p className="card-text"><strong>BIC:</strong> {enterprise.bic}</p>
                <p className="card-text"><strong>Адрес:</strong> {enterprise.address}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/enterprise/${enterprise.id}`)}
                >
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnterprisesPage;
