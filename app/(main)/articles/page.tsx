'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';
import { deleteArticle, getArticles } from '@/services/articleService';
import type { Article } from '@/types/article';

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await getArticles();
            setArticles(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const onDelete = (slug: string) => {
        confirmDialog({
            message: 'Hapus artikel ini?',
            header: 'Konfirmasi',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                await deleteArticle(slug);
                toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Artikel dihapus' });
                loadArticles();
            }
        });
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Articles</h5>
                <Button label="Create Article" icon="pi pi-plus" onClick={() => router.push('/articles/create')} />
            </div>

            <DataTable value={articles} loading={loading} paginator rows={10} responsiveLayout="scroll">
                <Column field="article_title" header="Title" />
                <Column field="article_category" header="Category" />
                <Column field="article_status" header="Status" />
                <Column
                    header="Actions"
                    body={(row: Article) => (
                        <div className="flex gap-2">
                            <Button icon="pi pi-eye" text onClick={() => router.push(`/articles/${row.article_slug}`)} />
                            <Button icon="pi pi-pencil" text onClick={() => router.push(`/articles/edit/${row.article_slug}`)} />
                            <Button icon="pi pi-trash" text severity="danger" onClick={() => onDelete(row.article_slug)} />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
}
