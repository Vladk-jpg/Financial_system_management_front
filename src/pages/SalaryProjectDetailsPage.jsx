import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  //const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    IBAN: "",
    salary: "",
    position: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3000/salary-projects/salary/by-id/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Ошибка загрузки проекта");
        const result = await response.json();
        setProject(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await fetch(`http://localhost:3000/salary-projects/employees/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Ошибка загрузки сотрудников");
        const result = await response.json();
        setEmployees(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProject();
    fetchEmployees();
  }, [id]);

  const handleGetEmployees = async () => {
    try {
      const response = await fetch(`http://localhost:3000/salary-projects/employees/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка загрузки сотрудников");
      const result = await response.json();
      setEmployees(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:3000/salary-projects/employee/${id}?id=${employeeId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Ошибка удаления сотрудника");
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/salary-projects/employee/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) throw new Error("Ошибка добавления сотрудника");
      //const result = await response.json();
      await handleGetEmployees();
      setNewEmployee({ IBAN: "", salary: "", position: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}

      {project && (
        <>
          <h2>{project.name}</h2>
          <p>{project.isActive ? "Активен" : "Неактивен"}</p>

          <h3>Сотрудники</h3>
          {employees.length > 0 ? (
            <ul className="list-group">
              {employees.map((emp) => (
                <li key={emp.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{emp.position} - {emp.salary} BYN</span>
                  <button className="btn btn-danger" onClick={() => handleDeleteEmployee(emp.id)}>Удалить</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Нет сотрудников</p>
          )}

          <h3 className="mt-4">Добавить сотрудника</h3>
          <form onSubmit={handleAddEmployee} className="mt-3">
            <div className="mb-3">
              <label className="form-label">IBAN</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.IBAN}
                onChange={(e) => setNewEmployee({ ...newEmployee, IBAN: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Зарплата</label>
              <input
                type="number"
                className="form-control"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Должность</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Добавить</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
