export type Article = {
    article_uuid?: string;
    article_slug: string;
    article_title: string;
    article_description: string;
    article_author?: string;
    article_content?: string;
    article_category?: string;
    article_status?: string;
    article_image?: string | File;
    article_date?: string;
    article_total_view?: number;
    article_total_like?: number;
    article_total_comment?: number;
    article_total_share?: number;
    category_uuid?: string | string[];
    tag_uuid?: string | string[];
    tag_name?: string;
    article_source?: string;
    article_source_url?: string;
    [key: string]: unknown;
};

export type ArticleCategory = {
    category_uuid: string;
    category_name: string;
    category_description?: string;
    category_active?: boolean;
};

export type ArticleTag = {
    tag_uuid: string;
    tag_name: string;
    tag_description?: string;
    tag_active?: boolean;
};
