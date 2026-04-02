import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  MenuItem,
  Paper,
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
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");

  function validate() {
    let valid = true;
    if (username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      valid = false;
    } else {
      setUsernameError("");
    }
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else {
      setEmailError("");
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmPasswordError("");
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
          Create Account
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!usernameError}
          helperText={usernameError}
          required
        />
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
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
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

        <Button
          type="submit"
          color="secondary"
          variant="contained"
          size="large"
        >
          Register
        </Button>

        <Typography textAlign="center">
          Already have an account? <Link to="/login">Sign In</Link>
        </Typography>
      </Box>
    </Paper>
  );
}
