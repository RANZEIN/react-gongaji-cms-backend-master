import axios from "axios";

const API_BASE_URL =
  "https://gongaji-article-service-m3gra3glsq-et.a.run.app";

// 🔐 Hardcoded token (development only)
const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkIjoxNzg3Mjg4MzgxLCJ1c2VyX3V1aWQiOiJmODY5YTcyNy0xMzIzLTQ5ZTAtOWIwYi0yMGQwZjdlMzg0NWUifQ.VpnKk2bymxiLcnLscjsloEObx2OF8CBv687_a6NvdOM";

// Instance untuk JSON requests
const articleApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    Version: "3",
  },
});

// Instance untuk multipart/form-data requests (TANPA Content-Type default)
const articleApiMultipart = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    Version: "3",
    // ❌ Tidak ada Content-Type — biar browser set otomatis dengan boundary
  },
});

// ==========================
// ERROR HANDLER
// ==========================
const extractErrorMessage = (error) => {
  if (error && error.isAxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan dari server"
    );
  }
  return error?.message || "Terjadi kesalahan pada server.";
};

// ==========================
// GET ARTICLES
// ==========================
export const getArticles = async () => {
  try {
    const response = await articleApi.get("/v1/article/get", {
      params: { overview: "TRUE" },
    });
    return response.data?.data || [];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ==========================
// GET ARTICLE BY ID
// ==========================
export const getArticleById = async (articleUuid) => {
  try {
    const response = await articleApi.get("/v1/article/get", {
      params: { article_uuid: articleUuid },
    });

    const article = response.data?.data?.[0];
    if (!article) {
      throw new Error("Artikel tidak ditemukan.");
    }
    return article;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ==========================
// CREATE ARTICLE
// ==========================
export const createArticle = async (payload) => {
  try {
    const formData = new FormData();

    if (payload.article_title?.trim())
      formData.append("Article_Title", payload.article_title.trim());

    if (payload.article_description?.trim())
      formData.append("Article_Description", payload.article_description.trim());

    if (payload.article_author?.trim())
      formData.append("Article_Author", payload.article_author.trim());

    if (payload.article_category)
      formData.append("Article_Category", payload.article_category);

    if (payload.article_status)
      formData.append("Article_Status", payload.article_status);

    if (payload.article_image instanceof File) {
      formData.append("Article_Image", payload.article_image, payload.article_image.name);
    }

    // ✅ Pakai articleApiMultipart agar Content-Type tidak di-override
    const res = await articleApiMultipart.post("/v1/article/create", formData);

    console.log("RESPONSE:", res.data);

    if (!res.data?.status) {
      throw new Error(res.data?.message || "Gagal membuat artikel");
    }

    return res.data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ==========================
// UPDATE ARTICLE
// ==========================
export const updateArticle = async (articleUuid, payload) => {
  try {
    const formData = new FormData();

    formData.append("article_uuid", articleUuid);

    if (payload.article_title)
      formData.append("article_title", payload.article_title);

    if (payload.article_author)
      formData.append("article_author", payload.article_author);

    if (payload.article_category)
      formData.append("article_category", payload.article_category);

    if (payload.article_status)
      formData.append("article_status", payload.article_status);

    if (payload.article_image instanceof File) {
      formData.append("article_image", payload.article_image);
    }

    // ✅ Pakai articleApiMultipart juga
    const res = await articleApiMultipart.put("/v1/article/update", formData);

    if (!res.data?.status) {
      throw new Error(res.data?.message || "Gagal update artikel");
    }

    return res.data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ==========================
// DELETE ARTICLE
// ==========================
export const deleteArticle = async (articleUuid) => {
  try {
    const res = await articleApi.delete("/v1/article/delete", {
      data: { article_uuid: articleUuid },
    });

    if (!res.data?.status) {
      throw new Error(res.data?.message || "Gagal menghapus artikel");
    }

    return true;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

// ==========================
// GET ARTICLE BY SLUG
// ==========================
export const getArticleBySlug = async (slug) => {
  try {
    const response = await articleApi.get("/v1/article/get", {
      params: { slug },
    });

    const article = response.data?.data?.[0];
    if (!article) {
      throw new Error("Artikel tidak ditemukan.");
    }
    return article;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
