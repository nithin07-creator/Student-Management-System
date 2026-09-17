import React from "react";

export default function StudentProfileModal({ student, onClose, onEdit, onDelete }) {
  if (!student) return null;

  const initials = (student.first_name[0] + student.last_name[0]).toUpperCase();

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex" }}>
      <div style={{ margin: "auto", width: "min(520px, calc(100vw - 32px))", background: "var(--bg-surface)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--accent-primary)", display: "grid", placeItems: "center", fontWeight: "700", fontSize: "1.4rem", color: "#fff" }}>
              {initials}
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem" }}>
                {student.first_name} {student.last_name}
              </h2>
              <span className={`badge badge-${student.course.toLowerCase()}`}>{student.course}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px", fontSize: "0.88rem" }}>
          <div style={{ background: "var(--bg-surface-elevated)", padding: "12px", borderRadius: "8px" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700" }}>EMAIL</div>
            <div style={{ fontWeight: "600" }}>{student.email}</div>
          </div>
          <div style={{ background: "var(--bg-surface-elevated)", padding: "12px", borderRadius: "8px" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700" }}>PHONE</div>
            <div style={{ fontWeight: "600" }}>{student.phone}</div>
          </div>
          <div style={{ background: "var(--bg-surface-elevated)", padding: "12px", borderRadius: "8px" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700" }}>DATE OF BIRTH</div>
            <div style={{ fontWeight: "600" }}>{student.date_of_birth}</div>
          </div>
          <div style={{ background: "var(--bg-surface-elevated)", padding: "12px", borderRadius: "8px" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700" }}>ENROLLED</div>
            <div style={{ fontWeight: "600" }}>{student.enrollment_date || "2026-09-17"}</div>
          </div>
        </div>

        <div style={{ background: "var(--bg-surface-elevated)", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.88rem" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700" }}>ADDRESS</div>
          <div style={{ fontWeight: "600" }}>{student.address || "No address provided."}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={() => { onClose(); onEdit(student); }}>✏️ Edit</button>
          <button className="btn btn-danger" onClick={() => { onClose(); onDelete(student); }}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}
