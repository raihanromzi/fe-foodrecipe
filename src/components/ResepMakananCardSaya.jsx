import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import FavoritDialog from "./FavoritDialog";
import { putFavoriteResepMasakan } from "../services/apis";
import { deleteRecipe } from "../services/apis";
import {
  CheckCircleOutline,
  DeleteSweep,
  Edit,
  ErrorOutline,
  MoreHoriz,
} from "@mui/icons-material";

const ResepMakananCard = ({
  resepData,
  setIsPageError,
  userId,
  fetchDataResepMasakanSaya,
  cookingTime,
  entries,
  foodCategory,
  foodLevel,
  page,
  recipeNameProps,
  sortBy,
}) => {
  const [openFavoriteDialog, setOpenFavoriteDialog] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  const handleChange = (event, recipeId, recipeName, statusFavorite) => {
    async function putFavorite() {
      try {
        if (statusFavorite === false) {
          setFavoriteMessage(
            `Berhasil Menambah Resep ${recipeName} ke Daftar Favorite`
          );
        } else if (statusFavorite === true) {
          setFavoriteMessage(
            `Berhasil Menghapus Resep ${recipeName} dari Favorit`
          );
        }

        await putFavoriteResepMasakan(recipeId, userId);
        setOpenFavoriteDialog(true);
      } catch (error) {
        console.log("error change favorite data", error);
        setIsPageError(true);
      }
    }
    putFavorite();
    fetchDataResepMasakanSaya(
      userId,
      page,
      entries,
      recipeNameProps,
      foodLevel,
      foodCategory,
      cookingTime,
      sortBy
    );
  };

  const handleOpenOptions = (event, id) => {
    setOption(id);
  };

  const handleCloseOptions = () => {
    setOption(null);
  };

  const [option, setOption] = useState(null);

  const [openDialog, setOpenDialog] = useState(null);

  const handleOpenDialog = (recipeId) => {
    setOpenDialog(recipeId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [deletionLoading, setDeletionLoading] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  const [deletedRecipeName, setDeletedRecipeName] = useState("");

  const handleDeleteRecipe = async (recipeId, userId, recipeName) => {
    try {
      setDeletionLoading(true);
      setDeletionSuccess(false);

      const { success, errorMessage } = await deleteRecipe(recipeId, userId);

      if (success) {
        setDeletedRecipeName(recipeName);
        setDeletionSuccess(true);
        console.log(`Recipe ${recipeName} deleted successfully!`);
      } else {
        console.error(`Failed to delete recipe: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
    } finally {
      fetchDataResepMasakanSaya(
        userId,
        page,
        entries,
        recipeNameProps,
        foodLevel,
        foodCategory,
        cookingTime,
        sortBy
      );
      setDeletionLoading(false);
    }
  };

  const [openDialogDeleted, setOpenDialogDeleted] = useState(false);

  useEffect(() => {
    if (deletionSuccess) {
      handleCloseDialog();
      setOpenDialogDeleted(true);
    }
  }, [deletionSuccess]);

  const handleCloseDialogDeleted = () => {
    setOpenDialogDeleted(false);
  };

  return (
    <>
      <FavoritDialog
        open={openFavoriteDialog}
        setOpen={setOpenFavoriteDialog}
        message={favoriteMessage}
      />
      {resepData.map((data, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ maxWidth: 345, marginX: "auto", position: "relative" }}>
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
              onClick={(event) => handleOpenOptions(event, data.recipeId)}>
              <MoreHoriz />
            </IconButton>
            <Menu
              anchorEl={
                option === data.recipeId ? document.activeElement : null
              }
              open={option === data.recipeId}
              onClose={handleCloseOptions}>
              <MenuItem
                component="a"
                href={`/resep-saya/edit-resep/${data.recipeId}`}>
                <Edit sx={{ color: "#01BFBF" }} />
                <Typography sx={{ color: "#01BFBF" }}>Edit</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleOpenDialog(data.recipeId);
                  handleCloseOptions();
                }}>
                <DeleteSweep sx={{ color: "red" }} />
                <Typography sx={{ color: "red" }}>Hapus</Typography>
              </MenuItem>
            </Menu>

            {/* Dialog for confirmation */}
            <Dialog
              open={openDialog === data.recipeId}
              onClose={handleCloseDialog}>
              <DialogTitle sx={{ textAlign: "center" }}>
                <ErrorOutline sx={{ fontSize: 96, color: "#FBBC04" }} />
              </DialogTitle>
              <DialogContent sx={{ textAlign: "center" }}>
                <Typography variant="body1">
                  Apakah anda yakin akan menghapus resep {data.recipeName}?
                </Typography>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "space-between" }}>
                <Button
                  onClick={handleCloseDialog}
                  sx={{
                    color: "#01BFBF",
                    marginX: 4,
                    textTransform: "capitalize",
                    backgroundColor: "white",
                    boxShadow: "none",
                    border: "1px solid #01BFBF",
                    width: "145px",
                  }}>
                  Tidak
                </Button>
                <Button
                  disabled={deletionLoading ? true : false}
                  onClick={() =>
                    handleDeleteRecipe(data.recipeId, userId, data.recipeName)
                  }
                  sx={{
                    color: "white",
                    marginX: 4,
                    textTransform: "capitalize",
                    backgroundColor: "#01BFBF",
                    boxShadow: "none",
                    width: "145px",
                    "&:hover": {
                      backgroundColor: "#01A0A0",
                      boxShadow: "none",
                    },
                  }}>
                  {deletionLoading ? <CircularProgress size={25} /> : "Ya"}
                </Button>
              </DialogActions>
            </Dialog>

            <CardMedia
              component="img"
              src={data.imageUrl}
              alt={data.recipeName}
              sx={{
                backgroundSize: "cover",
                height: "140px",
              }}
            />

            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                marginBottom={1}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#01BFBF",
                  }}>
                  {data.categories.categoryName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#01BFBF",
                  }}>
                  {data.levels.levelName}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: "600" }}>
                {data.recipeName}
              </Typography>
              <Box display="flex" justifyContent="space-between" marginTop={1}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#01BFBF",
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                  }}>
                  <AccessTimeIcon />
                  {data.time} Menit
                </Typography>
                <FormGroup
                  sx={{
                    "&.MuiFormGroup-root": {
                      display: "flex",
                      justifyContent: "right",
                      position: "relative",
                      right: -17,
                    },
                  }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<StarBorderIcon sx={{ color: "#01BFBF" }} />}
                        checkedIcon={<StarIcon sx={{ color: "#01BFBF" }} />}
                      />
                    }
                    checked={data.isFavorite}
                    onChange={(event) => {
                      handleChange(
                        event,
                        data.recipeId,
                        data.recipeName,
                        data.isFavorite
                      );
                    }}
                    value="favorite"
                    label={
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "#01BFBF",
                        }}>
                        Favorit
                      </Typography>
                    }
                  />
                </FormGroup>
              </Box>
            </CardContent>
            <CardActions>
              <Grid container direction="row" justifyContent="center">
                <Grid item xs>
                  <Link
                    href={`/resep-saya/detail-resep/${data.recipeId}`}
                    sx={{
                      textDecoration: "none",
                      textAlign: "center",
                    }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "#01BFBF",
                      }}>
                      Lihat Detail Resep
                    </Typography>
                    <Divider
                      flexItem
                      sx={{
                        backgroundColor: "#01BFBF",
                        width: { xs: "25%", md: "40%" },
                        marginX: "auto",
                      }}
                    />
                  </Link>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <Dialog
        open={openDialogDeleted}
        onClose={handleCloseDialogDeleted}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <CheckCircleOutline sx={{ color: "#00E696", fontSize: "80px" }} />
            <Typography
              sx={{ fontSize: "32px", fontWeight: "bold", color: "#00E696" }}>
              Success
            </Typography>
          </Box>
          <DialogContentText
            display="flex"
            alignItems="center"
            flexDirection={"column"}
            id="alert-dialog-description">
            Berhasil Menghapus Resep {deletedRecipeName}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              textTransform: "capitalize",
              backgroundColor: "#01BFBF",
              color: "white",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#01A0A0",
                boxShadow: "none",
              },
            }}
            onClick={handleCloseDialogDeleted}
            autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResepMakananCard;
