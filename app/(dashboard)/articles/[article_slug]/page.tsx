'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { getArticleBySlug } from '@/services/articleService';
import type { Article } from '@/types/article';

export default function ArticleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const slug = Array.isArray(params?.article_slug) ? params.article_slug[0] : params?.article_slug;

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                if (!slug) return;
                const data = await getArticleBySlug(slug);
                setArticle(data);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }

    if (!article) {
        return <div className="card">Article not found.</div>;
    }

    const cleanText = (article.article_content || '').replace(/<[^>]+>/g, '').trim();
    const status = (article.article_status || '').toUpperCase();
    const severity = status === 'PUBLISHED' ? 'success' : status === 'REVIEW' ? 'warning' : 'info';

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h4 className="m-0">{article.article_title || '-'}</h4>
                <Button label="Back" icon="pi pi-arrow-left" text onClick={() => router.push('/articles')} />
            </div>

            <div className="flex flex-wrap gap-2 align-items-center mb-3">
                <Tag value={status || 'DRAFT'} severity={severity} />
                <span className="text-600">{article.article_category || '-'}</span>
                <span className="text-600">Penulis: {article.article_author || '-'}</span>
            </div>

            {article.article_image && <img src={article.article_image as string} alt={article.article_title} className="w-full border-round mb-4" style={{ maxHeight: 360, objectFit: 'cover' }} />}

            {cleanText && (
                <div className="surface-100 p-3 border-round mb-4">
                    <div className="text-700 line-height-3">{cleanText}</div>
                </div>
            )}

            <div dangerouslySetInnerHTML={{ __html: article.article_description ?? '' }} />
        </div>
    );
}
