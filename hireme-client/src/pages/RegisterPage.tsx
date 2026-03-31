import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Viewer");
  const [error, setError] = useState("");

  async function handleSubmit(e: SyntheticEvent) {
    // Prevents browser from doing a full page reload on submit
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Sends POST request to API
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
        role,
      });
      login(response.data);
      navigate("/");
    } catch {
      setError("Registration failed. Email or username may already be taken.");
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" textAlign="center">
        Create Account
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <TextField
        label="Role"
        select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value={0}>Viewer</MenuItem>
        <MenuItem value={1}>Poster</MenuItem>
      </TextField>

      <Button type="submit" variant="contained" size="large">
        Register
      </Button>

      <Typography textAlign="center">
        Already have an account? <Link to="/login">Sign In</Link>
      </Typography>
    </Box>
  );
}
