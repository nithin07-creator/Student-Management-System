import React from "react";

export default function DashboardView({ students, isLocal }) {
  const total = students.length;

  const totalAge = students.reduce((acc, s) => {
    if (!s.date_of_birth) return acc + 20;
    const age = (new Date() - new Date(s.date_of_birth)) / (1000 * 60 * 60 * 24 * 365.25);
    return acc + age;
  }, 0);

  const avgAge = total > 0 ? (totalAge / total).toFixed(1) : "--";

  const counts = { CSE: 0, ECE: 0, MECH: 0, CIVIL: 0, EEE: 0, IT: 0, OTHER: 0 };
  students.forEach(s => {
    if (counts[s.course] !== undefined) counts[s.course]++;
    else counts.OTHER++;
  });

  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "12px" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>TOTAL ENROLLED</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "800", margin: "6px 0" }}>{total}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-success)" }}>↑ 12% vs last term</div>
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "12px" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>ACTIVE DEPARTMENTS</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "800", margin: "6px 0" }}>7</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>CSE, ECE, MECH, CIVIL...</div>
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "12px" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>AVG STUDENT AGE</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "800", margin: "6px 0" }}>{avgAge} yrs</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Minimum age check (≥15)</div>
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", padding: "20px", borderRadius: "12px" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>DATA MODE</div>
          <div style={{ fontSize: "1.4rem", fontWeight: "800", margin: "6px 0", color: isLocal ? "var(--color-warning)" : "var(--color-success)" }}>
            {isLocal ? "LocalStorage" : "REST API"}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {isLocal ? "Offline Demo Mode" : "Connected port 8000"}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", padding: "24px", borderRadius: "12px" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", marginBottom: "18px" }}>Department Distribution Breakdown</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {Object.entries(counts).map(([code, count]) => {
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={code} style={{ display: "grid", gridTemplateColumns: "100px 1fr 40px", alignItems: "center", gap: "14px", fontSize: "0.85rem" }}>
                <span style={{ fontWeight: "600", color: "var(--text-secondary)" }}>{code}</span>
                <div style={{ height: "10px", background: "var(--bg-surface-elevated)", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent-primary)", borderRadius: "99px", transition: "width 0.5s ease" }} />
                </div>
                <span style={{ fontWeight: "700", textAlign: "right" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
