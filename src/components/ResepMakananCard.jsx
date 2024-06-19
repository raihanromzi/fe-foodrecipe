import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import FavoritDialog from "./FavoritDialog";
import { putFavoriteResepMasakan } from "../services/apis";

const ResepMakananCard = ({
  resepData,
  setIsPageError,
  userId,
  fetchDataResepMasakan,
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
    console.log("status", statusFavorite);
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
  };

  const handleRefetchData = () => {
    fetchDataResepMasakan(
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

  return (
    <>
      <FavoritDialog
        open={openFavoriteDialog}
        setOpen={setOpenFavoriteDialog}
        message={favoriteMessage}
        handleRefetchData={handleRefetchData}
      />
      {resepData.map((data, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ maxWidth: 345, marginX: "auto" }}>
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
              <Grid container>
                <Grid item xs={12}>
                  <Link
                    href={`/daftar-resep/detail-resep/${data.recipeId}`}
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
    </>
  );
};

export default ResepMakananCard;
