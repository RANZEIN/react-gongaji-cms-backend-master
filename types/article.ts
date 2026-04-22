export type Article = {
    article_slug: string;
    article_title: string;
    article_description: string;
    article_content?: string;
    article_category?: string;
    article_status?: string;
    article_image?: string;
    article_date?: string;
    [key: string]: unknown;
};
