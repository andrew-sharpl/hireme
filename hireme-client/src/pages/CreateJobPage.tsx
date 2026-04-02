import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import api from "../services/api";
import SuccessSnackbar from "../components/SuccessSnackbar";

export default function CreateJobPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function validate() {
    let valid = true;
    if (title.trim().length < 5) {
      setTitleError("Title must be at least 5 characters.");
      valid = false;
    } else {
      setTitleError("");
    }
    if (body.trim().length < 20) {
      setBodyError("Description must be at least 20 characters.");
      valid = false;
    } else {
      setBodyError("");
    }
    return valid;
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;
    setError("");
    try {
      await api.post("/jobs", { title, body });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Failed to create job. Please try again.");
    }
  }

  return (
    <Box sx={{ maxWidth: 900, width: "100%", mx: "auto", mt: 4, px: 2 }}>
      <Button component={Link} to="/" color="secondary" sx={{ mb: 2 }}>
        ← Back to Listings
      </Button>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4">Post a Job</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!titleError}
          helperText={titleError}
          required
        />
        <TextField
          label="Description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          rows={10}
          error={!!bodyError}
          helperText={bodyError}
          required
        />


        <Button type="submit" variant="contained" size="large" color="secondary">
          Post Job
        </Button>
      </Paper>

      <SuccessSnackbar
        open={success}
        message="Job posted successfully!"
        onClose={() => setSuccess(false)}
      />
    </Box>
  );
}
