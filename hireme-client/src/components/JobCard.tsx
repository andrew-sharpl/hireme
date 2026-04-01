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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={`${job.interestCount} interested`}
            size="small"
            color={job.isInterestedByCurrentUser ? "primary" : "default"}
          />
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
