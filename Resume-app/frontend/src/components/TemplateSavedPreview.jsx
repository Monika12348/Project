// TemplateSavedPreview.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Template1 from "./Builder/Template/Template1";
import Template2 from "./Builder/Template/Template2";
import Template3 from "./Builder/Template/Template3";
import Template4 from "./Builder/Template/Template4";

export default function TemplateSavedPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const previewRef = useRef(null); // reference to the DOM node we will capture

  const getImagePath = (img) => {
  if (!img) return null;

  // Base64 image (already full)
  if (img.startsWith("data:")) return img;

  // Uploaded file stored in backend
  return `${API_BASE}/uploads/${img}`;
};

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/api/resumes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setResume(data))
      .catch((err) => console.error("Preview load error:", err));
  }, [id, API_BASE]);

  if (!resume) return <h2 style={{ padding: 20 }}>Loading…</h2>;

  const goHome = () => navigate("/");
  const handleEdit = () => navigate(`/resume-builder/${id}`);

  // New: client-side PDF generation of the rendered template
  const handleDownload = async () => {
    try {
      

      // If uploaded file (pdf/docx) exists, download directly from uploads endpoint
      if (resume.filePath) {
        const url = `${API_BASE}/uploads/${resume.filePath}`;
        // open in new tab / browser will handle saving
        window.open(url, "_blank");
        return;
      }

      // Otherwise, capture the rendered template element
      const el = previewRef.current;
      if (!el) {
        console.error("Preview element not found for PDF capture.");
        return;
      }

      // Optionally set background white for capture
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true, // if you have external images you served with CORS headers
        allowTaint: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If content is longer than one page, split vertically
      if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      } else {
        // paginate:
        let remainingHeight = imgProps.height;
        const pageHeightPx = (pdf.internal.pageSize.getHeight() * imgProps.width) / pdfWidth;
        let position = 0;
        let pageCanvas, pageData;
        while (remainingHeight > 0) {
          // create a temporary canvas to crop
          pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(canvas.height - position, pageHeightPx);
          const ctx = pageCanvas.getContext("2d");
          ctx.drawImage(canvas, 0, position, canvas.width, pageCanvas.height, 0, 0, pageCanvas.width, pageCanvas.height);
          pageData = pageCanvas.toDataURL("image/png");
          const pageImgProps = pdf.getImageProperties(pageData);
          const pagePdfHeight = (pageImgProps.height * pdfWidth) / pageImgProps.width;
          pdf.addImage(pageData, "PNG", 0, 0, pdfWidth, pagePdfHeight);
          remainingHeight -= pageCanvas.height;
          position += pageCanvas.height;
          if (remainingHeight > 0) pdf.addPage();
        }
      }

      const filename = resume.title ? `${resume.title}.pdf` : "resume.pdf";
      pdf.save(filename);
    } catch (err) {
      console.error("Download Failed:", err);
      alert("Download failed. Check console for details.");
    }
  };

  /* ----------------------------------------------------------
      CASE 1 : FILE RESUME (just preview + download link)
  ------------------------------------------------------------- */
  if (resume.filePath) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>{resume.title}</h1>

        <iframe
          src={`${API_BASE}/uploads/${resume.filePath}`}
          width="100%"
          height="750px"
          style={{ border: "1px solid #ddd" }}
          title="Saved Resume Preview"
        />

        {/* BUTTONS AT BOTTOM */}
        <div style={bottomButtonArea}>
          <button onClick={goHome} style={btnStyle}>⬅ Back to Home</button>
          <button onClick={handleEdit} style={editBtn}>✏ Edit Resume</button>
          <button onClick={handleDownload} style={downloadBtn}>⬇ Download</button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------
      CASE 2 : TEMPLATE JSON RESUME (render template and capture it)
  ------------------------------------------------------------- */
  let data = resume.text;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return <h3 style={{ padding: 20 }}>Invalid resume format</h3>;
    }
  }

  const templateId = data.template || 1;
  const templates = {
  1: <Template1 form={data} />,
  2: <Template2 form={data} />,
  3: <Template3 form={data} />,
  4: <Template4 form={{ ...data, image: getImagePath(data.image) }} />,
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>{resume.title}</h1>

      {/* IMPORTANT: the template area has an id/ref used for html2canvas capture */}
      <div id="saved-resume-preview" ref={previewRef} style={{ background: "#fff" }}>
        {templates[templateId]}
      </div>

      {/* BUTTONS AT BOTTOM */}
      <div style={bottomButtonArea}>
        <button onClick={goHome} style={btnStyle}>⬅ Back to Home</button>
        <button onClick={handleEdit} style={editBtn}>✏ Edit Resume</button>
        <button onClick={handleDownload} style={downloadBtn}>⬇ Download</button>
      </div>
    </div>
  );
}

/* ------------------ STYLES ------------------ */
const bottomButtonArea = {
  marginTop: "30px",
  display: "flex",
  justifyContent: "center",
  gap: "15px",
};

const btnStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  background: "#ddd",
  border: "1px solid #aaa",
  cursor: "pointer",
};

const editBtn = {
  ...btnStyle,
  background: "#0066cc",
  color: "white",
};

const downloadBtn = {
  ...btnStyle,
  background: "green",
  color: "white",
};
