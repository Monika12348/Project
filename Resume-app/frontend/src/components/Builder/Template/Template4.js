import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Template4 = ({ form }) => {
  return (
    <div id="resume-preview" style={styles.preview}>
      {/* Header Section */}
      <div style={styles.header}>
        {form.image && <img src={form.image} alt="Profile" style={styles.profileImg} />}
        <h1>{form.name || " "}</h1>
        <div style={styles.contactInfo}>
          {(form.email || form.phone || form.address) ? (
            <>
              {form.email && (
                <p>
                  <FaEnvelope /> {form.email}
                </p>
              )}
              {form.phone && (
                <p>
                  <FaPhone /> {form.phone}
                </p>
              )}
              {form.address && (
                <p>
                  <FaMapMarkerAlt /> {form.address}
                </p>
              )}
            </>
          ) : (
            <p style={{ opacity: 0.7 }}>Add your contact information</p>
          )}
        </div>
      </div>

      {/* Conditional Sections */}
      {form.summary && (
        <div style={styles.section}>
          <h2>Professional Summary</h2>
          <p>{form.summary}</p>
        </div>
      )}

      {form.experience && (
        <div style={styles.section}>
          <h2>Experience</h2>
          <p>{form.experience}</p>
        </div>
      )}

      {form.education && (
        <div style={styles.section}>
          <h2>Education</h2>
          <p>{form.education}</p>
        </div>
      )}

      {form.skills && form.skills.trim() && (
        <div style={styles.section}>
          <h2>Skills</h2>
          <ul>
            {form.skills
              .split(",")
              .map((skill, index) => (
                <li key={index}>{skill.trim()}</li>
              ))}
          </ul>
        </div>
      )}

      {form.projects && form.projects.trim() && (
        <div style={styles.section}>
          <h2>Projects</h2>
          <ul>
            {form.projects
              .split("\n")
              .map((project, index) => (
                <li key={index}>{project.trim()}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Template4;

// ✅ Styles
const styles = {
  preview: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    minWidth: "300px",
  },
  header: {
    textAlign: "center",
    backgroundColor: "#1e3a8a",
    padding: "20px",
    borderRadius: "12px 12px 0 0",
    color: "white",
  },
  profileImg: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
    border: "3px solid white",
  },
  contactInfo: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "10px",
  },
  section: {
    marginTop: "20px",
  },
};
