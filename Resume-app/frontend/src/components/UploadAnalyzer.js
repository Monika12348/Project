import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Paper,
  CircularProgress,
  Grow,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BuildIcon from "@mui/icons-material/Build";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadAnalyzer = () => {
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // File Upload
  const onDrop = async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", acceptedFiles[0]);
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileText(res.data.text || "");
      setFileName(acceptedFiles[0].name || "Uploaded file");
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    }
    setLoading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
  });

  // Resume Analysis
  const analyze = async () => {
    if (!fileText || !jobDesc) {
      setError("Please upload a resume and enter a job description.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/analyze", { text: fileText, jobDesc });
      setAnalysis(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Try again later.");
    }
    setLoading(false);
  };

  const resetAll = () => {
    setFileText("");
    setFileName("");
    setJobDesc("");
    setAnalysis(null);
    setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "16px",
            width: "100%",
            backgroundColor: "#ffffffee",
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Resume Analyzer
          </Typography>

          {/* Upload Box */}
          {!analysis && (
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #1976d2",
                borderRadius: "10px",
                p: 5,
                textAlign: "center",
                cursor: "pointer",
                background: isDragActive ? "#e3f2fd" : "#fafafa",
                transition: "0.3s",
                "&:hover": { background: "#f1faff" },
              }}
            >
              <input {...getInputProps()} />
              <UploadFileIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {isDragActive
                  ? "Drop your resume here..."
                  : "Drag & drop a PDF or DOCX file, or click to select"}
              </Typography>
              {fileName && (
                <Typography sx={{ mt: 1, color: "gray" }}>
                  📄 {fileName}
                </Typography>
              )}
            </Box>
          )}

          {loading && (
            <Box sx={{ textAlign: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Job Description Input */}
          {fileText && !analysis && !loading && (
            <>
              <TextField
                fullWidth
                multiline
                label="Job Description"
                rows={4}
                sx={{ my: 3 }}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RestartAltIcon />}
                  onClick={resetAll}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AnalyticsIcon />}
                  onClick={analyze}
                >
                  Analyze Resume
                </Button>
              </Box>
            </>
          )}

          {/* Result Display */}
          <Grow in={!!analysis} timeout={600}>
            <Box>
              {analysis && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    mt: 4,
                    background: "#f9f9f9",
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    ATS Analysis Results
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    Compatibility Score:{" "}
                    <strong style={{ color: "#1976d2" }}>{analysis.score}%</strong>
                  </Typography>

                  {/* Progress Bar */}
                  <LinearProgress
                    variant="determinate"
                    value={analysis.score}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mb: 2,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          analysis.score >= 70 ? "#4caf50" : "#ff9800",
                      },
                    }}
                  />

                  <Typography sx={{ mt: 1 }}>
                    Matched Keywords:{" "}
                    {analysis.matchedKeywords?.length
                      ? analysis.matchedKeywords.join(", ")
                      : "None"}
                  </Typography>

                  <Typography sx={{ mt: 2 }}>Suggestions:</Typography>
                  <ul>
                    {(analysis.suggestions || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                  {/* Recommended Job Skill & Learning Websites */}
            <Box sx={{ mt: 3, p: 2, background: "#eef6ff", borderRadius: "8px" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1976d2", mb: 1 }}>
             Recommended Websites for Skill Improvement:
              </Typography>

                     <Typography sx={{ fontWeight: "bold", mt: 1 }}>📌 Job Skills & Market Trends</Typography>
                      <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                  <Typography sx={{ fontWeight: "bold", mt: 2 }}>📘 Free Learning Platforms</Typography>
                 <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                   <li><a href="https://www.coursera.org/" target="_blank" rel="noreferrer">Coursera – Courses from Top Universities</a></li>
                    <li><a href="https://www.edx.org/" target="_blank" rel="noreferrer">edX – MIT / Harvard Skill Courses</a></li>
                     <li><a href="https://www.udemy.com/courses/free/" target="_blank" rel="noreferrer">Udemy Free Courses</a></li>
                     <li><a href="https://www.khanacademy.org/" target="_blank" rel="noreferrer">Khan Academy – Foundation Skills</a></li>
                       <li><a href="https://alison.com/" target="_blank" rel="noreferrer">Alison – Free Certificates</a></li>
                      <li><a href="https://www.skillshare.com/" target="_blank" rel="noreferrer">Skillshare – Creative & Professional Skills</a></li>
                        </ul>

                    <Typography sx={{ fontWeight: "bold", mt: 2 }}>💻 Programming & Tech Skills</Typography>
                        <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                         <li><a href="https://www.freecodecamp.org/" target="_blank" rel="noreferrer">FreeCodeCamp – Full Coding Path</a></li>
                          <li><a href="https://www.codecademy.com/" target="_blank" rel="noreferrer">Codecademy – Learn Coding</a></li>
                         <li><a href="https://www.w3schools.com/" target="_blank" rel="noreferrer">W3Schools – Web Dev Essentials</a></li>
                            <li><a href="https://www.geeksforgeeks.org/" target="_blank" rel="noreferrer">GeeksForGeeks – Coding + Interview Prep</a></li>
                              <li><a href="https://www.hackerrank.com/" target="_blank" rel="noreferrer">HackerRank – Coding Practice</a></li>
                                   <li><a href="https://leetcode.com/" target="_blank" rel="noreferrer">LeetCode – Interview Coding</a></li>
                                       </ul>

                         <Typography sx={{ fontWeight: "bold", mt: 2 }}>🧠 Soft Skills & Career Growth</Typography>
                            <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
                               <li><a href="https://www.mindtools.com/" target="_blank" rel="noreferrer">MindTools – Soft Skills Training</a></li>
                                 <li><a href="https://www.toastmasters.org/" target="_blank" rel="noreferrer">Toastmasters – Public Speaking</a></li>
                                  <li><a href="https://hbr.org/" target="_blank" rel="noreferrer">Harvard Business Review – Leadership & Skills</a></li>
                                       </ul>
                                       </ul>
                                        </Box>


                  {/* Buttons */}
                  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<RestartAltIcon />}
                      onClick={resetAll}
                    >
                      Upload New Resume
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<BuildIcon />}
                      onClick={() => navigate("/builder")}
                    >
                      Go to Resume Builder
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>
          </Grow>
        </Paper>
      </Container>
    </Box>
  );
};

export default UploadAnalyzer;
