import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import BanksPage from "./pages/BankPage";
import AccountsPage from "./pages/AccountsPage";
import BankDetailsPage from "./pages/BankDetailsPage";
import EnterpriseDetailsPage from "./pages/EnterpriseDetailsPage";
import EnterprisesPage from "./pages/EnterprisesPage";
import ProjectDetailsPage from "./pages/SalaryProjectDetailsPage";
import AccountDetailsPage from "./pages/AccountDetailsPage";
import LoanPage from "./pages/LoanPage";
import LoanRepayPage from "./pages/LoanRepayPage";
import EAccountDetailsPage from "./pages/EAccountDetailsPage";
import MainPage from "./pages/MainPage";
import Footer from "./components/Footer";
import OperatorPanel from "./pages/OperatorPanel";
import ManagePanel from "./pages/ManagePanel";
import AdminPanel from "./pages/AdminPanelPage";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/check", {
          method: "GET",
          credentials: "include",
        });

        setIsAuth(response.ok);
      } catch (error) {
        setIsAuth(false);
      }
    };
    checkAuth();
    setRole(localStorage.getItem("role"));
  }, []);

  return (
    <Router>
      <Header isAuth={isAuth} setIsAuth={setIsAuth} role={role} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage setRole={setRole} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage setIsAuth={setIsAuth} />} />
          <Route path="/banks" element={<BanksPage />} />
          <Route path="/banks/:id" element={<BankDetailsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/:id" element={<AccountDetailsPage />} />
          <Route path="/loans" element={<LoanPage />} />
          <Route path="/loans/repay/:id" element={<LoanRepayPage />} />
          <Route path="/enterprises" element={<EnterprisesPage />} />
          <Route path="/enterprise/:id" element={<EnterpriseDetailsPage />} />
          <Route path="/salary-project/:id" element={<ProjectDetailsPage />} />
          <Route path="/eaccounts/:id" element={<EAccountDetailsPage />} />

          <Route path="/operator-panel" element={<OperatorPanel />} />
          <Route path="/manager-panel" element={<ManagePanel />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
