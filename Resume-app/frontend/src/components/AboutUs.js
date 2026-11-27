import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const AboutUs = () => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>About Resume Analyzer Builder</Typography>
      <Typography variant="body1" components>
        Resume Analyzer Builder is a smart web app that helps job seekers optimize their resumes using AI-based ATS analysis and modern templates.
      </Typography>
      <Typography variant="body1" components>
        Our platform offers instant feedback on resume strength, keyword relevance, and ATS compatibility. Then, users can build visually appealing resumes using pre-designed templates.
      </Typography>
      <Typography variant="body1">
        Whether you're starting from scratch or refining an existing resume, Resume Analyzer Builder provides the tools to create a standout resume that gets noticed by employers.
      </Typography>
    </Paper>
  </Container>
);

export default AboutUs;
