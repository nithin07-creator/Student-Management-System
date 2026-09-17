import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const SAMPLE_STUDENTS = [
  { id: 1, first_name: "Asha", last_name: "Rao", email: "asha.rao@example.com", phone: "+919876543210", date_of_birth: "2003-05-14", course: "CSE", enrollment_date: "2026-09-10", address: "Chennai, TN" },
  { id: 2, first_name: "Rahul", last_name: "Sharma", email: "rahul.sharma@example.com", phone: "+919812345678", date_of_birth: "2002-11-20", course: "ECE", enrollment_date: "2026-09-12", address: "Bangalore, KA" },
  { id: 3, first_name: "Priya", last_name: "Patel", email: "priya.patel@example.com", phone: "+919711223344", date_of_birth: "2004-01-15", course: "IT", enrollment_date: "2026-09-14", address: "Mumbai, MH" },
  { id: 4, first_name: "Vikram", last_name: "Malhotra", email: "vikram.m@example.com", phone: "+919544332211", date_of_birth: "2001-08-05", course: "MECH", enrollment_date: "2026-09-15", address: "Delhi, DL" },
  { id: 5, first_name: "Ananya", last_name: "Deshmukh", email: "ananya.d@example.com", phone: "+919633221100", date_of_birth: "2003-03-30", course: "CIVIL", enrollment_date: "2026-09-16", address: "Pune, MH" }
];

export const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 3000,
});

export function parseApiError(err) {
  if (!err.response) return { _general: "Server unreachable — operating in LocalStorage Demo Mode." };
  const data = err.response.data;
  if (data.detail) return { _general: data.detail };
  const out = {};
  for (const [k, v] of Object.entries(data)) {
    out[k] = Array.isArray(v) ? v.join(" ") : String(v);
  }
  return out;
}

export const StudentAPI = {
  list: async (params = {}) => {
    try {
      const res = await client.get("/students/", { params });
      return { data: res.data, isLocal: false };
    } catch (err) {
      console.warn("REST API unavailable. Falling back to LocalStorage.");
      let local = localStorage.getItem("academiax_students");
      let students = local ? JSON.parse(local) : [...SAMPLE_STUDENTS];
      if (!local) localStorage.setItem("academiax_students", JSON.stringify(students));

      if (params.search) {
        const q = params.search.toLowerCase();
        students = students.filter(s =>
          `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q)
        );
      }
      if (params.course) {
        students = students.filter(s => s.course === params.course);
      }
      return { data: { count: students.length, results: students }, isLocal: true };
    }
  },

  create: async (data) => {
    try {
      const res = await client.post("/students/", data);
      return res.data;
    } catch (err) {
      let students = JSON.parse(localStorage.getItem("academiax_students") || "[]");
      const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
      const record = { id: newId, ...data, enrollment_date: new Date().toISOString().slice(0, 10) };
      students.push(record);
      localStorage.setItem("academiax_students", JSON.stringify(students));
      return record;
    }
  },

  update: async (id, data) => {
    try {
      const res = await client.patch(`/students/${id}/`, data);
      return res.data;
    } catch (err) {
      let students = JSON.parse(localStorage.getItem("academiax_students") || "[]");
      const idx = students.findIndex(s => s.id === id);
      if (idx !== -1) {
        students[idx] = { ...students[idx], ...data };
        localStorage.setItem("academiax_students", JSON.stringify(students));
      }
      return students[idx];
    }
  },

  remove: async (id) => {
    try {
      await client.delete(`/students/${id}/`);
    } catch (err) {
      let students = JSON.parse(localStorage.getItem("academiax_students") || "[]");
      students = students.filter(s => s.id !== id);
      localStorage.setItem("academiax_students", JSON.stringify(students));
    }
  },
};
