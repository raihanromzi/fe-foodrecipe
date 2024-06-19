// DetailResep.js
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getDetailResep, putFavoriteResepMasakan } from "../services/apis";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import FavoritDialog from "../components/FavoritDialog";
import notFoundImage from "../public/svg/SearchNotFound.svg";

function DetailResep() {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [openFavoriteDialog, setOpenFavoriteDialog] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [resepData, setResepData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isDataEmpty, setIsDataEmpty] = useState(false);

  useEffect(() => {
    async function fetchDetailResep() {
      try {
        const response = await getDetailResep(id);

        setResepData(response.data.data);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error.message);
        if (error.response.status === 404) {
          setIsDataEmpty(true);
        }
      }
    }
    fetchDetailResep();
  }, [id]);

  // handle change isFavorite
  const handleChangeFavorite = async (statusFavorite) => {
    try {
      const updatedResepData = {
        ...resepData,
        isFavorite: !resepData.isFavorite,
      };
      setResepData(updatedResepData);

      const message = statusFavorite
        ? `Resep ${resepData.recipeName} berhasil dihapus dari favorite`
        : `Resep ${resepData.recipeName} berhasil ditambahkan ke dalam favorite`;

      setFavoriteMessage(message);
      setOpenFavoriteDialog(true);

      await putFavoriteResepMasakan(resepData.recipeId, userId);
    } catch (error) {
      console.log("error change favorite data", error);
    }
  };

  return (
    <div>
      <FavoritDialog
        open={openFavoriteDialog}
        setOpen={setOpenFavoriteDialog}
        message={favoriteMessage}
      />
      {isDataEmpty ? (
        <Container maxWidth="sm" sx={{ paddingBottom: 3 }}>
          <Grid item sx={{ marginY: 3 }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <IconButton aria-label="Example" onClick={() => navigate("/daftar-resep")}>
                  <ArrowBackIosNewIcon
                    color="black"
                    sx={{ fontSize: { xs: "24px", md: "32px" } }}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontSize: { xs: 24, md: 36 },
                    fontWeight: "600",
                  }}
                >
                  Detail Resep Makanan
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Box
            display="flex"
            flexDirection="column"
            marginX="auto"
            alignItems="center"
          >
            <img src={notFoundImage} alt="notFound" width={500} />
            <Typography
              sx={{
                fontSize: "24px",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              Data Tidak Tersedia
            </Typography>
          </Box>
        </Container>
      ) : resepData ? (
        <Container maxWidth="sm" sx={{ paddingBottom: 3 }}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            paddingTop={7}
            marginBottom={2}
            wrap="nowrap"
          >
            <Grid item sx={{ marginBottom: 3 }}>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <IconButton aria-label="Example" onClick={() => navigate(-1)}>
                    <ArrowBackIosNewIcon
                      color="black"
                      sx={{ fontSize: { xs: "24px", md: "32px" } }}
                    />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography
                    sx={{
                      fontSize: { xs: 24, md: 36 },
                      fontWeight: "600",
                    }}
                  >
                    {resepData.recipeName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <img
                className="imgDetail"
                src={resepData.imageFilename}
                alt={resepData.recipeName}
              />
            </Grid>
            <Grid item></Grid>
          </Grid>
          <Box
            sx={{
              border: "1px solid #01bfbf",
              borderRadius: "4px",
              padding: 2,
              marginBottom: 3,
            }}
          >
            <Grid
              spacing={2}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  <Grid item>
                    <Typography
                      sx={{
                        Size: 14,
                        color: "#01bfbf",
                      }}
                    >
                      Kategori
                    </Typography>
                  </Grid>
                  <Grid item className="item">
                    {resepData.categories.categoryName}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  <Grid item>
                    <Typography sx={{ fontSize: 14, color: "#01bfbf" }}>
                      Waktu Masak
                    </Typography>
                  </Grid>
                  <Grid item className="item">
                    {resepData.timeCook} Menit
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  <Grid item>
                    <Typography sx={{ fontSize: 14, color: "#01bfbf" }}>
                      Kesulitan
                    </Typography>
                  </Grid>
                  <Grid item className="item">
                    {resepData.levels.levelName}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={<StarBorderIcon sx={{ color: "#01BFBF" }} />}
                      checkedIcon={<StarIcon sx={{ color: "#01BFBF" }} />}
                    />
                  }
                  checked={resepData.isFavorite}
                  onChange={(event) => {
                    handleChangeFavorite(resepData.isFavorite);
                  }}
                  value="favorite"
                  label={
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "#01BFBF",
                      }}
                    >
                      Favorit
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="stretch"
            marginBottom={4}
            paddingX={{ xs: 1, md: 0 }}
          >
            <Grid item textAlign={"left"}>
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: "27px",
                  color: "#01bfbf",
                }}
              >
                Bahan-Bahan
              </Typography>
            </Grid>
            <Grid>
              <hr></hr>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "20px",
                  marginBottom: "17px",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: resepData.ingredient }}
                />
              </Typography>
            </Grid>
            <Grid item textAlign={"left"}>
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: "27px",
                  color: "#01bfbf",
                }}
              >
                Cara memasak
              </Typography>
            </Grid>
            <Grid>
              <hr></hr>
            </Grid>
            <Grid item textAlign={"left"}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  color: "#586A84",
                  textAlign: "justify",
                  lineHeight: "20px",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: resepData.howToCook }}
                />
              </div>
            </Grid>
          </Grid>
        </Container>
      ) : isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Grid item sx={{ marginY: 3 }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <IconButton aria-label="Example" onClick={() => navigate("/daftar-resep")}>
                  <ArrowBackIosNewIcon
                    color="black"
                    sx={{ fontSize: { xs: "24px", md: "32px" } }}
                  />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontSize: { xs: 24, md: 36 },
                    fontWeight: "600",
                  }}
                >
                  Detail Resep Makanan
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Box
            display="flex"
            flexDirection="column"
            marginX="auto"
            alignItems="center"
          >
            <img src={notFoundImage} alt="notFound" width={500} />
            <Typography
              sx={{
                fontSize: "24px",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              Detil Resep Masakan Tidak Tersedia
            </Typography>
          </Box>
        </>
      )}
    </div>
  );
}

export default DetailResep;
