import React, { useState } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Import templates
import Template1 from "./Builder/Template/Template1";
import Template2 from "./Builder/Template/Template2";
import Template3 from "./Builder/Template/Template3";
import Template4 from "./Builder/Template/Template4";

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: null,
    summary: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
  });


  // Resize uploaded image before saving (prevents PDF errors)
const resizeImage = (file, maxSize = 400) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Scale down large images
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.src = URL.createObjectURL(file);
  });
};

const handleSaveResume = async () => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    alert("You must be logged in to save resumes.");
    return;
  }

  const user = JSON.parse(userData);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Create JSON including template number + base64 image
  const resumeJson = {
    ...formData,
    template: selectedTemplate,
    image: formData.imageBase64 || null,
  };

  const formDataToSend = new FormData();
  formDataToSend.append("userId", user.id);
  formDataToSend.append(
    "title",
    formData.name ? `${formData.name} Resume` : "Resume"
  );

  // Only ONE text field
  formDataToSend.append("text", JSON.stringify(resumeJson));

  // If user uploads an image file (optional)
  if (formData.imageFile) {
    formDataToSend.append("image", formData.imageFile);
  }

  try {
    const res = await fetch(`${API_BASE}/api/save-resume`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Resume saved successfully!");
    } else {
      alert(data.error || "Save failed");
    }
  } catch (error) {
    console.error(error);
    alert("Error saving resume.");
  }
};


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;

    img.onload = () => {
      // Create canvas
      const canvas = document.createElement("canvas");
      const maxSize = 400; // MAX WIDTH or HEIGHT
      let width = img.width;
      let height = img.height;

      // Resize logic
      if (width > height) {
        if (width > maxSize) {
          height = Math.floor(height * (maxSize / width));
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.floor(width * (maxSize / height));
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Compressed Base64
      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);

      setFormData({
        ...formData,
        image: resizedBase64,
        imageBase64: resizedBase64,
        imageFile: file,
      });

      alert("Image resized successfully — now it will work in PDF.");
    };
  };
};


  const handleDownload = async () => {
    const input = document.getElementById("resume-preview");
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.name || "resume"}.pdf`);
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 1:
        return <Template1 form={formData} />;
      case 2:
        return <Template2 form={formData} />;
      case 3:
        return <Template3 form={formData} />;
      case 4:
        return <Template4 form={formData} />;
      default:
        return (
          <Typography variant="body1" textAlign="center" sx={{ mt: 3, color: "gray" }}>
            Please select a template to preview your resume.
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Resume Builder
      </Typography>

      {/* Template Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
        <Button variant={selectedTemplate === 1 ? "contained" : "outlined"} onClick={() => setSelectedTemplate(1)}>
          Simple
        </Button>
        <Button variant={selectedTemplate === 2 ? "contained" : "outlined"} onClick={() => setSelectedTemplate(2)}>
          Professional
        </Button>
        <Button variant={selectedTemplate === 3 ? "contained" : "outlined"} onClick={() => setSelectedTemplate(3)}>
          Creative
        </Button>
        <Button variant={selectedTemplate === 4 ? "contained" : "outlined"} onClick={() => setSelectedTemplate(4)}>
          Image Resume
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/*  Form Section (from Template4 layout) */}
      <Box
        sx={{
          background: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          mb: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Enter Resume Information
        </Typography>

        <form
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={styles.input}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />

          <textarea
            name="summary"
            placeholder="Professional Summary"
            rows="3"
            value={formData.summary}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
          <textarea
            name="experience"
            placeholder="Work Experience"
            rows="3"
            value={formData.experience}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
          <textarea
            name="education"
            placeholder="Education"
            rows="3"
            value={formData.education}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
          <textarea
            name="skills"
            placeholder="Skills (comma separated)"
            rows="2"
            value={formData.skills}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
          <textarea
            name="projects"
            placeholder="Projects (one per line)"
            rows="3"
            value={formData.projects}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
        </form>
      </Box>

      {/*  Preview Section */}
      <Typography variant="h6" gutterBottom>
        Resume Preview
      </Typography>
      <Box
        id="resume-preview"
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "white",
          p: 3,
          mb: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {renderTemplate()}
      </Box>

      {/* Download Button */}
      {selectedTemplate && (
        <Box textAlign="center">
          <Button variant="contained" color="primary" onClick={handleDownload}>
            Download as PDF
          </Button>
        </Box>
      )}
      {selectedTemplate && (
  <Box textAlign="center" mt={2}>
    <Button variant="contained" color="secondary" onClick={handleSaveResume}>
      Save Resume
    </Button>
  </Box>
)}

    </Box>

    
  );
}

const styles = {
  input: {
    padding: "12px 14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    background: "#fff",
    color: "#333",
  },
  textarea: {
    padding: "12px 14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    background: "#fff",
    color: "#333",
  },
};
