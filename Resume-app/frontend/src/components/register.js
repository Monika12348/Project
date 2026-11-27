import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const API_BASE =
      process.env.REACT_APP_API_URL?.replace(/\/$/, "") ||
      "http://localhost:5000";

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Register Response:", data);

      // Backend sends { error: "..." }
      if (!res.ok) throw new Error(data.error || "Registration failed.");

      // Success → Go to login
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9e0e5 0%, #e3f2fd 100%)",
      }}
    >
      {/* Left Quote / Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#333",
          textAlign: "center",
          px: 5,
          background: "linear-gradient(160deg, #ffd6e0 0%, #e6f0ff 100%)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome to Your Career Journey 🌟
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 400, color: "#555" }}>
          Build and manage your resumes easily. Create your professional identity today!
        </Typography>
      </Box>

      {/* Right Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 420,
            padding: "2.5rem",
            borderRadius: "18px",
            backgroundColor: "#fff",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", color: "#333" }}>
              Create Account ✨
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Sign up to save and manage your resumes
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />

            {error && (
              <Typography
                color="error"
                sx={{ mt: 1, textAlign: "center", fontSize: "0.9rem" }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: "#ff99aa",
                "&:hover": { backgroundColor: "#ff7f94" },
                height: "48px",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "600",
                fontSize: "1rem",
                color: "#fff",
                boxShadow: "0 3px 15px rgba(255,105,135,0.3)",
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </form>

          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", color: "#555", fontSize: "0.95rem" }}
          >
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#ff7f94", cursor: "pointer", fontWeight: 600 }}
            >
              Login here
            </span>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
