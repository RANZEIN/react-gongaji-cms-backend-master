import api from '@/utils/api';
import { BASE_URL_ARTICLE } from '@/utils/constants';

const withVersion = (version = 'V3', extra = {}) => ({
  headers: {
    Version: version,
    ...extra
  }
});

const extractErrorMessage = (error) => {
  if (error && error.isAxiosError) {
    return error.response?.data?.message || error.message || 'Terjadi kesalahan dari server';
  }
  return error?.message || 'Terjadi kesalahan pada server.';
};

const asArray = (payload) => (Array.isArray(payload) ? payload : []);

const normalizeArticle = (item = {}) => {
  const image = item.article_image || item.article_thumbnail || item.article_cover || '';
  const categoryRelations = asArray(item.article_category || item.article_categories || item.categorys || item.categories)
    .map((entry) => entry?.category || entry)
    .filter(Boolean);
  const tagRelations = asArray(item.article_tag || item.article_tags || item.tags)
    .map((entry) => entry?.tag || entry)
    .filter(Boolean);
  const categoryFromRelation = categoryRelations
    .map((entry) => entry?.category_name)
    .filter(Boolean)
    .join(', ');

  return {
    article_uuid: item.article_uuid || item.uuid || '',
    article_slug: item.article_slug || '',
    article_title: item.article_title || '-',
    article_description: item.article_description || '',
    article_content: item.article_summary || item.article_content || '',
    article_author: item.article_author || '-',
    article_source: item.article_source || '',
    article_source_url: item.article_source_url || '',
    article_category: item.article_category || categoryFromRelation || '-',
    article_status: item.article_status || 'DRAFT',
    article_image: image,
    article_date: item.article_published_date || item.article_created_date || '',
    article_total_view: Number(item.article_total_view || 0),
    article_total_like: Number(item.article_total_like || 0),
    article_total_comment: Number(item.article_total_comment || 0),
    article_total_share: Number(item.article_total_share || 0),
    category_uuid: categoryRelations.map((entry) => entry?.category_uuid).filter(Boolean),
    tag_uuid: tagRelations.map((entry) => entry?.tag_uuid).filter(Boolean),
    raw: item
  };
};

const buildArticleFormData = (payload = {}, { includeDraft = false } = {}) => {
  const formData = new FormData();
  const appendIfFilled = (key, value) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== '') {
      formData.append(key, `${value}`.trim());
    }
  };

  appendIfFilled('article_title', payload.article_title);
  appendIfFilled('article_description', payload.article_description);
  appendIfFilled('article_summary', payload.article_content);
  appendIfFilled('article_published_date', payload.article_date);
  appendIfFilled('article_author', payload.article_author);
  appendIfFilled('article_source', payload.article_source);
  appendIfFilled('article_source_url', payload.article_source_url);
  appendIfFilled('tag_name', payload.tag_name);

  if (payload.category_uuid) {
    const list = Array.isArray(payload.category_uuid) ? payload.category_uuid : [payload.category_uuid];
    list.filter(Boolean).forEach((entry) => formData.append('category_uuid', entry));
  }

  if (payload.tag_uuid) {
    const list = Array.isArray(payload.tag_uuid) ? payload.tag_uuid : [payload.tag_uuid];
    list.filter(Boolean).forEach((entry) => formData.append('tag_uuid', entry));
  }

  if (payload.article_image instanceof File) {
    formData.append('article_image', payload.article_image, payload.article_image.name);
  }

  if (includeDraft) {
    const status = `${payload.article_status || ''}`.toUpperCase();
    formData.append('draft', status === 'PUBLISHED' ? 'FALSE' : 'TRUE');
  }

  return formData;
};

export const getArticles = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL_ARTICLE}/v1/article/get`, {
      ...withVersion('V3'),
      params: {
        overview: 'TRUE',
        preload_category: 'TRUE',
        preload_article_category: 'TRUE',
        preload_article_category_to_category: 'TRUE',
        preload_article_tag: 'TRUE',
        preload_article_tag_to_tag: 'TRUE',
        ...params
      }
    });
    return asArray(response.data?.data).map(normalizeArticle);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getArticleCategories = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL_ARTICLE}/v1/category/get`, {
      ...withVersion('V3'),
      params
    });
    return asArray(response.data?.data);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const createArticleCategory = async (payload) => {
  try {
    const formData = new FormData();
    formData.append('category_name', `${payload?.category_name || ''}`.trim());
    if (payload?.category_description) {
      formData.append('category_description', `${payload.category_description}`.trim());
    }
    const response = await api.post(`${BASE_URL_ARTICLE}/v1/category/create`, formData, withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal membuat category');
    }
    return response.data?.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateArticleCategory = async (categoryUuid, payload) => {
  try {
    const formData = new FormData();
    formData.append('category_name', `${payload?.category_name || ''}`.trim());
    if (payload?.category_description) {
      formData.append('category_description', `${payload.category_description}`.trim());
    }
    const response = await api.patch(`${BASE_URL_ARTICLE}/v1/category/update/${categoryUuid}`, formData, withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal update category');
    }
    return response.data?.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const toggleArticleCategoryActive = async (categoryUuid) => {
  try {
    const response = await api.patch(`${BASE_URL_ARTICLE}/v1/category/update/active/${categoryUuid}`, new FormData(), withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal ubah status category');
    }
    return response.data?.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteArticleCategory = async (categoryUuid) => {
  try {
    const response = await api.delete(`${BASE_URL_ARTICLE}/v1/category/delete/primary/${categoryUuid}`, withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal hapus category');
    }
    return true;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getArticleTags = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL_ARTICLE}/v1/tag/get`, {
      ...withVersion('V3'),
      params
    });
    return asArray(response.data?.data);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const createArticleTag = async (payload) => {
  try {
    const formData = new FormData();
    formData.append('tag_name', `${payload?.tag_name || ''}`.trim());
    if (payload?.tag_description) {
      formData.append('tag_description', `${payload.tag_description}`.trim());
    }
    const response = await api.post(`${BASE_URL_ARTICLE}/v1/tag/create`, formData, withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal membuat tag');
    }
    return response.data?.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateArticleTag = async (tagUuid, payload) => {
  try {
    const formData = new FormData();
    formData.append('tag_name', `${payload?.tag_name || ''}`.trim());
    if (payload?.tag_description) {
      formData.append('tag_description', `${payload.tag_description}`.trim());
    }
    const response = await api.patch(`${BASE_URL_ARTICLE}/v1/tag/update/${tagUuid}`, formData, withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal update tag');
    }
    return response.data?.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const toggleArticleTagActive = async (tagUuid) => {
  try {
    const response = await api.patch(`${BASE_URL_ARTICLE}/v1/tag/update/active/${tagUuid}`, new FormData(), withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal ubah status tag');
    }
    return response.data?.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteArticleTag = async (tagUuid) => {
  try {
    const response = await api.delete(`${BASE_URL_ARTICLE}/v1/tag/delete/primary/${tagUuid}`, withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal hapus tag');
    }
    return true;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getArticleById = async (articleUuid) => {
  try {
    const response = await api.get(`${BASE_URL_ARTICLE}/v1/article/get`, {
      ...withVersion('V3'),
      params: {
        article_uuid: articleUuid,
        type_search: 'FIRST',
        preload_category: 'TRUE',
        preload_article_category: 'TRUE',
        preload_article_category_to_category: 'TRUE',
        preload_article_tag: 'TRUE',
        preload_article_tag_to_tag: 'TRUE'
      }
    });
    const article = normalizeArticle(asArray(response.data?.data)[0]);
    if (!article.article_uuid) {
      throw new Error('Artikel tidak ditemukan.');
    }
    return article;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getArticleBySlug = async (slug) => {
  try {
    const response = await api.get(`${BASE_URL_ARTICLE}/v1/article/get`, {
      ...withVersion('V3'),
      params: {
        article_slug: slug,
        type_search: 'FIRST',
        preload_category: 'TRUE',
        preload_article_category: 'TRUE',
        preload_article_category_to_category: 'TRUE',
        preload_article_tag: 'TRUE',
        preload_article_tag_to_tag: 'TRUE'
      }
    });
    const bySlug = normalizeArticle(asArray(response.data?.data)[0]);
    if (bySlug.article_uuid) {
      return bySlug;
    }
  } catch (error) {
    // Continue to fallback strategy.
  }

  const listByKeyword = await getArticles({
    keyword: slug,
    overview: 'FALSE',
    type_search: 'FIND',
    preload_status: 'TRUE'
  });
  const exact = listByKeyword.find((entry) => entry.article_slug === slug);
  if (exact) {
    return exact;
  }

  const fallbackList = await getArticles({ overview: 'FALSE', limit: 200, preload_status: 'TRUE' });
  const fallback = fallbackList.find((entry) => entry.article_slug === slug);
  if (!fallback) {
    throw new Error('Artikel tidak ditemukan.');
  }
  return fallback;
};

// Load article for "view" page (detail) and increment view counter.
export const getArticleForView = async (slug) => {
  const article = await getArticleBySlug(slug);
  if (article?.article_uuid) {
    try {
      await setArticleView(article.article_uuid);
    } catch {
      // View increment should not block rendering.
    }
  }
  return article;
};

export const createArticle = async (payload) => {
  try {
    const formData = buildArticleFormData(payload, { includeDraft: true });
    const response = await api.post(`${BASE_URL_ARTICLE}/v1/article/create`, formData, withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal membuat artikel');
    }
    const createdUuid = response.data?.data?.article_uuid;
    if (createdUuid) {
      await syncArticleStatus(createdUuid, payload?.article_status);
    }
    return response.data?.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateArticle = async (articleUuid, payload) => {
  try {
    const formData = buildArticleFormData(payload, { includeDraft: false });
    const response = await api.patch(`${BASE_URL_ARTICLE}/v1/article/update/${articleUuid}`, formData, withVersion('V3'));
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal update artikel');
    }
    await syncArticleStatus(articleUuid, payload?.article_status);
    return response.data?.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteArticle = async (articleUuid, articleSlug) => {
  try {
    const response = await api.post(
      `${BASE_URL_ARTICLE}/v1/article/archived/${articleUuid}`,
      new FormData(),
      withVersion('V2')
    );
    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Gagal mengarsipkan artikel');
    }
    return true;
  } catch (error) {
    const message = extractErrorMessage(error).toLowerCase();
    if (articleSlug && message.includes('tidak ditemukan')) {
      const article = await getArticleBySlug(articleSlug);
      if (article?.article_uuid) {
        const retryResponse = await api.post(
          `${BASE_URL_ARTICLE}/v1/article/archived/${article.article_uuid}`,
          new FormData(),
          withVersion('V2')
        );
        if (retryResponse.data?.status) {
          return true;
        }
      }
    }
    throw new Error(extractErrorMessage(error));
  }
};

export const getComments = async (params = {}) => {
  const response = await api.get(`${BASE_URL_ARTICLE}/v1/comment/get`, { ...withVersion('V2'), params });
  return asArray(response.data?.data);
};

export const createComment = async (payload) => {
  const formData = new FormData();
  formData.append('comment_article', payload.comment_article);
  formData.append('comment_description', payload.comment_description);
  if (payload.comment_anonim) formData.append('comment_anonim', payload.comment_anonim);
  const response = await api.post(`${BASE_URL_ARTICLE}/v1/comment/create`, formData, withVersion('V3'));
  return response.data;
};

export const replyComment = async (payload) => {
  const formData = new FormData();
  formData.append('comment_parent', payload.comment_parent);
  formData.append('comment_article', payload.comment_article);
  formData.append('comment_description', payload.comment_description);
  const response = await api.post(`${BASE_URL_ARTICLE}/v1/comment/reply`, formData, withVersion('V3'));
  return response.data;
};

const postAction = async (url) => {
  const response = await api.post(url, new FormData(), withVersion('V2'));
  return response.data;
};

const syncArticleStatus = async (articleUuid, status) => {
  const normalized = `${status || ''}`.toUpperCase();
  if (normalized === 'PUBLISHED') {
    await postAction(`${BASE_URL_ARTICLE}/v1/article/published/${articleUuid}`);
    return;
  }
  if (normalized === 'REVIEW') {
    await postAction(`${BASE_URL_ARTICLE}/v1/article/review/${articleUuid}`);
  }
};

export const setArticleBookmark = async (articleUuid) => postAction(`${BASE_URL_ARTICLE}/v1/article/bookmark/${articleUuid}`);
export const setArticleLike = async (articleUuid) => postAction(`${BASE_URL_ARTICLE}/v1/article/like/${articleUuid}`);
export const setArticleShare = async (articleUuid) => postAction(`${BASE_URL_ARTICLE}/v1/article/share/${articleUuid}`);
export const setArticleView = async (articleUuid) => postAction(`${BASE_URL_ARTICLE}/v1/article/view/${articleUuid}`);
