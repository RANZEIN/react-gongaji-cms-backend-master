'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Image } from 'primereact/image';

import { deleteArticle, getArticleCategories, getArticles } from '@/services/articleService';
import type { Article, ArticleCategory } from '@/types/article';

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<ArticleCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const loadArticles = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = { overview: 'TRUE' };

            if (keyword.trim()) params.keyword = keyword.trim();
            if (statusFilter) params.article_status = statusFilter;
            if (categoryFilter) params.category_uuid = categoryFilter;

            const data = await getArticles(params);
            setArticles(data);
        } finally {
            setLoading(false);
        }
    }, [keyword, statusFilter, categoryFilter]);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getArticleCategories({ limit: 100, pagination: 1 });
            setCategories(data);
        };

        loadCategories();
        loadArticles();
    }, [loadArticles]);

    const onDelete = (articleUuid: string, articleSlug: string) => {
        confirmDialog({
            message: 'Hapus artikel ini?',
            header: 'Konfirmasi',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                await deleteArticle(articleUuid, articleSlug);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Artikel dihapus'
                });
                loadArticles();
            }
        });
    };

    const statusBody = (row: Article) => {
        const value = (row.article_status || '').toUpperCase();
        const severity =
            value === 'PUBLISHED'
                ? 'success'
                : value === 'REVIEW'
                ? 'warning'
                : 'info';

        return <Tag value={value || 'DRAFT'} severity={severity} />;
    };

    const titleBody = (row: Article) => {
        const imageSrc =
            typeof row.article_image === 'string'
                ? row.article_image
                : '/no-image.png';

        return (
            <div className="flex align-items-center gap-3">
                <Image
                    src={imageSrc}
                    alt={row.article_title}
                    width="50"
                    height="50"
                    className="border-round"
                />

                <div>
                    <div className="font-semibold">{row.article_title || '-'}</div>
                    <small className="text-500">/{row.article_slug || '-'}</small>
                </div>
            </div>
        );
    };

    const viewsBody = (row: Article) => (
        <span>{Number(row.article_total_view || 0).toLocaleString('id-ID')}</span>
    );

    const likesBody = (row: Article) => (
        <span>{Number(row.article_total_like || 0).toLocaleString('id-ID')}</span>
    );

    const searchKeyword = async (event: AutoCompleteCompleteEvent) => {
        const query = `${event.query || ''}`.trim();
        if (!query || query.length < 2) {
            setKeywordSuggestions([]);
            return;
        }

        try {
            const data = await getArticles({
                overview: 'FALSE',
                keyword: query,
                type_search: 'FIND',
                limit: 10,
                preload_status: 'TRUE'
            });
            setKeywordSuggestions(
                data
                    .map((entry) => entry.article_title)
                    .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
                    .slice(0, 10)
            );
        } catch {
            setKeywordSuggestions([]);
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Articles</h5>
                <Button
                    label="Create Article"
                    icon="pi pi-plus"
                    onClick={() => router.push('/articles/create')}
                />
            </div>

            <div className="grid mb-3">
                <div className="col-12 md:col-4">
                    <AutoComplete
                        value={keyword}
                        suggestions={keywordSuggestions}
                        completeMethod={searchKeyword}
                        onChange={(e) => setKeyword(e.value || '')}
                        placeholder="Search title/keyword"
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-3">
                    <Dropdown
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.value || '')}
                        options={[
                            { label: 'All Status', value: '' },
                            { label: 'Draft', value: 'DRAFT' },
                            { label: 'Review', value: 'REVIEW' },
                            { label: 'Published', value: 'PUBLISHED' }
                        ]}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Filter status"
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-3">
                    <Dropdown
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.value || '')}
                        options={[{ category_name: 'All Categories', category_uuid: '' }, ...categories]}
                        optionLabel="category_name"
                        optionValue="category_uuid"
                        placeholder="Filter category"
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-2 flex gap-2">
                    <Button label="Apply" onClick={loadArticles} className="w-full" />

                    <Button
                        icon="pi pi-refresh"
                        outlined
                        className="w-full"
                        onClick={async () => {
                            setKeyword('');
                            setKeywordSuggestions([]);
                            setStatusFilter('');
                            setCategoryFilter('');
                            setLoading(true);

                            try {
                                const data = await getArticles({ overview: 'TRUE' });
                                setArticles(data);
                            } finally {
                                setLoading(false);
                            }
                        }}
                    />
                </div>
            </div>

            <DataTable
                value={articles}
                loading={loading}
                paginator
                rows={10}
                responsiveLayout="scroll"
                emptyMessage="Belum ada artikel."
            >
                {/* ❌ Column image dihapus */}

                <Column header="Title" body={titleBody} />
                <Column field="article_author" header="Author" />
                <Column field="article_category" header="Category" />
                <Column header="Status" body={statusBody} />
                <Column header="Views" body={viewsBody} />
                <Column header="Likes" body={likesBody} />

                <Column
                    header="Actions"
                    body={(row: Article) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                text
                                onClick={() => router.push(`/articles/article_view/${row.article_slug}`)}
                            />
                            <Button
                                icon="pi pi-pencil"
                                text
                                onClick={() => router.push(`/articles/edit/${row.article_slug}`)}
                            />
                            <Button
                                icon="pi pi-trash"
                                text
                                severity="danger"
                                onClick={() =>
                                    onDelete(row.article_uuid || '', row.article_slug || '')
                                }
                                disabled={!row.article_uuid && !row.article_slug}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
}
