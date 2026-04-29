export type StoreAddress = {
    address_uuid?: string;
    address_user?: string;
    address_receiver_name?: string;
    address_receiver_telp?: string;
    address_label?: string;
    address_province?: string;
    address_city?: string;
    address_subdistrict?: string;
    address_description?: string;
    address_detail?: string;
    address_latitude?: string;
    address_longitude?: string;
    address_main?: boolean | string;
    address_postal_code?: string;
    address_benchmark?: string;

    // IDs used by the store service for location selection.
    address_province_id?: string;
    address_city_id?: string;
    address_district_id?: string;
    address_subdistrict_id?: string;
    [key: string]: unknown;
};

export type StoreAddressCreatePayload = {
    address_receiver_name: string;
    address_receiver_telp: string;
    address_label: string;

    address_province_id?: string;
    address_city_id?: string;
    address_district_id?: string;
    address_subdistrict_id?: string;

    address_subdistrict: string;
    address_postal_code: string;
    address_detail: string;
    address_benchmark?: string;
    address_latitude?: string;
    address_longitude?: string;
    address_main?: boolean | string;
};

export type StoreAddressUpdatePayload = Partial<StoreAddressCreatePayload>;

export type StoreBrand = {
    brand_code?: string;
    brand_name?: string;
    brand_description?: string;
    brand_image?: string;
    brand_active?: boolean | string;
    [key: string]: unknown;
};

export type StoreMerchant = {
    merchant_code?: string;
    merchant_name?: string;
    merchant_description?: string;
    merchant_city?: string;
    merchant_image?: string;
    merchant_active?: boolean | string;
    [key: string]: unknown;
};

export type StoreMerchantBanner = {
    merchantb_uuid?: string;
    merchantb_brand?: string;
    merchantb_title?: string;
    merchantb_image?: string;
    merchantb_action?: string;
    merchantb_route?: string;
    merchantb_key?: string;
    merchantb_url?: string;
    merchantb_sequence?: string | number;
    merchantb_active?: boolean | string;
    [key: string]: unknown;
};

export type StoreMerchantCategory = {
    merchantc_uuid?: string;
    merchantc_brand?: string;
    merchantc_name?: string;
    merchantc_icon?: string;
    merchantc_sequence?: string | number;
    merchantc_active?: boolean | string;
    [key: string]: unknown;
};

