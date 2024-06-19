import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import successCheck from "../public/svg/FavoritDialogCheck.svg";
import { Box } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
}));

export default function FavoritDialog({
  open,
  setOpen,
  message,
  handleRefetchData,
}) {
  const handleClose = () => {
    setOpen(false);
    handleRefetchData();
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "black",
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ marginTop: 3 }}>
          <Box display="flex" justifyContent="center" marginBottom={1}>
            <img src={successCheck} alt="success" />
          </Box>
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: "700",
              textAlign: "center",
              color: "#00E696",
              lineHeight: "40.16px",
              marginBottom: 1,
            }}>
            Sukses
          </Typography>
          <Typography sx={{ textAlign: "center" }}>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            disableElevation
            sx={{
              textTransform: "none",
              backgroundColor: "#01BFBF",
              "&:hover": { backgroundColor: "#01BFBF" },
            }}>
            <Typography sx={{ fontSize: "14px", fontWeight: "700" }}>
              Continue
            </Typography>
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
