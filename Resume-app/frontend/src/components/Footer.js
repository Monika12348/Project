import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => (
  <Box
    sx={{
      position: "fixed",   
      bottom: 0,           
      left: 0,
      width: "100%",      
      py: 2,
      textAlign: "center",
      bgcolor: "black",
      color: "white",
    }}
  >
    <Typography variant="body2">
      © {new Date().getFullYear()} Resume Analyzer Builder. All rights reserved.
    </Typography>
    <Typography variant="body2">
      <Link href="/contact" color="inherit" underline="hover">Contact Us</Link> |{" "}
      <Link href="/about" color="inherit" underline="hover">About</Link> |{" "}
      <Link href="/privacy" color="inherit" underline="hover">Privacy Policy</Link>
    </Typography>
  </Box>
);

export default Footer;
