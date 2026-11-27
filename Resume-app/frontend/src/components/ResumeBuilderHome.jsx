import React from "react";

const ResumeHome = () => {
  return (
    <div className="home-container" style={styles.page}>
      {/* ✅ Combined Hero + Templates Section */}
      <section style={styles.heroCombined}>
        <div style={styles.heroContent}>
          <h1>Create a Professional Resume in Minutes</h1>
          <p>
            Build your perfect resume using modern, customizable templates — no
            design skills required!
          </p>

          {/* Template Names instead of links */}
          <div style={styles.templateGrid}>
            <div style={styles.templateCard}>Professional</div>
            <div style={styles.templateCard}>Creative</div>
            <div style={styles.templateCard}>Simple</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.features}>
        <h2>Why Choose ResumeBuilder?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <h3>🧠 Smart Templates</h3>
            <p>Choose from a variety of professional templates designed for every job role.</p>
          </div>
          <div style={styles.featureCard}>
            <h3>⚡ Fast and Easy</h3>
            <p>Just fill in your details and download your resume instantly.</p>
          </div>
          <div style={styles.featureCard}>
            <h3>📄 Export to PDF</h3>
            <p>Download your resume as a polished PDF, ready for job applications.</p>
          </div>
          <div style={styles.featureCard}>
            <h3>🔒 Secure</h3>
            <p>Your data stays private and secure — we never share your information.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeHome;

const styles = {
  page: {
    margin: 0,
    padding: 0,
    fontFamily: "'Poppins', sans-serif",
    background: "#f0f0f0",
    color: "#333",
  },

  heroCombined: {
    textAlign: "center",
    padding: "100px 20px 80px 20px",
    background: "linear-gradient(135deg, black, white, black)",
    color: "black",
  },

  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },

  templateGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "40px",
    flexWrap: "wrap",
  },

  templateCard: {
    background: "#fff",
    padding: "20px 40px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    color: "#333",
    fontWeight: "600",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },

  features: {
    background: "#fff",
    padding: "80px 20px",
    textAlign: "center",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "40px",
  },

  featureCard: {
    background: "#f9f9f9",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};
