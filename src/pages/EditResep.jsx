import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { GlobalStyles } from "@mui/system";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Box,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import http from "../services/axiosConfig";
import { useDropzone } from "react-dropzone";

function EditResep() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [timeCook, setTimeCook] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [howToCook, setHowToCook] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this line
  const [serverError, setServerError] = useState(false);

  const [errors, setErrors] = useState({
    recipeName: "",
    selectedCategory: "",
    selectedLevel: "",
    timeCook: "",
    ingredient: "",
    howToCook: "",
    imageFile: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Memastikan state awal bersih
    setRecipeName("");
    setSelectedCategory("");
    setSelectedLevel("");
    setTimeCook("");
    setIngredient("");
    setHowToCook("");
    setImageFile(null);
    setImagePreview(null);

    // Fetch kategori dan level terlebih dahulu
    Promise.all([
      http.get("/book-recipe-masters/category-option-lists"),
      http.get("/book-recipe-masters/level-option-lists"),
    ])
      .then(([categoriesResponse, levelsResponse]) => {
        // Set kategori dan level
        if (
          categoriesResponse.data &&
          Array.isArray(categoriesResponse.data.data)
        ) {
          setCategories(categoriesResponse.data.data);
        } else {
          console.error(
            "Expected an array for categories, but got:",
            categoriesResponse.data
          );
          setServerError(true);
        }

        if (levelsResponse.data && Array.isArray(levelsResponse.data.data)) {
          setLevels(levelsResponse.data.data);
        } else {
          console.error(
            "Expected an array for levels, but got:",
            levelsResponse.data
          );
          setServerError(true);
        }

        // Setelah kategori dan level di-set, fetch data resep
        http
          .get(`/book-recipe/book-recipes/${id}`)
          .then((response) => {
            const recipeData = response.data.data; // Mengakses data dari properti 'data' dalam respons
            setRecipeName(recipeData.recipeName);
            setSelectedCategory(recipeData.categories.categoryId.toString()); // Akses categoryId dari category
            setSelectedLevel(recipeData.levels.levelId.toString()); // Akses levelId dari levels
            setTimeCook(recipeData.timeCook); // Mengubah time menjadi string
            setIngredient(recipeData.ingredient); // Menggunakan 'ingredient', bukan 'ingredient'
            setHowToCook(recipeData.howToCook);

            if (recipeData.imageFilename) {
              setImagePreview(recipeData.imageFilename);
            }
          })
          .catch((error) => {
            console.error("Error fetching recipe data:", error);
            setServerError(true);
          });
      })
      .catch((error) => {
        console.error("Error fetching categories and levels:", error);
        setServerError(true);
      });
  }, [id]);

  const handleRecipeNameChange = (e) => {
    const value = e.target.value;
    setRecipeName(value);

    if (value.length > 255) {
      setErrors({
        ...errors,
        recipeName: "Panjang kolom tidak boleh melebihi 255 karakter",
      });
    } else if (!value) {
      setErrors({
        ...errors,
        recipeName: "Kolom Nama Resep Masakan tidak boleh kosong",
      });
    } else if (!/^[A-Za-z\s]*$/.test(value)) {
      setErrors({
        ...errors,
        recipeName: "Kolom Nama Resep tidak boleh berisi karakter khusus/angka",
      });
    } else {
      setErrors({
        ...errors,
        recipeName: "",
      });
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    // Use the actual invalid value here, for example "", null, or "0"
    setErrors({
      ...errors,
      selectedCategory:
        value === "" ? "Kategori Masakan tidak boleh kosong" : "",
    });
  };

  const handleTimeCookChange = (e) => {
    const value = e.target.value;
    const isValidNumber = /^\d+$/.test(value) && value >= 1 && value <= 999;

    setTimeCook(value);

    // Check if the field is empty
    if (!value) {
      setErrors({
        ...errors,
        timeCook: "Kolom Waktu Memasak tidak boleh kosong",
      });
    }
    // Check if the value contains valid numbers between 1 and 999
    else if (!isValidNumber) {
      setErrors({
        ...errors,
        timeCook: "Kolom waktu memasak Hanya boleh berisi angka 1-999",
      });
    }
    // Clear the error if the value is valid
    else {
      setErrors({
        ...errors,
        timeCook: "",
      });
    }
  };

  const handleLevelChange = (event) => {
    const value = event.target.value;
    setSelectedLevel(value);
    // Use the actual invalid value here, for example "", null, or "0"
    setErrors({
      ...errors,
      selectedLevel: value === "" ? "Kesulitan tidak boleh kosong" : "",
    });
  };

  const handleIngredientChange = (value) => {
    setIngredient(value);

    // Checking if the content is empty or just white spaces
    if (!value || value.replace(/<(.|\n)*?>/g, "").trim() === "") {
      setErrors({
        ...errors,
        ingredient: "Kolom Bahan - Bahan tidak boleh kosong",
      });
    } else {
      setErrors({
        ...errors,
        ingredient: "",
      });
    }
  };

  const handleHowToCookChange = (value) => {
    setHowToCook(value);

    // Checking if the content is empty or just white spaces
    if (!value || value.replace(/<(.|\n)*?>/g, "").trim() === "") {
      setErrors({
        ...errors,
        howToCook: "Kolom Cara Masak tidak boleh kosong",
      });
    } else if (value.length > 255) {
      setErrors({
        ...errors,
        howToCook: "Panjang kolom tidak boleh melebihi 255 karakter",
      });
    } else {
      setErrors({
        ...errors,
        howToCook: "",
      });
    }
  };

  // Validate all fields before submitting
  const validateFields = () => {
    let tempErrors = { ...errors };

    // Validation for recipeName
    const regexRecipeName = /^[A-Za-z\s]*$/; // Only allows letters and spaces
    if (recipeName.length > 255) {
      tempErrors.recipeName = "Panjang kolom tidak boleh melebihi 255 karakter";
    } else {
      tempErrors.recipeName = recipeName
        ? regexRecipeName.test(recipeName)
          ? ""
          : "Kolom Nama Resep Makanan tidak boleh berisi karakter khusus/angka"
        : "Kolom Nama Resep Masakan tidak boleh kosong";
    }

    // Validation for timeCook
    const isValidNumber =
      /^\d+$/.test(timeCook) && timeCook >= 1 && timeCook <= 999;
    tempErrors.timeCook = timeCook
      ? isValidNumber
        ? ""
        : "Hanya boleh berisi angka 1-999"
      : "Kolom Waktu Memasak tidak boleh kosong";

    // Validation for ingredient
    const isIngredientEmpty =
      !ingredient || ingredient.replace(/<(.|\n)*?>/g, "").trim() === "";
    tempErrors.ingredient = isIngredientEmpty
      ? "Kolom Bahan - Bahan tidak boleh kosong"
      : ingredient.length > 255
      ? "Panjang kolom tidak boleh melebihi 255 karakter"
      : "";

    // Validation for howToCook
    const isHowToCookEmpty =
      !howToCook || howToCook.replace(/<(.|\n)*?>/g, "").trim() === "";
    tempErrors.howToCook = isHowToCookEmpty
      ? "Kolom Cara Masak tidak boleh kosong"
      : howToCook.length > 255
      ? "Panjang kolom tidak boleh melebihi 255 karakter"
      : "";

    // Validations for other fields
    tempErrors.selectedCategory = selectedCategory
      ? ""
      : "Kategori Masakan tidak boleh kosong";
    tempErrors.selectedLevel = selectedLevel
      ? ""
      : "Kesulitan tidak boleh kosong";

    // Validation for imageFile
    if (imageFile) {
      if (
        imageFile.size > 1048576 ||
        !["image/jpeg", "image/png", "image/jpg"].includes(imageFile.type)
      ) {
        tempErrors.imageFile =
          "Format gambar tidak sesuai / Gambar melebihi batas maksimal ukuran (1MB)";
      } else {
        tempErrors.imageFile = "";
      }
    }
    // If no new image is uploaded and a preview exists, pass the validation
    else if (!imageFile && !imagePreview) {
      tempErrors.imageFile = "Gambar Makanan tidak boleh kosong";
    }

    setErrors(tempErrors);

    // Check if any errors exist
    return Object.keys(tempErrors).every((key) => !tempErrors[key]);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      // Check if file is not undefined, and validate size and type
      if (
        file &&
        file.size <= 1048576 &&
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
      ) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors({ ...errors, imageFile: "" });
      } else {
        setErrors({
          ...errors,
          imageFile:
            "Format gambar tidak sesuai / Gambar melebihi batas maksimal ukuran (1MB)",
        });
      }
    },
    [errors]
  );

  const onInput = (e) => {
    const file = e.target.files[0];

    // Check if file is not undefined, and validate size and type
    if (
      file &&
      file.size <= 1048576 &&
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    ) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, imageFile: "" });
    } else {
      setErrors({
        ...errors,
        imageFile:
          "Format gambar tidak sesuai / Gambar melebihi batas maksimal ukuran (1MB)",
      });
    }
  };

  const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: "image/jpeg, image/png, image/jpg", // specify valid MIME types here
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      console.error("Validation failed");
      return;
    }

    const formData = new FormData();
    const userId = localStorage.getItem("userId");
    console.log(categories);

    // Membuat objek JSON dengan data yang diinginkan oleh API
    const jsonData = {
      userId: userId,
      recipeId: parseInt(id), // Menggunakan parseInt untuk memastikan format angka
      categories: {
        categoryId: parseInt(selectedCategory),
        categoryName: categories.find(
          (c) => c.categoryId.toString() === selectedCategory
        )?.categoryName,
      },
      levels: {
        levelId: parseInt(selectedLevel),
        levelName: levels.find((l) => l.levelId.toString() === selectedLevel)
          ?.levelName,
      },
      recipeName: recipeName,
      timeCook: parseInt(timeCook), // Konversi ke integer
      ingredient: ingredient, // Pastikan ini mengacu pada state yang benar
      howToCook: howToCook,
    };
    console.log(jsonData);

    // Menambahkan objek JSON ke FormData
    formData.append(
      "request",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    // Jika imageFile telah diubah, tambahkan ke FormData
    if (imageFile) {
      formData.append("file", imageFile, imageFile.name);
    }

    setIsSubmitting(true);

    console.log("Form submitted:", formData);
    // Lakukan request PUT atau PATCH ke API
    http
      .put("/book-recipe/book-recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        setSubmitSuccess(true); // Tampilkan dialog sukses
        setSubmitMessage(`Berhasil Memperbarui Resep ${recipeName}`);
        setIsSubmitting(false);
        // navigate ke halaman lain jika diperlukan
      })
      .catch((error) => {
        console.error(error);
        setServerError(true);
        setIsSubmitting(false);
      });
  };

  const handleClose = () => {
    setSubmitSuccess(false);
    navigate("/resep-saya"); // Navigate after closing the dialog
  };

  const successDialogStyles = {
    "& .MuiDialog-paper": {
      backgroundColor: "white", // or any specific color you want to match from the image
      textAlign: "center",
      paddingLeft: "45px",
      paddingRight: "45px",
    },
    "& .MuiDialogContent-root": {
      paddingTop: "0px", // Adjust the spacing as per your design
      paddingBottom: "30px",
      color: "#00E696", // Adjust the text color to match your design
    },
    "& .MuiDialogTitle-root": {
      paddingTop: "0px",
      paddingBottom: "4px",
      color: "#00E696", // Adjust the title color to match your design
    },
    "& .MuiDialogActions-root": {
      alignItems: "center",
      justifyContent: "center",
      padding: "50px", // Adjust the spacing as per your design
      paddingTop: 0,
    },
    "& .MuiButton-containedPrimary": {
      backgroundColor: "#01BFBF", // Use a color picker to match the button color from the image
      "&:hover": {
        backgroundColor: "#0e8080", // Darken the color slightly on hover
      },
    },
    "& .MuiButton-root": {
      textTransform: "none", // In case you want to keep the button text as is
    },
    "& .MuiSvgIcon-root": {
      color: "#00E6aa", // Adjust the check icon color to match your design
    },
  };

  // Helper Text component for ReactQuill
  const QuillHelperText = ({ error }) => (
    <Typography
      variant="caption"
      component="p"
      sx={{
        color: "red",
        fontSize: "0.70rem",

        position: "absolute", // Use absolute positioning
        marginTop: "2px",
      }}>
      {error}
    </Typography>
  );

  const theme = useTheme();
  // This will return true if the screen width is less than 'sm'
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery("(max-width:950px)");
  const isTabletOrSmaller = useMediaQuery("(max-width:1100px)");
  const dynamicStyles = {
    headingFontSize: isTabletOrSmaller ? "0.77rem" : "1rem", // Example font size change
    // Add other dynamic styles as needed
  };

  const ServerErrorDialog = ({ open, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { backgroundColor: "red" } }}>
      <DialogTitle sx={{ color: "white" }}>Error</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "white" }}>
          Terjadi kesalahan server. Silahkan coba kembali.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ color: "white", borderColor: "white" }}
          variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderDropzoneContent = () => {
    if (imagePreview) {
      return (
        <img
          src={imagePreview}
          alt="Preview"
          style={{
            width: "100%", // Sets the width to cover the container
            height: "100%", // Sets the height to cover the container
            objectFit: "contain", // Ensures the image fits within the container, resized proportionally
            objectPosition: "center", // Centers the image within the container
          }}
        />
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <AddPhotoAlternateOutlinedIcon
            color="disabled"
            style={{ fontSize: 60 }}
          />
          <Typography
            sx={{
              color: "gray",
              textAlign: "center",

              marginTop: "5px",
            }}>
            <strong>Click to upload</strong> or drag and drop
            <br />
            PNG, JPG, JPEG (Max 1MB)
          </Typography>
        </div>
      );
    }
  };

  return (
    <>
      <GlobalStyles
        styles={{
          ".ingredients-editor .ql-editor": {
            minHeight: "187px", // minHeight for the ingredients editor
          },
          ".how-to-cook-editor .ql-editor": {
            minHeight: "312px", // minHeight for the how to cook editor
          },
          ".MuiFormHelperText-root.Mui-error": {
            background: "transparent", // This makes the background of the helper text transparent
            position: "absolute", // Positions the helper text absolutely within the TextField
            bottom: "-20px", // Adjust this value to position the helper text correctly
            marginLeft: 0,
            color: "red !important",

            fontSize: "0.70rem",
          },

          // Add more specific styles if necessary for the Quill error messages
          ".ingredients-editor .ql-editor + p": {
            color: "red",

            // other styles as necessary
          },
          ".how-to-cook-editor .ql-editor + p": {
            color: "red",

            // other styles as necessary
          },
          html: {
            overflowY: "scroll !important",
          },
        }}
      />
      <ServerErrorDialog
        open={serverError}
        onClose={() => setServerError(false)}
      />
      <Dialog
        open={submitSuccess}
        onClose={handleClose}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
        sx={successDialogStyles}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <CheckCircleOutlinedIcon
            sx={{ color: "green", fontSize: "6rem", my: 0, paddingTop: 7 }}
          />
          <DialogTitle id="success-dialog-title" sx={{ padding: 0 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "#00E696",
                // fontSize: "5rem",
              }}>
              Sukses
            </Typography>
          </DialogTitle>
          <DialogContentText
            id="success-dialog-description"
            sx={{ color: "black" }}>
            {submitMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            sx={{ mt: 0, fontSize: "1.2rem" }}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            marginTop={6}
            textAlign="center"
            sx={{
              fontWeight: "bold",
            }}>
            Edit Resep Masakan
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={isTab ? 2 : 17}
              justifyContent="center"
              paddingTop={3}
              paddingRight={5}
              paddingLeft={5}
              paddingBottom={7}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                {/* Recipe Name */}
                <Typography
                  sx={{
                    marginBottom: 1,
                    textAlign: "left",
                    color: "gray",
                  }}>
                  Nama Resep Masakan <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  placeholder="Nama Resep Masakan"
                  fullWidth
                  margin="normal"
                  value={recipeName}
                  onChange={handleRecipeNameChange}
                  error={!!errors.recipeName}
                  helperText={errors.recipeName}
                  sx={{
                    background: "white",
                    marginTop: 0,
                  }}
                />
                {/* Image Upload */}
                <Typography
                  sx={{
                    marginBottom: 1,
                    marginTop: 2,
                    textAlign: "left",
                    color: "gray",
                  }}>
                  Gambar Masakan{" "}
                  <span
                    style={{
                      color: "red",
                    }}>
                    *
                  </span>
                </Typography>

                <Box sx={{ position: "relative" }}>
                  <Box
                    {...getPhotoRootProps()}
                    sx={{
                      textAlign: "center",
                      p: 2,
                      my: 2,
                      marginTop: 0,
                      marginBottom: "4px",
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 150, // Adjust the height as needed
                      cursor: "pointer",

                      border: errors.imageFile
                        ? "2px dashed #dd2727"
                        : "2px dashed gray",
                    }}>
                    {renderDropzoneContent()}
                    <input
                      {...getPhotoInputProps()}
                      type="file"
                      accept="image/jpg, image/jpeg, image/png"
                      style={{ display: "none" }}
                      onChange={onInput}
                    />
                  </Box>
                  {errors.imageFile && (
                    <Typography
                      sx={{
                        textAlign: "left",
                        position: "absolute",
                        bottom: "-20px", // Adjust this value as needed
                        color: "red",

                        marginTop: 0,
                        fontSize: "0.70rem",
                      }}>
                      {errors.imageFile}
                    </Typography>
                  )}
                </Box>
                {/* Ingredients */}
                <Typography
                  sx={{
                    marginTop: 3,
                    marginBottom: 1,
                    textAlign: "left",
                    color: "gray",
                  }}>
                  Bahan - Bahan <span style={{ color: "red" }}>*</span>
                </Typography>
                <div className="ingredients-editor">
                  <Box
                    sx={{
                      border: errors.ingredient
                        ? "1px solid #dd2727"
                        : "0px solid rgba(0, 0, 0, 0.23)", // Assuming this is your default border
                      borderRadius: "2px", // Match the border radius with TextField
                      // ... other styles for the box
                    }}>
                    <ReactQuill
                      theme="snow"
                      placeholder="Write a description..."
                      value={ingredient}
                      onChange={handleIngredientChange}
                      style={{
                        background: "white",
                        marginBottom: "0px",
                      }} // Additional styling if needed
                    />
                    {errors.ingredient && (
                      <QuillHelperText error={errors.ingredient} />
                    )}
                  </Box>
                </div>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile ? 1 : 2,
                  }}>
                  {/* Category Selection */}
                  <Box>
                    <Typography
                      sx={{
                        marginBottom: 1,
                        textAlign: "left",
                        color: "gray",
                      }}>
                      Kategori Masakan <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <FormControl
                      fullWidth
                      error={!!errors.selectedCategory}
                      variant="outlined"
                      sx={{ background: "white" }}>
                      <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        sx={{ textAlign: "center" }}>
                        <MenuItem value="" disabled>
                          Pilih Kategori
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem
                            key={category.categoryId}
                            value={category.categoryId.toString()}
                            sx={{ textAlign: "center" }}>
                            {category.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.selectedCategory && (
                        <FormHelperText>
                          {errors.selectedCategory}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: isMobile ? 1 : 2,
                      flexDirection: isMobile ? "column" : "row",
                    }}>
                    {/* Time Cook */}
                    <Box sx={{ flex: 1, minWidth: "150px" }}>
                      <Typography
                        sx={{
                          marginBottom: 1,
                          marginTop: 1,
                          textAlign: "left",
                          color: "gray",
                          fontSize: dynamicStyles.headingFontSize,
                        }}>
                        Waktu Memasak (Menit){" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Waktu Memasak"
                        margin="dense"
                        sx={{
                          background: "white",
                          marginTop: 0,
                        }}
                        value={timeCook}
                        onChange={handleTimeCookChange}
                        error={!!errors.timeCook}
                        helperText={errors.timeCook}
                        type="number"
                      />
                    </Box>

                    {/* Level Selection */}
                    <Box sx={{ flex: 1, minWidth: "150px" }}>
                      <Typography
                        sx={{
                          marginBottom: 1,
                          marginTop: 1,
                          textAlign: "left",
                          color: "gray",
                          fontSize: dynamicStyles.headingFontSize,
                        }}>
                        Tingkat Kesulitan{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <FormControl
                        fullWidth
                        error={!!errors.selectedLevel}
                        variant="outlined"
                        sx={{ background: "white" }}>
                        <Select
                          value={selectedLevel}
                          onChange={handleLevelChange}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          sx={{ textAlign: "center" }}>
                          <MenuItem value="" disabled>
                            Pilih Tingkat Kesulitan
                          </MenuItem>
                          {levels.map((level) => (
                            <MenuItem
                              key={level.levelId}
                              value={level.levelId.toString()}
                              sx={{ textAlign: "center" }}>
                              {level.levelName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.selectedLevel && (
                          <FormHelperText>
                            {errors.selectedLevel}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </Box>

                  {/* How to Cook */}
                  <Box>
                    <Typography
                      sx={{
                        marginTop: 1,
                        marginBottom: 1,
                        textAlign: "left",
                        color: "gray",
                      }}>
                      Cara Masak <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <div className="how-to-cook-editor">
                      <Box
                        sx={{
                          border: errors.howToCook
                            ? "1px solid #dd2727"
                            : "0px solid rgba(0, 0, 0, 0.23)", // Assuming this is your default border
                          borderRadius: "2px", // Match the border radius with TextField
                          // ... other styles for the box
                        }}>
                        <ReactQuill
                          theme="snow"
                          placeholder="Write a description..."
                          value={howToCook}
                          onChange={handleHowToCookChange}
                          style={{
                            background: "white",
                            marginBottom: "0px",
                          }} // Additional styling if needed
                        />
                        {errors.howToCook && (
                          <QuillHelperText error={errors.howToCook} />
                        )}
                      </Box>
                    </div>
                  </Box>
                  {/* Action Buttons */}
                  <Grid
                    item
                    xs={12}
                    container
                    justifyContent="flex-end"
                    spacing={isMobile ? 1 : 6}
                    paddingTop={isMobile ? 2 : 1}>
                    {/* Batal Button */}
                    <Grid item>
                      <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        sx={{
                          minWidth: "135px",
                          textTransform: "none",
                          backgroundColor: "white", // Replace with actual color code from the image
                          color: "#01BFBF",
                          borderColor: "#01BFBF",
                          "&:hover": {
                            borderColor: "#077d7d", // Replace with a slightly darker color code
                            backgroundColor: "white",
                          },
                        }}
                        onClick={() => navigate("/resep-saya")} // Assuming you want to navigate back on cancel
                      >
                        Batal
                      </Button>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        primary={isSubmitting}
                        sx={{
                          minWidth: "135px",
                          textTransform: "none",
                          backgroundColor: "#01BFBF", // Replace #colorCode with the actual color code from the image
                          "&:hover": {
                            backgroundColor: "#077d7d", // Replace with a slightly darker color code
                          },
                        }}>
                        {isSubmitting ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Container>
      </div>
    </>
  );
}

EditResep.propTypes = {
  // other propTypes definitions,
  error: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default EditResep;
