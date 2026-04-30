'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Divider } from 'primereact/divider';

import { getArticleForView } from '@/features/articles/services/articleService';
import type { Article } from '@/features/articles/types';

export default function ArticleViewDynamicPage() {
    const params = useParams();
    const router = useRouter();
    const slugParam = params?.slug;
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const load = async () => {
            try {
                setLoading(true);
                const data = await getArticleForView(slug as string);
                setArticle(data);
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [slug]);

    const statusSeverity = (status?: string) => {
        const s = (status || '').toUpperCase();
        if (s === 'PUBLISHED') return 'success';
        if (s === 'REVIEW') return 'warning';
        return 'info';
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(dateStr));
    };

    if (loading) {
        return (
            <div className="card">
                <div className="flex align-items-center gap-2 mb-4">
                    <Skeleton width="6rem" height="2rem" />
                    <Skeleton width="5rem" height="2rem" />
                </div>
                <Skeleton width="100%" height="320px" className="mb-4 border-round-xl" />
                <Skeleton width="60%" height="2.2rem" className="mb-2" />
                <Skeleton width="30%" height="1rem" className="mb-4" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="80%" height="1rem" />
            </div>
        );
    }

    if (notFound || !article) {
        return (
            <div className="card flex flex-column align-items-center justify-content-center py-8 gap-3">
                <i className="pi pi-file-excel text-6xl text-400" />
                <h4 className="m-0 text-700">Artikel tidak ditemukan</h4>
                <p className="text-500 m-0">
                    Slug: <code>{slug}</code>
                </p>
                <Button
                    label="Kembali ke Daftar Artikel"
                    icon="pi pi-arrow-left"
                    outlined
                    onClick={() => router.push('/articles')}
                />
            </div>
        );
    }

    const imageSrc =
        typeof article.article_image === 'string' && article.article_image
            ? article.article_image
            : '/no-image.png';

    return (
        <div className="card">
            <Toolbar
                start={
                    <Button
                        label="Kembali"
                        icon="pi pi-arrow-left"
                        text
                        onClick={() => router.back()}
                    />
                }
                end={
                    <Button
                        label="Edit"
                        icon="pi pi-pencil"
                        outlined
                        onClick={() => router.push(`/articles/edit/${article.article_slug}`)}
                    />
                }
                className="mb-4"
            />

            <div
                className="w-full border-round-xl overflow-hidden mb-4"
                style={{ maxHeight: '380px', background: 'var(--surface-100)' }}
            >
                <img
                    src={imageSrc}
                    alt={article.article_title}
                    style={{
                        width: '100%',
                        height: '380px',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/no-image.png';
                    }}
                />
            </div>

            <div className="flex align-items-center gap-2 flex-wrap mb-3">
                <Tag
                    value={(article.article_status || 'DRAFT').toUpperCase()}
                    severity={statusSeverity(article.article_status)}
                />

                {article.article_category && (
                    <Tag
                        value={article.article_category as string}
                        icon="pi pi-tag"
                        style={{ background: 'var(--surface-400)', color: 'var(--surface-0)' }}
                    />
                )}
            </div>

            <h2 className="m-0 mb-2 line-height-3" style={{ fontSize: '1.75rem' }}>
                {article.article_title || '-'}
            </h2>

            <small className="text-500 block mb-4">/{article.article_slug || '-'}</small>

            <Divider />

            <div className="grid mb-4">
                <div className="col-12 md:col-3">
                    <div className="flex flex-column gap-1">
                        <span className="text-500 text-sm">Penulis</span>
                        <span className="font-medium">
                            <i className="pi pi-user mr-1 text-400" />
                            {article.article_author || '-'}
                        </span>
                    </div>
                </div>

                <div className="col-12 md:col-3">
                    <div className="flex flex-column gap-1">
                        <span className="text-500 text-sm">Tanggal Publish</span>
                        <span className="font-medium">
                            <i className="pi pi-calendar mr-1 text-400" />
                            {formatDate(
                                (article.article_published_at as string) ||
                                    (article.created_at as string)
                            )}
                        </span>
                    </div>
                </div>

                <div className="col-12 md:col-3">
                    <div className="flex flex-column gap-1">
                        <span className="text-500 text-sm">Views</span>
                        <span className="font-medium">
                            <i className="pi pi-eye mr-1 text-400" />
                            {Number(article.article_total_view || 0).toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <div className="col-12 md:col-3">
                    <div className="flex flex-column gap-1">
                        <span className="text-500 text-sm">Likes</span>
                        <span className="font-medium">
                            <i className="pi pi-heart mr-1 text-400" />
                            {Number(article.article_total_like || 0).toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            <Divider />

            {article.article_content ? (
                <div
                    className="article-body line-height-3"
                    style={{ fontSize: '1rem', color: 'var(--text-color)' }}
                    dangerouslySetInnerHTML={{ __html: article.article_content }}
                />
            ) : (
                <p className="text-500 font-italic">Tidak ada konten.</p>
            )}
        </div>
    );
}

