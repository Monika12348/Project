import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SavedResumes() {
  const [resumes, setResumes] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`${API_BASE}/api/resumes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setResumes(data);
      } else {
        console.error("Unexpected response:", data);
        setResumes([]); // fallback to empty array
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setResumes([]);
    });
}, [API_BASE]);


  // DELETE resume
  const deleteResume = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    const res = await fetch(`${API_BASE}/api/resumes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Failed to delete resume");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Saved Resumes</Typography>

      {resumes.length === 0 ? (
        <Typography>No saved resumes.</Typography>
      ) : (
        resumes.map((resume) => (
          <Paper key={resume.id} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">{resume.title}</Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/saved-preview/${resume.id}`)}
              >
                Preview
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{ ml: 2 }}
                onClick={() => deleteResume(resume.id)}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}
