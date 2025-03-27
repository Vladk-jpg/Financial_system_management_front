import React, { useEffect, useState, useCallback } from "react";

const ProfilePage = ({ setRole }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          "Не удалось загрузить профиль, возможно вы не вошли в аккаунт!"
        );
      }

      const result = await response.json();
      setProfile(result.data);
      setRole(result.data.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setRole]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return <div className="container mt-5">Загрузка...</div>;
  }

  if (error) {
    return <div className="container mt-5">Ошибка! {error}</div>;
  }

  if (!profile) {
    return <div className="container mt-5">Профиль не найден</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Профиль пользователя</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{profile.fullName}</h5>
          <p className="card-text">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="card-text">
            <strong>Номер паспорта:</strong> {profile.passportNumber}
          </p>
          <p className="card-text">
            <strong>Идентификационный номер:</strong>{" "}
            {profile.identificationNumber}
          </p>
          <p className="card-text">
            <strong>Телефон:</strong> {profile.phone}
          </p>
          <p className="card-text">
            <strong>Роль:</strong> {profile.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
