import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleMenuClose();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src="/logo.svg"
            alt="Resume Analyzer Logo"
            style={{ height: 70, marginRight: 200 }}
          />
        </Box>

        {/* Normal navigation links */}
        <Button color="inherit" component={Link} to="/home">Home</Button>
        <Button color="inherit" component={Link} to="/analyze">Analyze</Button>
        <Button color="inherit" component={Link} to="/builder">Builder</Button>
        <Button color="inherit" component={Link} to="/about">About</Button>

        {/* Show Login if no user */}
        {!user && (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}

        {/* Show dropdown if user exists */}
        {user && (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {/* User name at top */}
              <MenuItem disabled>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                 {user && user.name ? user.name : "User"}
                 

                </Typography>
              </MenuItem>

              {/* Saved Resumes option */}
              <MenuItem component={Link} to="/saved" onClick={handleMenuClose}>
                Saved Resumes
              </MenuItem>

              {/* Logout option */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
