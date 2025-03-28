import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LoanRepayPage = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [minPayment, setMinPayment] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await fetch(`http://localhost:3000/loan/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки кредита");
        }

        const result = await response.json();
        const loanData = result.data;
        setLoan(loanData);

        const computedPayment = Math.ceil((loanData.amount * (loanData.interestRate / 100 + 1)) / loanData.termMonths);
        const minimum = Math.min(computedPayment, loanData.remainingBalance);
        setMinPayment(Math.ceil(minimum)); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = Math.ceil(Number(repayAmount)); 

    try {
      const response = await fetch(`http://localhost:3000/loan/repay/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("Ошибка погашения кредита");
      }

      const result = await response.json();
      alert(result.data.message);
      navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      {loading && <div className="alert alert-info">Загрузка...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loan && (
        <>
          <h2>Погашение кредита</h2>
          <p><strong>IBAN счета:</strong> {loan.accountIBAN}</p>
          <p><strong>Сумма кредита:</strong> {loan.amount} credits</p>
          <p><strong>Остаток:</strong> {loan.remainingBalance} credits</p>
          <p><strong>Минимальная плата:</strong> {minPayment} credits</p>

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Сумма для погашения</label>
              <input
                type="number"
                className="form-control"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                required
                min={minPayment} // Минимальная сумма платежа
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Погасить кредит
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default LoanRepayPage;
