import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import api from "../services/api";

export default function CreateJobPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/jobs", { title, body });
      navigate("/");
    } catch {
      setError("Failed to create job. Please try again.");
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Button component={Link} to="/" sx={{ mb: 2 }}>
        ← Back to Listings
      </Button>
      <Typography variant="h4">Post a Job</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Description"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        multiline
        rows={6}
        required
      />

      <Button type="submit" variant="contained" size="large">
        Post Job
      </Button>
    </Box>
  );
}
