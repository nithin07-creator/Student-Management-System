import React, { useState } from "react";
import { parseApiError } from "./api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;

export default function StudentForm({ initialValue, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    first_name: initialValue?.first_name ?? "",
    last_name: initialValue?.last_name ?? "",
    email: initialValue?.email ?? "",
    phone: initialValue?.phone ?? "",
    date_of_birth: initialValue?.date_of_birth ?? "",
    course: initialValue?.course ?? "CSE",
    address: initialValue?.address ?? "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  function validate() {
    const errs = {};
    if (!formData.first_name.trim()) errs.first_name = "First name is required.";
    if (!formData.last_name.trim()) errs.last_name = "Last name is required.";
    if (!formData.email.trim()) errs.email = "Email address is required.";
    else if (!EMAIL_RE.test(formData.email.trim())) errs.email = "Enter a valid email address.";

    if (!formData.phone.trim()) errs.phone = "Phone number is required.";
    else if (!PHONE_RE.test(formData.phone.trim())) errs.phone = "Must be 7-15 digits, optionally with '+'.";

    if (!formData.date_of_birth) {
      errs.date_of_birth = "Date of birth is required.";
    } else {
      const dob = new Date(formData.date_of_birth);
      const age = (new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25);
      if (dob >= new Date()) errs.date_of_birth = "Date of birth must be in the past.";
      else if (age < 15) errs.date_of_birth = "Student must be at least 15 years old.";
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        ...formData,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });
    } catch (err) {
      setErrors(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <aside style={{ width: "min(480px, 100vw)", background: "var(--bg-surface)", borderLeft: "1px solid var(--border-color)", padding: "24px", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border-color)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem" }}>
            {initialValue ? "Edit Student Record" : "Add Student Record"}
          </h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", flex: 1 }}>
          {errors._general && (
            <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.15)", color: "#ef4444", borderRadius: "6px", fontSize: "0.85rem" }}>
              {errors._general}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", background: "var(--bg-surface-elevated)", border: `1px solid ${errors.first_name ? '#ef4444' : 'var(--border-color)'}`, borderRadius: "8px", color: "var(--text-primary)", outline: "none" }}
              />
              {errors.first_name && <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>{errors.first_name}</span>}
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", background: "var(--bg-surface-elevated)", border: `1px solid ${errors.last_name ? '#ef4444' : 'var(--border-color)'}`, borderRadius: "8px", color: "var(--text-primary)", outline: "none" }}
              />
              {errors.last_name && <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>{errors.last_name}</span>}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px 12px", background: "var(--bg-surface-elevated)", border: `1px solid ${errors.email ? '#ef4444' : 'var(--border-color)'}`, borderRadius: "8px", color: "var(--text-primary)", outline: "none" }}
            />
            {errors.email && <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>{errors.email}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+919876543210"
                style={{ width: "100%", padding: "8px 12px", background: "var(--bg-surface-elevated)", border: `1px solid ${errors.phone ? '#ef4444' : 'var(--border-color)'}`, borderRadius: "8px", color: "var(--text-primary)", outline: "none" }}
              />
              {errors.phone && <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>{errors.phone}</span>}
            </div>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>Date of Birth *</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 12px", background: "var(--bg-surface-elevated)", border: `1px solid ${errors.date_of_birth ? '#ef4444' : 'var(--border-color)'}`, borderRadius: "8px", color: "var(--text-primary)", outline: "none" }}
              />
              {errors.date_of_birth && <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>{errors.date_of_birth}</span>}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>Department / Course *</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px 12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-primary)", outline: "none" }}
            >
              <option value="CSE">Computer Science Engineering (CSE)</option>
              <option value="ECE">Electronics & Communication (ECE)</option>
              <option value="MECH">Mechanical Engineering (MECH)</option>
              <option value="CIVIL">Civil Engineering (CIVIL)</option>
              <option value="EEE">Electrical & Electronics (EEE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="OTHER">Other Courses</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>Address</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px 12px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-primary)", outline: "none" }}
            />
          </div>

          <div style={{ marginTop: "auto", paddingTop: "14px", display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--border-color)" }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : initialValue ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
