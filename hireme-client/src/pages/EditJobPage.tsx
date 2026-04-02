import { useState, useEffect, type SyntheticEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import api from "../services/api";
import SuccessSnackbar from "../components/SuccessSnackbar";

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await api.get(`/jobs/${id}`);
        setTitle(response.data.title);
        setBody(response.data.body);
      } catch {
        setError("Failed to load job.");
      }
    }
    fetchJob();
  }, [id]);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/jobs/${id}`, { title, body });
      setSuccess(true);
      setTimeout(() => navigate(`/jobs/${id}`), 1500);
    } catch {
      setError("Failed to update job. You may not have permission.");
    }
  }

  return (
    <Box sx={{ maxWidth: 900, width: "100%", mx: "auto", mt: 4, px: 2 }}>
      <Button component={Link} to="/" sx={{ mb: 2 }}>
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
        <Typography variant="h4">Edit Job</Typography>

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
          rows={10}
          required
        />

        <Button type="submit" variant="contained" size="large" color="secondary">
          Save Changes
        </Button>
      </Paper>

      <SuccessSnackbar
        open={success}
        message="Job edited successfully!"
        onClose={() => setSuccess(false)}
      />
    </Box>
  );
}
