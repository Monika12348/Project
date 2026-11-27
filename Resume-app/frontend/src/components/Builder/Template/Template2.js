import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Phone, Email, LocationOn } from "@mui/icons-material";

export default function Template2({ form = {} }) {
  const {
    name = "",
    profession = "",
    phone = "",
    email = "",
    address = "",
    summary = "",
    skills = "",
    education = "",
    experience = "",
    projects = "",
  } = form;

  const hasData = (val) => val && val.trim() !== "";

  const splitByCommaOrLine = (val) => {
    if (!val) return [];
    return val
      .split(/[,|\n]/)
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const skillList = splitByCommaOrLine(skills);
  const eduList = splitByCommaOrLine(education);
  const expList = splitByCommaOrLine(experience);
  const projList = splitByCommaOrLine(projects);

  return (
    <Box
      sx={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#fff",
        color: "#222",
        p: 0,
        maxWidth: "900px",
        margin: "auto",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* ===== HEADER ===== */}
      {(name || profession || phone || email || address) && (
        <>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              px: 4,
              py: 3,
            }}
          >
            <Box>
              {name && (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#111", mb: 0 }}
                >
                  {name}
                </Typography>
              )}
              {profession && (
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 400, color: "#555" }}
                >
                  {profession}
                </Typography>
              )}
            </Box>

            <Box sx={{ textAlign: "right", fontSize: "14px" }}>
              {phone && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone fontSize="small" sx={{ color: "#e91e63" }} /> {phone}
                </Box>
              )}
              {email && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email fontSize="small" sx={{ color: "#e91e63" }} /> {email}
                </Box>
              )}
              {address && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn fontSize="small" sx={{ color: "#e91e63" }} />{" "}
                  {address}
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ borderBottomWidth: 2, borderColor: "#333" }} />
        </>
      )}

      {/* ===== CONTENT ===== */}
      <Box sx={{ px: 5, py: 4 }}>
        {/* SUMMARY */}
        {hasData(summary) && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                textDecoration: "underline",
                mb: 1,
              }}
            >
              Summary
            </Typography>
            <Typography sx={{ fontSize: "15px", lineHeight: 1.6 }}>
              {summary}
            </Typography>
          </Box>
        )}

        {/* SKILLS */}
        {skillList.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 1,
                letterSpacing: "1px",
              }}
            >
              Skills
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {skillList.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </Box>
        )}

        {/* EDUCATION */}
        {eduList.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 1,
                letterSpacing: "1px",
              }}
            >
              Education
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {eduList.map((edu, i) => (
                <li key={i}>{edu}</li>
              ))}
            </ul>
          </Box>
        )}

        {/* EXPERIENCE */}
        {expList.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 1,
                letterSpacing: "1px",
              }}
            >
              Experience
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {expList.map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </Box>
        )}

        {/* PROJECTS */}
        {projList.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 1,
                letterSpacing: "1px",
              }}
            >
              Projects
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {projList.map((proj, i) => (
                <li key={i}>{proj}</li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    </Box>
  );
}
