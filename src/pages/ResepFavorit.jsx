import ResepMakananCard from "../components/ResepMakananCard";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Hidden,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { getDaftarResepFavorit } from "../services/apis";
import ErrorSnackbar from "../components/ErrorSnackbar";
import CardSkeletonLoading from "../components/CardSkeletonLoading";
import useToken from "../services/AuthProvider";
import notFoundImage from "../public/svg/SearchNotFound.svg";

const MyPagination = styled(Pagination)({
  "&.MuiPagination-root": {
    "& .Mui-selected": {
      backgroundColor: "#01BFBF",
      color: "white",
      "&:hover": {
        backgroundColor: "#01BFBF",
        color: "white",
      },
    },
  },
  "& .MuiPaginationItem-root": {
    color: "#01BFBF",
  },
});

const DaftarResepFavorit = () => {
  const [filterMenu, setFilterMenu] = useState(null);
  const openFilterMenu = Boolean(filterMenu);
  const handleClickFilterMenu = (event) => {
    setFilterMenu(event.currentTarget);
  };
  const handleCloseFilterMenu = () => {
    setFilterMenu(null);
  };

  const { userId } = useToken();

  const [filterMenuMobile, setFilterMenuMobile] = useState(null);
  const openFilterMenuMobile = Boolean(filterMenuMobile);
  const handleClickFilterMenuMobile = (event) => {
    setFilterMenuMobile(event.currentTarget);
  };
  const handleCloseFilterMenuMobile = () => {
    setFilterMenuMobile(null);
  };

  const [tempRecipeName, setTempRecipeName] = useState("");
  const [tempFoodLevel, setTempFoodLevel] = useState("");
  const [tempFoodCategory, setTempFoodCategory] = useState("");
  const [tempCookingTime, setTempCookingTime] = useState("");
  const [tempSortBy, setTempSortBy] = useState("recipeName,asc");

  const [recipeName, setRecipeName] = useState("");
  const handleChangeRecipeName = (event) => {
    setTempRecipeName(event.target.value);
  };

  const [foodLevel, setFoodLevel] = useState("");
  const handleChangeFoodLevel = (event) => {
    setTempFoodLevel(event.target.value);
    setPage(1);
  };

  const [foodCategory, setFoodCategory] = useState("");
  const handleChangeFoodCategory = (event) => {
    setTempFoodCategory(event.target.value);
    setPage(1);
  };

  const [cookingTime, setCookingTime] = useState("");
  const handleChangeCookingTime = (event) => {
    setTempCookingTime(event.target.value);
  };

  const [sortBy, setSortBy] = useState("recipeName,asc");
  const handleChangeSortBy = (event) => {
    setTempSortBy(event.target.value);
  };

  const handleChangeSortByMobile = (event) => {
    setSortBy(event.target.value);
  };

  const handleClickResetFilter = () => {
    setTempFoodLevel("");
    setTempFoodCategory("");
    setTempCookingTime("");
    setTempSortBy("");
  };

  const handleApplySearch = () => {
    setRecipeName(tempRecipeName);
    setPage(1);
  };

  const handleApplyFilter = () => {
    setFoodLevel(tempFoodLevel);
    setFoodCategory(tempFoodCategory);
    setCookingTime(tempCookingTime);
    setSortBy(tempSortBy);
    setPage(1);
  };

  const handleApplyFilterMobile = () => {
    setFoodLevel(tempFoodLevel);
    setFoodCategory(tempFoodCategory);
    setCookingTime(tempCookingTime);
    setPage(1);
  };

  const [entries, setEntries] = useState(8);
  const [page, setPage] = useState(1);

  const handleClickEntries = (value) => {
    if (value === entries) {
      return;
    }
    setEntries(value);
  };

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  const [resepData, setResepData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isPageError, setIsPageError] = useState(false);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchDataResepFavorit(
    userId,
    page,
    entries,
    recipeName,
    foodLevel,
    foodCategory,
    cookingTime,
    sortBy
  ) {
    try {
      // const authToken = getAuthToken();

      const response = await getDaftarResepFavorit(
        userId,
        page,
        entries,
        recipeName,
        foodLevel,
        foodCategory,
        cookingTime,
        sortBy
        // authToken
      );
      setResepData(response.data.data);
      setTotalData(response.data.total);

      if (response.data.total === 0 || response.status === 404) {
        setIsDataEmpty(true);
      } else {
        setIsDataEmpty(false);
      }

      setIsLoading(false);
      setIsPageError(false);
    } catch (error) {
      if (error.response.status === 404) {
        setIsDataEmpty(true);
      } else {
        console.error(error);
        setIsPageError(true);
        setIsLoading(true);
      }
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchDataResepFavorit(
      userId,
      page,
      entries,
      recipeName,
      foodLevel,
      foodCategory,
      cookingTime,
      sortBy
    );
  }, [
    userId,
    entries,
    foodCategory,
    foodLevel,
    page,
    recipeName,
    cookingTime,
    sortBy,
  ]);

  useEffect(() => {
    const total = Math.ceil(totalData / entries);
    setTotalPage(total);
  }, [totalData, entries]);

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.only("xs"));
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setScrollPosition(scrollPosition);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  return (
    <>
      {isPageError && (
        <ErrorSnackbar message="Terjadi kesalahan server. Silahkan coba kembali" />
      )}
      <Box
        width="100%"
        paddingY={{ xs: "16px", md: "32px" }}
        sx={{ backgroundColor: "#F0F9F9" }}>
        {/* Mobile Filter */}
        <Hidden mdUp>
          <Box marginX={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: "700",
                    textAlign: "center",
                  }}>
                  Resep Favorit
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="search"
                  variant="outlined"
                  size="small"
                  placeholder="Cari Resep"
                  value={tempRecipeName}
                  onChange={handleChangeRecipeName}
                  onKeyUp={(event) => {
                    event.key === "Enter" && handleApplySearch();
                  }}
                  InputProps={{
                    startAdornment: (
                      <IconButton onClick={handleApplySearch}>
                        <SearchIcon />
                      </IconButton>
                    ),
                    endAdornment: tempRecipeName && (
                      <IconButton
                        onClick={() => {
                          setTempRecipeName(""), setRecipeName("");
                        }}>
                        <ClearIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="large"
                  id="filterMobile"
                  variant="outlined"
                  aria-controls={
                    openFilterMenuMobile ? "filterMobile" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={openFilterMenuMobile ? "true" : undefined}
                  onClick={handleClickFilterMenuMobile}
                  sx={{
                    textTransform: "none",
                    color: "black",
                    "&.MuiButton-outlined": {
                      borderColor: "#B4B4BB",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    },
                  }}>
                  <Typography>Filter</Typography>
                  <FilterListIcon />
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={filterMenuMobile}
                  open={openFilterMenuMobile}
                  onClose={handleCloseFilterMenuMobile}
                  MenuListProps={{
                    "aria-labelledby": "filterMobile",
                  }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "&::before": {
                        content: scrollPosition >= 115 && '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 180,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "center", vertical: "top" }}
                  anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
                  <Box
                    padding={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    gap={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <Typography sx={{ fontWeight: "700" }}>
                            Tingkat Kesulitan
                          </Typography>
                          <FormControl
                            sx={{ m: 1, minWidth: 120 }}
                            size="small">
                            <Select
                              displayEmpty
                              labelId="level"
                              id="level"
                              value={tempFoodLevel}
                              onChange={handleChangeFoodLevel}>
                              <MenuItem value="">ALL</MenuItem>
                              <MenuItem value="4">Easy</MenuItem>
                              <MenuItem value="3">Medium</MenuItem>
                              <MenuItem value="2">Hard</MenuItem>
                              <MenuItem value="1">Master Chef</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <Typography sx={{ fontWeight: "700" }}>
                            Kategori
                          </Typography>
                          <FormControl
                            sx={{ m: 1, minWidth: 120 }}
                            size="small">
                            <Select
                              displayEmpty
                              labelId="foodCategory"
                              id="foodCategory"
                              value={tempFoodCategory}
                              onChange={handleChangeFoodCategory}>
                              <MenuItem value="">ALL</MenuItem>
                              <MenuItem value="2">Breakfast</MenuItem>
                              <MenuItem value="1">Lunch</MenuItem>
                              <MenuItem value="3">Dinner</MenuItem>
                              <MenuItem value="4">Snack</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <Typography sx={{ fontWeight: "700" }}>
                            Waktu Memasak
                          </Typography>
                          <FormControl
                            sx={{ m: 1, minWidth: 120 }}
                            size="small">
                            <Select
                              displayEmpty
                              labelId="cookingTime"
                              id="cookingTime"
                              value={tempCookingTime}
                              onChange={handleChangeCookingTime}>
                              <MenuItem value="">ALL</MenuItem>
                              <MenuItem value="30">0-30 Menit</MenuItem>
                              <MenuItem value="60">30-60 Menit</MenuItem>
                              <MenuItem value="90">{">"}60 Menit</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Button
                          onClick={handleClickResetFilter}
                          variant="text"
                          sx={{ textTransform: "none", color: "#EA4335" }}>
                          <Typography>Bersihkan filter</Typography>
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" gap={1}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleCloseFilterMenuMobile}
                            sx={{
                              color: "#01BFBF",
                              textTransform: "none",
                              fontWeight: "700",
                            }}>
                            Batal
                          </Button>
                          <Button
                            onClick={() => {
                              handleApplyFilterMobile(),
                                handleCloseFilterMenuMobile();
                            }}
                            fullWidth
                            variant="container"
                            disableElevation
                            sx={{
                              textTransform: "none",
                              backgroundColor: "#01BFBF",
                              "&:hover": { backgroundColor: "#01BFBF" },
                              color: "white",
                              fontWeight: "700",
                            }}>
                            Terapkan
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Menu>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="sortBy">Sort By</InputLabel>
                    <Select
                      labelId="sortBy"
                      id="sortBy"
                      value={sortBy}
                      label="Sort By"
                      onChange={handleChangeSortByMobile}>
                      <MenuItem value="recipeName,asc">Nama Resep A-Z</MenuItem>
                      <MenuItem value="recipeName,desc">
                        Nama Resep Z-A
                      </MenuItem>
                      <MenuItem value="timeCook,asc">
                        Waktu Memasak A-Z
                      </MenuItem>
                      <MenuItem value="timeCook,desc">
                        Waktu Memasak Z-A
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  href="/tambah-resep"
                  variant="contained"
                  size="medium"
                  disableElevation
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#01BFBF",
                    "&:hover": {
                      backgroundColor: "#01BFBF",
                    },
                  }}>
                  <Box display="flex" gap={2}>
                    <AddIcon />
                    <Typography sx={{ fontWeight: "700" }}>
                      Tambah Resep
                    </Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    textAlign: "center",
                  }}>
                  Menampilkan seluruh resep favorit Anda
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Hidden>
        {/* End of Mobile Filter */}

        {/* Desktop Filter */}
        <Box
          display={{ xs: "none", md: "flex" }}
          justifyContent="space-between"
          gap={1}
          width="50vw"
          marginX="auto">
          <Button
            href="/tambah-resep"
            variant="contained"
            disableElevation
            sx={{
              textTransform: "none",
              backgroundColor: "#01BFBF",
              "&:hover": {
                backgroundColor: "#01BFBF",
              },
            }}>
            <Box display="flex" gap={2}>
              <AddIcon />
              <Typography sx={{ fontWeight: "700" }}>Tambah Resep</Typography>
            </Box>
          </Button>
          <TextField
            id="search"
            variant="outlined"
            size="small"
            placeholder="Cari Resep"
            value={tempRecipeName}
            onChange={handleChangeRecipeName}
            onKeyUp={(event) => {
              event.key === "Enter" && handleApplySearch();
            }}
            InputProps={{
              startAdornment: (
                <IconButton onClick={handleApplySearch}>
                  <SearchIcon />
                </IconButton>
              ),
              endAdornment: tempRecipeName && (
                <IconButton
                  onClick={() => {
                    setTempRecipeName(""), setRecipeName("");
                  }}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{ width: "50%" }}
          />
          <Box>
            <Button
              id="filter"
              size="large"
              variant="outlined"
              aria-controls={openFilterMenu ? "filter" : undefined}
              aria-haspopup="true"
              aria-expanded={openFilterMenu ? "true" : undefined}
              onClick={handleClickFilterMenu}
              sx={{
                textTransform: "none",
                color: "#9696A0",
                "&.MuiButton-outlined": { borderColor: "#9696A0" },
              }}>
              <Box display="flex" gap={2}>
                <Typography>Filter</Typography>
                <FilterListIcon />
              </Box>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={filterMenu}
              open={openFilterMenu}
              onClose={handleCloseFilterMenu}
              MenuListProps={{
                "aria-labelledby": "filter",
              }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 180,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "center", vertical: "top" }}
              anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
              <Box
                padding={3}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                gap={3}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontWeight: "700" }}>
                        Tingkat Kesulitan
                      </Typography>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          displayEmpty
                          labelId="level"
                          id="level"
                          value={tempFoodLevel}
                          onChange={handleChangeFoodLevel}>
                          <MenuItem value="">ALL</MenuItem>
                          <MenuItem value="4">Easy</MenuItem>
                          <MenuItem value="3">Medium</MenuItem>
                          <MenuItem value="2">Hard</MenuItem>
                          <MenuItem value="1">Master Chef</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontWeight: "700" }}>
                        Kategori
                      </Typography>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          displayEmpty
                          labelId="foodCategory"
                          id="foodCategory"
                          value={tempFoodCategory}
                          onChange={handleChangeFoodCategory}>
                          <MenuItem value="">ALL</MenuItem>
                          <MenuItem value="2">Breakfast</MenuItem>
                          <MenuItem value="1">Lunch</MenuItem>
                          <MenuItem value="3">Dinner</MenuItem>
                          <MenuItem value="4">Snack</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontWeight: "700" }}>
                        Waktu Memasak
                      </Typography>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          displayEmpty
                          labelId="cookingTime"
                          id="cookingTime"
                          value={tempCookingTime}
                          onChange={handleChangeCookingTime}>
                          <MenuItem value="">ALL</MenuItem>
                          <MenuItem value="30">0-30 Menit</MenuItem>
                          <MenuItem value="60">30-60 Menit</MenuItem>
                          <MenuItem value="90">{">"}60 Menit</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <Typography sx={{ fontWeight: "700" }}>Sortir</Typography>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="sortBy"
                          id="sortBy"
                          value={tempSortBy}
                          onChange={handleChangeSortBy}>
                          <MenuItem value="recipeName,asc">
                            Nama Resep A-Z
                          </MenuItem>
                          <MenuItem value="recipeName,desc">
                            Nama Resep Z-A
                          </MenuItem>
                          <MenuItem value="timeCook,asc">
                            Waktu Memasak A-Z
                          </MenuItem>
                          <MenuItem value="timeCook,desc">
                            Waktu Memasak Z-A
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      onClick={handleClickResetFilter}
                      variant="text"
                      sx={{ textTransform: "none", color: "#EA4335" }}>
                      <Typography>Bersihkan filter</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        onClick={handleCloseFilterMenu}
                        sx={{
                          color: "#01BFBF",
                          textTransform: "none",
                          fontWeight: "700",
                        }}>
                        Batal
                      </Button>
                      <Button
                        onClick={() => {
                          handleApplyFilter(), handleCloseFilterMenu();
                        }}
                        variant="container"
                        disableElevation
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#01BFBF",
                          "&:hover": { backgroundColor: "#01BFBF" },
                          color: "white",
                          fontWeight: "700",
                        }}>
                        Terapkan
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Menu>
          </Box>
        </Box>
        {/* End of Desktop Filter */}

        <Box
          width={{ xs: "90%", md: "75%" }}
          marginX="auto"
          marginTop={{ xs: 2, md: 3 }}>
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontSize: "36px",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 3,
            }}>
            Resep Favorit
          </Typography>
          <Grid container spacing={3} sx={{ marginBottom: 3 }}>
            {isDataEmpty ? (
              <Box display="flex" flexDirection="column" marginX="auto">
                <img src={notFoundImage} alt="notFound" width={500} />
                <Typography
                  sx={{
                    fontSize: "24px",
                    textAlign: "center",
                    fontWeight: "700",
                  }}>
                  Resep masakan tidak tersedia
                </Typography>
              </Box>
            ) : resepData ? (
              isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <CardSkeletonLoading />
                  </Grid>
                ))
              ) : (
                <ResepMakananCard
                  resepData={resepData}
                  setIsPageError={setIsPageError}
                  userId={userId}
                  fetchDataResepMasakan={fetchDataResepFavorit}
                  cookingTime={cookingTime}
                  entries={entries}
                  foodCategory={foodCategory}
                  foodLevel={foodLevel}
                  page={page}
                  recipeNameProps={recipeName}
                  sortBy={sortBy}
                />
              )
            ) : (
              setIsLoading(true)
            )}
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent={{ xs: "center", md: "left" }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    sx={{
                      color: "#787885",
                      fontWeight: "400",
                      fontSize: { xs: "14px", md: "16px" },
                    }}>
                    Entries
                  </Typography>
                  <IconButton
                    aria-label="entries"
                    size="small"
                    onClick={() => {
                      handleClickEntries(8);
                    }}>
                    <Typography
                      sx={{
                        backgroundColor: entries === 8 ? "#01BFBF" : "initial",
                        fontSize: { xs: "14px", md: "16px" },
                        color: entries === 8 ? "white" : "#787885",
                        paddingY: 0.5,
                        paddingX: 1,
                        borderRadius: entries === 8 ? "4px" : "initial",
                      }}>
                      8
                    </Typography>
                  </IconButton>
                  <IconButton
                    aria-label="entries"
                    size="small"
                    onClick={() => {
                      handleClickEntries(16);
                    }}>
                    <Typography
                      sx={{
                        backgroundColor: entries === 16 ? "#01BFBF" : "initial",
                        fontSize: { xs: "14px", md: "16px" },
                        color: entries === 16 ? "white" : "#787885",
                        paddingY: 0.5,
                        paddingX: 1,
                        borderRadius: entries === 16 ? "4px" : "initial",
                      }}>
                      16
                    </Typography>
                  </IconButton>
                  <IconButton
                    aria-label="entries"
                    size="small"
                    onClick={() => {
                      handleClickEntries(48);
                    }}>
                    <Typography
                      sx={{
                        backgroundColor: entries === 48 ? "#01BFBF" : "initial",
                        fontSize: { xs: "14px", md: "16px" },
                        color: entries === 48 ? "white" : "#787885",
                        paddingY: 0.5,
                        paddingX: 1,
                        borderRadius: entries === 48 ? "4px" : "initial",
                      }}>
                      48
                    </Typography>
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                justifyContent={{ xs: "center", md: "right" }}>
                <MyPagination
                  count={totalPage}
                  onChange={handlePaginationChange}
                  page={page}
                  color="primary"
                  size={smallScreen ? "small" : "medium"}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default DaftarResepFavorit;
