import React, { useState } from "react";

const InstallmentApplicationForm = ({ accountIBAN }) => {
  const [loanAmount, setLoanAmount] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [customTerm, setCustomTerm] = useState(""); 
  const [isCustomTerm, setIsCustomTerm] = useState(false);

  const handleTermChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustomTerm(true);
      setTermMonths(""); 
    } else {
      setIsCustomTerm(false);
      setTermMonths(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedTerm = isCustomTerm ? Number(customTerm) : Number(termMonths);

    if (!selectedTerm || selectedTerm <= 0) {
      alert("Укажите корректный срок рассрочки.");
      return;
    }

    const payload = {
      amount: Number(loanAmount),
      accountIBAN,
      interestRate: 0,
      termMonths: selectedTerm,
    };

    try {
      const response = await fetch("http://localhost:3000/loan/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Ошибка отправки заявки на рассрочку");
      }
      alert("Заявка на рассрочку успешно отправлена!");
      setLoanAmount("");
      setTermMonths("");
      setCustomTerm("");
      setIsCustomTerm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mt-4">
      <h3>Заявка на рассрочку</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Сумма рассрочки</label>
          <input
            type="number"
            className="form-control"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Срок рассрочки (в месяцах)</label>
          <select className="form-select" onChange={handleTermChange} required>
            <option value="">Выберите срок</option>
            <option value="3">3 месяца</option>
            <option value="6">6 месяцев</option>
            <option value="12">12 месяцев</option>
            <option value="24">24 месяца</option>
            <option value="custom">Более 24 месяцев (указать вручную)</option>
          </select>
        </div>

        {isCustomTerm && (
          <div className="mb-3">
            <label className="form-label">Введите срок рассрочки</label>
            <input
              type="number"
              className="form-control"
              value={customTerm}
              onChange={(e) => setCustomTerm(e.target.value)}
              required={isCustomTerm}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Отправить заявку на рассрочку
        </button>
      </form>
    </div>
  );
};

export default InstallmentApplicationForm;
