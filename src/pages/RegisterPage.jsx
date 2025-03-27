import React, { useState } from 'react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        passportNumber: '',
        identificationNumber: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        isForeign: false,
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('Пароли не совпадают!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Регистрация успешна!');
            } else {
                setMessage(data.message || 'Ошибка регистрации!');
            }
        } catch (error) {
            setMessage('Ошибка соединения с сервером!');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Регистрация</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">ФИО</label>
                    <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Номер паспорта</label>
                    <input type="text" name="passportNumber" className="form-control" value={formData.passportNumber} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Идентификационный номер</label>
                    <input type="text" name="identificationNumber" className="form-control" value={formData.identificationNumber} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Телефон</label>
                    <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Пароль</label>
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Подтвердите пароль</label>
                    <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" name="isForeign" checked={formData.isForeign} onChange={handleChange} />
                    <label className="form-check-label">Иностранный гражданин</label>
                </div>

                <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default RegisterPage;
