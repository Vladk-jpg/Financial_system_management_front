import React, { useEffect, useState } from "react";

const BanksPage = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch("http://localhost:3000/banks", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }

        const result = await response.json();
        setBanks(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Банки</h2>

      {loading && <div className="alert alert-info">Загрузка...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {banks.map((bank) => (
          <div className="col-md-4" key={bank.id}>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">{bank.name}</h5>
                <p className="card-text"><strong>ID:</strong> {bank.id}</p>
                <p className="card-text"><strong>BIC:</strong> {bank.bic}</p>
                <p className="card-text"><strong>Адрес:</strong> {bank.address}</p>
                <a href={`/banks/${bank.id}`} className="btn btn-primary">
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

export default BanksPage;
