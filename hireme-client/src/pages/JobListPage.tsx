import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Pagination,
  Typography,
  CircularProgress,
} from "@mui/material";
import api from "../services/api";
import JobCard from "../components/JobCard";

interface Job {
  id: number;
  title: string;
  body: string;
  postedAt: string;
  postedByUsername: string;
  interestCount: number;
  isInterestedByCurrentUser: boolean;
}

interface PagedResponse {
  items: Job[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const response = await api.get<PagedResponse>("/jobs", {
          params: { page, pageSize: 5, search },
        });
        setJobs(response.data.items);
        setTotalPages(response.data.totalPages);
      } catch {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [page, search]);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" mb={3}>
        Job Listings
      </Typography>

      <TextField
        fullWidth
        label="Search jobs..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : jobs.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No jobs found.
        </Typography>
      ) : (
        <>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
