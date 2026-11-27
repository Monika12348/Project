import React from "react";

export default function Template3({ form = {} }) {
  const {
    name = "",
    title = "",
    phone = "",
    email = "",
    address = "",
    summary = "",
    education = "",
    experience = "",
    skills = "",
    projects = "",
  } = form || {};

  const hasData = (value) => value && String(value).trim().length > 0;

  // Split skills by comma or newline
  const skillList = hasData(skills)
    ? skills.split(/[,|\n]+/).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#fff",
        color: "#333",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 2fr",
          width: "900px",
          border: "1px solid #ddd",
        }}
      >
        {/* LEFT COLUMN */}
        <div
          style={{
            backgroundColor: "#f6ece9",
            padding: "30px 25px",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          {/* CONTACT */}
          {(hasData(phone) || hasData(email) || hasData(address)) && (
            <section>
              <h3
                style={{
                  fontSize: "14px",
                  letterSpacing: "2px",
                  marginBottom: "10px",
                }}
              >
                CONTACT
              </h3>
              {hasData(phone) && <p>📞 {phone}</p>}
              {hasData(email) && <p>✉️ {email}</p>}
              {hasData(address) && <p>📍 {address}</p>}
            </section>
          )}

          {/* SKILLS */}
          {skillList.length > 0 && (
            <section>
              <h3
                style={{
                  fontSize: "14px",
                  letterSpacing: "2px",
                  marginBottom: "10px",
                }}
              >
                SKILLS
              </h3>
              <ul style={{ paddingLeft: "18px", margin: 0 }}>
                {skillList.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ padding: "40px 50px" }}>
          {/* HEADER */}
          {(hasData(name) || hasData(title)) && (
            <header style={{ marginBottom: "40px" }}>
              {hasData(name) && (
                <h1
                  style={{
                    fontSize: "36px",
                    letterSpacing: "3px",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {name.toUpperCase()}
                </h1>
              )}
              {hasData(title) && (
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    letterSpacing: "3px",
                    marginTop: "5px",
                  }}
                >
                  {title.toUpperCase()}
                </h2>
              )}
            </header>
          )}

          {/* SUMMARY */}
          {hasData(summary) && (
            <section style={{ marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  letterSpacing: "2px",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                SUMMARY
              </h3>
              <p style={{ lineHeight: "1.6", fontSize: "15px" }}>{summary}</p>
            </section>
          )}

          {/* EDUCATION */}
          {hasData(education) && (
            <section style={{ marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  letterSpacing: "2px",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                EDUCATION
              </h3>
              <p style={{ lineHeight: "1.6" }}>{education}</p>
            </section>
          )}

          {/* EXPERIENCE */}
          {hasData(experience) && (
            <section style={{ marginBottom: "30px" }}>
              <h3
                style={{
                  fontSize: "14px",
                  letterSpacing: "2px",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                EXPERIENCE
              </h3>
              <p style={{ lineHeight: "1.6" }}>{experience}</p>
            </section>
          )}

          {/* PROJECTS */}
          {hasData(projects) && (
            <section>
              <h3
                style={{
                  fontSize: "14px",
                  letterSpacing: "2px",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                PROJECTS
              </h3>
              <p style={{ lineHeight: "1.6" }}>{projects}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
