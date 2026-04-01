import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { buildConnection } from "../services/signalrService";

/*
Creates a component that will allow the SignalR logic to be held 
within a child component of the main app. This gives it access to useAuth(),
enabling JWT authentication.
*/
export default function SignalRListener() {
  const { user } = useAuth();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (!user || user.role !== "Poster") return;

    const connection = buildConnection(user.token);

    connection.on("ReceiveNotification", (message: string) => {
      setNotification(message);
    });

    connection.start().catch(console.error);

    return () => {
      connection.stop();
    };
  }, [user]);

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={6000}
      onClose={() => setNotification("")}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={() => setNotification("")} severity="info">
        {notification}
      </Alert>
    </Snackbar>
  );
}
