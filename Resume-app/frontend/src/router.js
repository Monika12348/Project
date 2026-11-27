import React from "react";
import { Navigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import ResumeBuilder from "./components/ResumeBuilder";
import TemplatePreview from "./components/Builder/TemplatePreview";
import TemplateSavedPreview from "./components/TemplateSavedPreview";
import UploadAnalyzer from "./components/UploadAnalyzer";
import AboutUs from "./components/AboutUs";
import Home from "./components/ResumeBuilderHome";
import Login from "./components/login";
import Register from "./components/register";
import SavedResumes from "./components/SavedResumes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />

      {/* Saved Resumes Listing */}
      <Route path="/saved" element={<SavedResumes />} />

      {/* Preview Saved Resume */}
      <Route path="/saved-preview/:id" element={<TemplateSavedPreview />} />

      {/* Builder */}
      <Route path="/builder" element={<ResumeBuilder />} />
      <Route path="/resume-builder/:id" element={<ResumeBuilder />} />
      <Route path="/preview/:id" element={<TemplatePreview />} />

      {/* Other pages */}
      <Route path="/analyze" element={<UploadAnalyzer />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
