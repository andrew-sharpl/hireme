import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h3" fontWeight={700} mb={2}>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        Page not found.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="secondary">
        Back to Listings
      </Button>
    </Box>
  );
}
