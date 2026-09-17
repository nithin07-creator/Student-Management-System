import React, { useCallback, useEffect, useState } from "react";
import { StudentAPI, parseApiError } from "./api";
import StudentForm from "./StudentForm";
import StudentProfileModal from "./StudentProfileModal";
import DashboardView from "./DashboardView";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

const COURSES = [
  { value: "", label: "All Departments" },
  { value: "CSE", label: "Computer Science (CSE)" },
  { value: "ECE", label: "Electronics (ECE)" },
  { value: "MECH", label: "Mechanical (MECH)" },
  { value: "CIVIL", label: "Civil Engineering" },
  { value: "EEE", label: "Electrical (EEE)" },
  { value: "IT", label: "Information Tech (IT)" },
  { value: "OTHER", label: "Other Courses" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'roster' | 'departments'
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(false);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (courseFilter) params.course = courseFilter;
      const res = await StudentAPI.list(params);
      setStudents(res.data.results ?? res.data);
      setIsLocal(res.isLocal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, courseFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchStudents, 250);
    return () => clearTimeout(timeout);
  }, [fetchStudents]);

  async function handleSave(formData) {
    if (editingStudent) {
      await StudentAPI.update(editingStudent.id, formData);
      setToast({ message: "Student record updated.", tone: "success" });
    } else {
      await StudentAPI.create(formData);
      setToast({ message: "Student enrolled successfully.", tone: "success" });
    }
    setPanelOpen(false);
    setEditingStudent(null);
    fetchStudents();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await StudentAPI.remove(pendingDelete.id);
      setToast({ message: `Removed ${pendingDelete.first_name} ${pendingDelete.last_name}.`, tone: "success" });
      setStudents((prev) => prev.filter((s) => s.id !== pendingDelete.id));
    } catch (err) {
      setToast({ message: "Couldn't delete record.", tone: "error" });
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">AX</div>
          <span className="brand-name">AcademiaX</span>
        </div>

        <nav className="nav-tabs">
          <button className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`nav-tab ${activeTab === 'roster' ? 'active' : ''}`} onClick={() => setActiveTab('roster')}>
            🎓 Student Roster
          </button>
        </nav>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", padding: "4px 10px", borderRadius: "20px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-color)", fontWeight: "600" }}>
            {isLocal ? "⚠️ LocalStorage Demo" : "🟢 Django REST API"}
          </span>
          <button className="btn btn-primary" onClick={() => { setEditingStudent(null); setPanelOpen(true); }}>
            + Add Student
          </button>
        </div>
      </header>

      <main className="container">
        {activeTab === 'dashboard' && <DashboardView students={students} isLocal={isLocal} />}

        {activeTab === 'roster' && (
          <div>
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <input
                type="search"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "#fff" }}
              />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                style={{ width: "200px", padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "#fff" }}
              >
                {COURSES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading roster...</div>
            ) : students.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", background: "var(--bg-surface)", border: "1px dashed var(--border-color)", borderRadius: "12px" }}>
                <h3>No Students Found</h3>
                <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>Try clearing your filter or search criteria.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Enrolled</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <span style={{ fontWeight: 700, cursor: "pointer", color: "var(--accent-primary)" }} onClick={() => setViewingStudent(s)}>
                            {s.first_name} {s.last_name}
                          </span>
                        </td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>
                          <span className={`badge badge-${s.course.toLowerCase()}`}>{s.course}</span>
                        </td>
                        <td>{s.enrollment_date || "2026-09-17"}</td>
                        <td style={{ textAlign: "right" }}>
                          <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.78rem", marginRight: "6px" }} onClick={() => { setEditingStudent(s); setPanelOpen(true); }}>
                            Edit
                          </button>
                          <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: "0.78rem" }} onClick={() => setPendingDelete(s)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {panelOpen && (
        <StudentForm
          initialValue={editingStudent}
          onCancel={() => { setPanelOpen(false); setEditingStudent(null); }}
          onSave={handleSave}
        />
      )}

      {viewingStudent && (
        <StudentProfileModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
          onEdit={(s) => { setEditingStudent(s); setPanelOpen(true); }}
          onDelete={(s) => setPendingDelete(s)}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove student record?"
          body={`This will permanently remove ${pendingDelete.first_name} ${pendingDelete.last_name}'s record.`}
          confirmLabel="Delete"
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {toast && (
        <Toast message={toast.message} tone={toast.tone} onDone={() => setToast(null)} />
      )}
    </div>
  );
}
