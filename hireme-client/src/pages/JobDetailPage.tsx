import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import SuccessSnackbar from "../components/SuccessSnackbar";

interface Job {
  id: number;
  title: string;
  body: string;
  postedAt: string;
  postedByUsername: string;
  interestCount: number;
  isInterestedByCurrentUser: boolean;
}

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [interestedUsers, setInterestedUsers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const isOwner = user?.username === job?.postedByUsername;
  const isViewer = user?.role === "Viewer";

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await api.get<Job>(`/jobs/${id}`);
        setJob(response.data);

        if (user?.username === response.data.postedByUsername) {
          const interestedResponse = await api.post<string[]>(
            `/jobs/${id}/interested`,
          );
          setInterestedUsers(interestedResponse.data);
        }
      } catch {
        setError("Failed to load job.");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id, user]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setSuccess(true); // Notify user of success
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Failed to delete job.");
    }
  }

  async function handleInterest() {
    try {
      const response = await api.post(`/jobs/${id}/interest`);
      setJob((prev) =>
        prev
          ? {
              ...prev,
              isInterestedByCurrentUser: response.data.interested,
              interestCount:
                prev.interestCount + (response.data.interested ? 1 : -1),
            }
          : prev,
      );
    } catch {
      setError("Failed to update interest.");
    }
  }

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  if (!job)
    return (
      <Typography textAlign="center" mt={6}>
        Job not found.
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button component={Link} to="/" color="secondary" sx={{ mb: 2 }}>
        ← Back to Listings
      </Button>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" mb={1}>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Posted by {job.postedByUsername} ·{" "}
          {new Date(job.postedAt).toLocaleDateString()}
        </Typography>

        <Typography variant="body1" mb={3}>
          {job.body}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {job.interestCount} interested
        </Typography>

        {isViewer && (
          <Button
            variant={job.isInterestedByCurrentUser ? "outlined" : "contained"}
            color="secondary"
            onClick={handleInterest}
            sx={{ mb: 3 }}
          >
            {job.isInterestedByCurrentUser
              ? "Remove Interest"
              : "Express Interest"}
          </Button>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          {isOwner && (
            <>
              <Button
                variant="outlined"
                component={Link}
                to={`/jobs/${id}/edit`}
              >
                Edit
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </Box>

        {isOwner && interestedUsers.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" mb={1}>
              Interested Users
            </Typography>
            {interestedUsers.map((username) => (
              <Chip key={username} label={username} sx={{ mr: 1, mb: 1 }} />
            ))}
          </>
        )}
        <SuccessSnackbar
          open={success}
          message="Job deleted successfully!"
          onClose={() => setSuccess(false)}
        />
      </Paper>
    </Box>
  );
}
