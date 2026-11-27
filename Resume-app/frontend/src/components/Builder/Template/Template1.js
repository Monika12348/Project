import React from "react";
import { Box, Typography, Divider } from "@mui/material";

export default function Template1({ form = {} }) {
  const {
    name,
    profession,
    email,
    phone,
    address,
    linkedin,
    portfolio,
    summary,
    skills,
    education,
    experience,
    projects,
  } = form;

  // Helper: renders a section only if content is non-empty
  const renderSection = (title, content) => {
    if (!content || !content.trim()) return null;
    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ color: "#1976d2", fontWeight: 600, mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", color: "#333" }}>
          {content}
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }} />
      </Box>
    );
  };

  // Filter out empty contact details
  const contactInfo = [email, phone, address, linkedin, portfolio]
    .filter((x) => x && x.trim() !== "")
    .join(" | ");

  const hasHeader = name || profession || contactInfo;

  return (
    <Box sx={{ fontFamily: "Arial", p: 2, color: "#000" }}>
      {/* Header Section */}
      {hasHeader && (
        <Box sx={{ textAlign: "center", mb: 3 }}>
          {name && (
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>
          )}
          {profession && (
            <Typography variant="h6" sx={{ color: "gray" }}>
              {profession}
            </Typography>
          )}
          {contactInfo && (
            <Typography variant="body2" sx={{ mt: 1, color: "#444" }}>
              {contactInfo}
            </Typography>
          )}
        </Box>
      )}

      {/* Render only sections that have info */}
      {summary && renderSection("Professional Summary", summary)}
      {skills &&
        skills.trim() !== "" &&
        renderSection(
          "Skills",
          skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .join(", ")
        )}
      {education && renderSection("Education", education)}
      {experience && renderSection("Experience", experience)}
      {projects && renderSection("Projects", projects)}
    </Box>
  );
}
