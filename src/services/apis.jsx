import instance from "./axiosConfig";

const baseUrl = import.meta.env.VITE_API_URL;
const apiGetDaftarResepMakanan = import.meta.env.VITE_API_GETDAFTARRESEPMAKANAN;
const apiGetMyRecipes = import.meta.env.VITE_API_GETMYRECIPES;
const apiGetMyFavoriteRecipes = import.meta.env.VITE_API_GETMYFAVORITERECIPES;
const apiLogin = import.meta.env.VITE_API_SIGNIN;
const apiRegister = import.meta.env.VITE_API_REGISTER;

const buildUrl = (base, params) => {
  let url = base + "?";
  for (const key in params) {
    if (params[key]) {
      url += `${key}=${params[key]}&`;
    }
  }
  // Remove the trailing '&'
  url = url.slice(0, -1);
  return url;
};

//Register
export const userRegister = async (formData) => {
  try {
    const response = await instance
      .post(apiRegister, formData);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Login
export const userLogin = async (username, password) => {
  try {
    const response = await instance
      .post(apiLogin, { username: username, password: password });
    
    return response;
    
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Get Master Category
export const getCategory = async () => {
  try {
    const response = await instance
      .get("/book-recipe-masters/category-option-lists");
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Get Master Level
export const getLevels = async () => {
  try {
    const response = await instance
      .get("/book-recipe-masters/level-option-lists");
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Post Tambah Resep
export const postTambahResep = async (formData) => {
  try {
    const response = await instance
      .post("/book-recipe/book-recipes", formData);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Get Daftar Resep
export const getDaftarResepMakanan = async (
  userId,
  pageNumber,
  pageSize,
  recipeName,
  levelId,
  categoryId,
  time,
  sortBy
) => {
  const apiUrl = buildUrl(apiGetDaftarResepMakanan, {
    pageNumber,
    pageSize,
    userId,
    recipeName,
    levelId,
    categoryId,
    time,
    sortBy,
  });

  try {
    const response = await instance
      .get(apiUrl);
    return response;
  } catch (error) {
    console.log("error getting data daftar resep makanan", error);
    throw error;
  }
};

//Get Resep Saya
export const getMyRecipes = async (
  userId,
  pageNumber,
  pageSize,
  recipeName,
  levelId,
  categoryId,
  time,
  sortBy
) => {
  const apiUrl = buildUrl(apiGetMyRecipes, {
    pageNumber,
    pageSize,
    userId,
    recipeName,
    levelId,
    categoryId,
    time,
    sortBy,
  });

  try {
    const response = await instance
      .get(apiUrl);
    return response;
  } catch (error) {
    console.log("error getting data daftar resep makanan", error);
    throw error;
  }
};

//Get Daftar Resep Favorit
export const getDaftarResepFavorit = async (
  userId,
  pageNumber,
  pageSize,
  recipeName,
  levelId,
  categoryId,
  time,
  sortBy
) => {
  const apiUrl = buildUrl(apiGetMyFavoriteRecipes, {
    pageNumber,
    pageSize,
    userId,
    recipeName,
    levelId,
    categoryId,
    time,
    sortBy,
  });

  try {
    const response = await instance
      .get(apiUrl);
    return response;
  } catch (error) {
    console.log("error getting data daftar resep makanan", error);
    throw error;
  }
};

//Add/Remove to favorite
export const putFavoriteResepMasakan = async (recipeId, userId) => {
  const apiUrl = `${baseUrl}/book-recipe/book-recipes/${recipeId}/favorites`;

  try {
    const response = await instance
      .put(apiUrl, { userId: userId });
    return response;
  } catch (error) {
    console.log("error edit favorite resep masakan", error);
    throw error;
  }
};

//Delete My Recipe
export const deleteRecipe = async (recipeId, userId) => {
  try {
    const response = await instance.put(
      `${apiGetDaftarResepMakanan}/${recipeId}?userId=${userId}`
    );

    return {
      success: response.status === 200,
      errorMessage: response.status === 200 ? null : "Failed to delete recipe",
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: `Error deleting recipe: ${error.message}`,
    };
  }
};

//Get Detail Resep
export const getDetailResep = async (recipeId) => {
  try {
    const response = await instance
      .get(`${apiGetDaftarResepMakanan}/${recipeId}`);
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
