import { Backdrop, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { forwardRef, useState } from "react";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ErrorSnackbar = ({ message }) => {
  const [errorSnackbar] = useState({
    open: true,
    vertical: "top",
    horizontal: "center",
  });
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorSnackbar.open}>
        <Alert
          severity="error"
          icon={false}
          sx={{
            padding: "10px 20px",
            backgroundColor: "#FF0000",
            fontSize: "1rem",
            fontWeight: "700",
            textAlign: "center",
          }}>
          <Typography sx={{ fontWeight: 600 }}>{message}</Typography>
        </Alert>
      </Snackbar>
    </Backdrop>
  );
};

export default ErrorSnackbar;
