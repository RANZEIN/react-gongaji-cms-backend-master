import api from '@/utils/api';
import { BASE_URL_STORE } from '@/utils/constants';

const withStoreVersion = (version) => ({
    headers: {
        Version: version
    }
});

const extractErrorMessage = (error) => {
    if (error && error.isAxiosError) {
        return error.response?.data?.message || error.message || 'Terjadi kesalahan dari server';
    }
    return error?.message || 'Terjadi kesalahan pada server.';
};

const asArray = (payload) => (Array.isArray(payload) ? payload : []);

const appendIfFilled = (formData, key, value) => {
    if (value === undefined || value === null) return;
    const normalized = `${value}`.trim();
    if (!normalized) return;
    formData.append(key, normalized);
};

const buildAddressFormData = (payload = {}) => {
    const formData = new FormData();

    // Field names mengikuti Postman `STORE/address`.
    appendIfFilled(formData, 'address_receiver_name', payload.address_receiver_name);
    appendIfFilled(formData, 'address_receiver_telp', payload.address_receiver_telp);
    appendIfFilled(formData, 'address_label', payload.address_label);

    appendIfFilled(formData, 'address_province_id', payload.address_province_id);
    appendIfFilled(formData, 'address_city_id', payload.address_city_id);
    appendIfFilled(formData, 'address_district_id', payload.address_district_id);
    appendIfFilled(formData, 'address_subdistrict_id', payload.address_subdistrict_id);

    appendIfFilled(formData, 'address_subdistrict', payload.address_subdistrict);
    appendIfFilled(formData, 'address_postal_code', payload.address_postal_code);
    appendIfFilled(formData, 'address_detail', payload.address_detail);

    appendIfFilled(formData, 'address_benchmark', payload.address_benchmark);
    appendIfFilled(formData, 'address_latitude', payload.address_latitude);
    appendIfFilled(formData, 'address_longitude', payload.address_longitude);

    if (payload.address_main !== undefined && payload.address_main !== null) {
        // Backend expects "true/false" text.
        formData.append('address_main', `${payload.address_main}`);
    }

    return formData;
};

export const getAddresses = async (params = {}) => {
    try {
        const response = await api.get(`${BASE_URL_STORE}/v1/address/get`, {
            ...withStoreVersion('3'),
            params
        });
        return asArray(response.data?.data);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const createAddress = async (payload) => {
    try {
        const formData = buildAddressFormData(payload);
        const response = await api.post(`${BASE_URL_STORE}/v1/address/create`, formData, withStoreVersion('V3'));
        if (!response.data?.status) {
            throw new Error(response.data?.message || 'Gagal membuat address');
        }
        return response.data?.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const setMainAddress = async (addressUuid) => {
    try {
        if (!addressUuid) throw new Error('addressUuid wajib diisi');
        const response = await api.post(
            `${BASE_URL_STORE}/v1/address/set-main/${addressUuid}`,
            new FormData(),
            withStoreVersion('V3')
        );
        if (!response.data?.status) {
            throw new Error(response.data?.message || 'Gagal mengubah main address');
        }
        return response.data?.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const updateAddress = async (addressUuid, payload) => {
    try {
        if (!addressUuid) throw new Error('addressUuid wajib diisi');
        const formData = buildAddressFormData(payload);
        const response = await api.post(
            `${BASE_URL_STORE}/v1/address/update/${addressUuid}`,
            formData,
            withStoreVersion('V3')
        );
        if (!response.data?.status) {
            throw new Error(response.data?.message || 'Gagal update address');
        }
        return response.data?.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const deleteAddress = async (addressUuid) => {
    try {
        if (!addressUuid) throw new Error('addressUuid wajib diisi');
        const response = await api.delete(`${BASE_URL_STORE}/v1/address/delete/${addressUuid}`, withStoreVersion('V3'));
        if (!response.data?.status) {
            throw new Error(response.data?.message || 'Gagal hapus address');
        }
        return true;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Wishlist (Store) - endpoints yang ada di Postman `WISHLIST` section.

export const getWishlists = async (params = {}) => {
    try {
        const response = await api.get(`${BASE_URL_STORE}/v1/wishlist/get`, {
            ...withStoreVersion('V3'),
            params
        });
        return asArray(response.data?.data);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const setWishlist = async (payload) => {
    try {
        const wishlistProduct = `${payload?.wishlist_product ?? ''}`.trim();
        if (!wishlistProduct) {
            throw new Error('wishlist_product wajib diisi');
        }

        const formData = new FormData();
        formData.append('wishlist_product', wishlistProduct);

        const response = await api.post(`${BASE_URL_STORE}/v1/wishlist/set`, formData, withStoreVersion('V3'));
        if (!response.data?.status) {
            throw new Error(response.data?.message || 'Gagal menyimpan wishlist');
        }
        return response.data?.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const deleteWishlistByProduct = async (productUuid) => {
    try {
        const product = `${productUuid ?? ''}`.trim();
        if (!product) {
            throw new Error('productUuid wajib diisi');
        }

        const response = await api.delete(`${BASE_URL_STORE}/v1/wishlist/delete-by-product/${product}`, withStoreVersion('V3'));
        if (!response.data?.status) {
            throw new Error(response.data?.message || 'Gagal menghapus wishlist');
        }
        return true;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Read-only wrappers (GET) for other STORE resources in Postman.

export const getAttributes = async (params = {}) => {
    try {
        const response = await api.get(`${BASE_URL_STORE}/v1/attribute/get`, {
            ...withStoreVersion('3'),
            params
        });
        return asArray(response.data?.data);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const getBanners = async (params = {}) => {
    try {
        const response = await api.get(`${BASE_URL_STORE}/v1/banner/get`, {
            ...withStoreVersion('3'),
            params
        });
        return asArray(response.data?.data);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const getBrands = async (params = {}) => {
    try {
        const response = await api.get(`${BASE_URL_STORE}/v1/brand/get`, {
            ...withStoreVersion('3'),
            params
        });
        return asArray(response.data?.data);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const getMerchants = async (params = {}) => {
    try {
        const response = await api.get(`${BASE_URL_STORE}/v1/merchant/get`, {
            ...withStoreVersion('3'),
            params
        });
        return asArray(response.data?.data);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const getMerchantBanners = async (params = {}) => {
    try {
        const response = await api.get(`${BASE_URL_STORE}/v1/merchant-banner/get`, {
            ...withStoreVersion('3'),
            params
        });
        return asArray(response.data?.data);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

export const getMerchantCategories = async (params = {}) => {
    try {
        const response = await api.get(`${BASE_URL_STORE}/v1/merchant-category/get`, {
            ...withStoreVersion('3'),
            params
        });
        return asArray(response.data?.data);
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
};

