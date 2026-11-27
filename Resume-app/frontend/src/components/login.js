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

export default function Login() {
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
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      // Backend sends { error: "..."} → so check error
      if (!res.ok) throw new Error(data.error || "Login failed.");

      // Save token + user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home or dashboard
      navigate("/home");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #e6f0ff, #f9dbe1)",
        padding: "20px",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          padding: "2.5rem",
          borderRadius: "16px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ mb: 1, fontWeight: "bold", color: "#333" }}
          >
            Welcome Back 👋
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Log in to continue building your resumes
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
              height: "45px",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: "600",
              fontSize: "1rem",
              color: "#fff",
              boxShadow: "0 3px 10px rgba(255,105,135,0.3)",
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>

        <Typography
          variant="body2"
          sx={{
            mt: 3,
            textAlign: "center",
            color: "#555",
            fontSize: "0.95rem",
          }}
        >
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#ff7f94",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Register here
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}
