import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Template1 from "./Template/Template1";
import Template2 from "./Template/Template2";
import Template3 from "./Template/Template3";
import Template4 from "./Template/Template4";

export default function TemplatePreview() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/api/resumes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setResume(data))
      .catch((err) => console.error("Error loading resume", err));
  }, [id,API_BASE]);

  if (!resume) return <p>Loading...</p>;

  let data = resume.text;

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      console.log("❌ Failed to parse resume JSON");
      data = {};
    }
  }

  const templateId = data.template || 1;

  const templates = {
    1: <Template1 form={data} />,
    2: <Template2 form={data} />,
    3: <Template3 form={data} />,
    4: <Template4 form={data} />,
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{resume.title}</h2>
      {templates[templateId] || <p>No template found</p>}
    </div>
  );
}
