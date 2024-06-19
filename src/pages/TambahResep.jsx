import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalStyles } from "@mui/system";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getCategory, getLevels, postTambahResep } from "../services/apis";

function TambahResep() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("2");
  const [selectedLevel, setSelectedLevel] = useState("4");
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
    async function fetchCategoryData() {
      try {
        const response = await getCategory();
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching category data", error);
        setServerError(true);
      }
    }

    async function fetchLevelsData() {
      try {
        const response = await getLevels();
        if (response.data && Array.isArray(response.data.data)) {
          setLevels(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching level data", error);
        setServerError(true);
      }
    }

    fetchCategoryData();
    fetchLevelsData();
  }, []);

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
        recipeName: "Kolom tidak boleh berisi special character/angka",
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
    setErrors({
      ...errors,
      selectedCategory:
        value === "" ? "Kolom Kategori Masakan tidak boleh kosong" : "",
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
        timeCook: "Kolom Hanya boleh berisi angka 1-999",
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
      selectedLevel:
        value === "" ? "Kolom Tingkat Kesulitan tidak boleh kosong" : "",
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
    } else if (value.length > 255) {
      setErrors({
        ...errors,
        ingredient: "Panjang kolom tidak boleh melebihi 255 karakter",
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
          : "Kolom tidak boleh berisi special character/angka"
        : "Kolom Nama Resep Masakan tidak boleh kosong";
    }

    // Validation for timeCook
    const isValidNumber =
      /^\d+$/.test(timeCook) && timeCook >= 1 && timeCook <= 999;
    tempErrors.timeCook = timeCook
      ? isValidNumber
        ? ""
        : "Kolom Hanya boleh berisi angka 1-999"
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
      : "Kolom Kategori Masakan tidak boleh kosong";
    tempErrors.selectedLevel = selectedLevel
      ? ""
      : "Kolom Tingkat Kesulitan tidak boleh kosong";
    tempErrors.imageFile = imageFile
      ? ""
      : "Kolom Gambar Makanan tidak boleh kosong";

    // Validation for imageFile
    if (!imageFile) {
      tempErrors.imageFile = "Kolom Gambar Makanan tidak boleh kosong";
    } else if (
      imageFile.size > 1048576 ||
      !["image/jpeg", "image/png", "image/jpg"].includes(imageFile.type)
    ) {
      tempErrors.imageFile =
        "Format gambar tidak sesuai / Gambar melebihi batas maksimal ukuran (1MB)";
    } else {
      tempErrors.imageFile = "";
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/jpg", // specify valid MIME types here
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
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

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      console.error("Validation failed");
      return; // Stop the form submission if validation fails
    }

    const category = categories.find(
      (c) => c.categoryId.toString() === selectedCategory
    );
    const level = levels.find((l) => l.levelId.toString() === selectedLevel);

    const userId = localStorage.getItem("userId");
    const jsonPart = JSON.stringify({
      userId: userId,
      recipeName: recipeName,
      categories: {
        categoryId: selectedCategory,
        categoryName: category ? category.categoryName : "", // Handle the case when category is not found
      },
      levels: {
        levelId: selectedLevel,
        levelName: level ? level.levelName : "", // Handle the case when level is not found
      },
      timeCook: timeCook,
      ingredient: ingredient,
      howToCook: howToCook,
    });

    setIsSubmitting(true);

    // Construct the FormData
    const formData = new FormData();
    formData.append("file", imageFile); // Append the file
    formData.append(
      "request",
      new Blob([jsonPart], {
        type: "application/json", // Set the type of the blob to application/json
      })
    );

    // Perform the HTTP POST request
    async function saveResep() {
      try {
        const response = await postTambahResep(formData);
        console.log(response);
        setSubmitSuccess(true);
        setSubmitMessage(`Resep ${recipeName} berhasil ditambahkan`);
        setIsSubmitting(false);
      } catch (error) {
        console.error(error);
        setServerError(true);
        setIsSubmitting(false);
      }
    }
    saveResep();
  };

  const handleClose = () => {
    setSubmitSuccess(false);
    navigate("/daftar-resep"); // Navigate after closing the dialog
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
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: "100%", // Sets the width to cover the container
              maxHeight: "100%", // Sets the height to cover the container
              objectFit: "contain", // Ensures the image fits within the container, resized proportionally
              objectPosition: "center", // Centers the image within the container
            }}
          />
          <IconButton
            style={{ position: "absolute", top: 5, right: 5 }}
            onClick={handleDeleteImage}
            color="error"
            aria-label="delete image">
            <DeleteIcon />
          </IconButton>
        </div>
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
            textAlign="center"
            marginTop={6}
            sx={{
              fontWeight: "bold",
            }}>
            Buat Resep Masakan Baru
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
                  FormHelperTextProps={{
                    sx: {
                      margin: 0,
                      padding: 0,
                      position: "absolute", // ensure the helper text doesn't affect the height of the TextField
                      bottom: "-20px", // position it correctly below the TextField
                    },
                  }}
                />

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
                <input
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                <Box sx={{ position: "relative" }}>
                  <label htmlFor="image-upload">
                    <Box
                      {...getRootProps()}
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
                      <input {...getInputProps()} />
                      {renderDropzoneContent()}
                    </Box>
                  </label>
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
                        FormHelperTextProps={{
                          sx: {
                            margin: 0,
                            padding: 0,
                            position: "absolute", // ensure the helper text doesn't affect the height of the TextField
                            bottom: "-20px", // position it correctly below the TextField
                          },
                        }}
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
                          <FormHelperText
                            sx={{
                              margin: 0,
                              padding: 0,
                              position: "absolute", // ensure the helper text doesn't affect the height of the TextField
                              bottom: "-20px", // position it correctly below the TextField
                            }}>
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
                        onClick={() => navigate("/daftar-resep")} // Assuming you want to navigate back on cancel
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

TambahResep.propTypes = {
  // other propTypes definitions,
  error: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default TambahResep;
