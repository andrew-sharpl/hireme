import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  function validate() {
    let valid = true;
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else {
      setPasswordError("");
    }
    return valid;
  }

  async function handleSubmit(e: SyntheticEvent) {
    // Prevents browser from doing a full page reload on submit
    e.preventDefault();
    if (!validate()) return;
    setError("");
    try {
      // Sends POST request to API
      const response = await api.post("/auth/login", { email, password });
      login(response.data);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, borderRadius: 3 }}
    >
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
        <Typography
          variant="h3"
          textAlign="center"
          color="primary"
          fontWeight="bold"
          mb={4}
        >
          HireMe
        </Typography>

        <Typography variant="h4" textAlign="center">
          Sign In
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          required
        />

        <Button
          type="submit"
          color="secondary"
          variant="contained"
          size="large"
        >
          Sign In
        </Button>

        <Typography textAlign="center">
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </Paper>
  );
}
