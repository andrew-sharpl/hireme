import { Snackbar, Alert } from "@mui/material";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

/*
Snackbar notification component that appears upon a successful job action (create, edit, delete).
*/
export default function SuccessSnackbar({ open, message, onClose }: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity="success">
        {message}
      </Alert>
    </Snackbar>
  );
}
