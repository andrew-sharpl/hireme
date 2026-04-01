import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface Job {
  id: number;
  title: string;
  body: string;
  postedAt: string;
  postedByUsername: string;
  interestCount: number;
  isInterestedByCurrentUser: boolean;
}

export default function JobCard({ job }: { job: Job }) {
  const {user} = useAuth();
  const isViewer = user?.role === "Viewer";

  const [interested, setInterested] = useState(job.isInterestedByCurrentUser);
  const [interestCount, setInterestCount] = useState(job.interestCount);

      async function handleInterest() {
        try {
            const response = await api.post(`/jobs/${job.id}/interest`);
            setInterested(response.data.interested);
            setInterestCount((prev) => prev + (response.data.interested ? 1 : -1));
        } catch {
            console.error("Failed to toggle interest");
        }
    }


  return (
    <Card sx={{ mb: 2, width: "100%", minHeight: 220, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6">{job.title}</Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Posted by {job.postedByUsername} ·{" "}
          {new Date(job.postedAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {job.body.length > 200 ? job.body.slice(0, 200) + "..." : job.body}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`${interestCount} interested`}
            size="small"
            color={interested ? "primary" : "default"}
          />
          {isViewer && (
            <Button
              size="small"
              variant={interested ? "outlined" : "contained"}
              onClick={handleInterest}
            >
              {interested ? "Remove Interest" : "Express Interest"}
            </Button>
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/jobs/${job.id}`}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
