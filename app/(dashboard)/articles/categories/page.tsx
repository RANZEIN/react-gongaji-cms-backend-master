'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import {
    createArticleCategory,
    deleteArticleCategory,
    getArticleCategories,
    toggleArticleCategoryActive,
    updateArticleCategory
} from '@/services/articleService';
import type { ArticleCategory } from '@/types/article';

export default function ArticleCategoriesPage() {
    const toast = useRef<Toast>(null);
    const [rows, setRows] = useState<ArticleCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editing, setEditing] = useState<ArticleCategory | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getArticleCategories({ pagination: 1, limit: 100 });
            setRows(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setName('');
        setDescription('');
        setDialogVisible(true);
    };

    const openEdit = (row: ArticleCategory) => {
        setEditing(row);
        setName(row.category_name || '');
        setDescription(row.category_description || '');
        setDialogVisible(true);
    };

    const save = async () => {
        try {
            if (!name.trim()) {
                toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Nama category wajib diisi' });
                return;
            }
            if (editing?.category_uuid) {
                await updateArticleCategory(editing.category_uuid, { category_name: name, category_description: description });
            } else {
                await createArticleCategory({ category_name: name, category_description: description });
            }
            setDialogVisible(false);
            await loadData();
            toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data category tersimpan' });
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Gagal', detail: error?.message || 'Operasi gagal' });
        }
    };

    const remove = async (row: ArticleCategory) => {
        try {
            await deleteArticleCategory(row.category_uuid);
            await loadData();
            toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Category terhapus' });
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Gagal', detail: error?.message || 'Delete gagal' });
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Article Categories</h5>
                <Button label="Create Category" icon="pi pi-plus" onClick={openCreate} />
            </div>
            <DataTable value={rows} loading={loading} paginator rows={10}>
                <Column field="category_name" header="Name" />
                <Column field="category_description" header="Description" />
                <Column
                    header="Actions"
                    body={(row: ArticleCategory) => (
                        <div className="flex gap-2">
                            <Button icon="pi pi-pencil" text onClick={() => openEdit(row)} />
                            <Button icon="pi pi-eye" text onClick={() => toggleArticleCategoryActive(row.category_uuid).then(loadData)} />
                            <Button icon="pi pi-trash" text severity="danger" onClick={() => remove(row)} />
                        </div>
                    )}
                />
            </DataTable>

            <Dialog
                visible={dialogVisible}
                style={{ width: '40rem' }}
                header={editing ? 'Edit Category' : 'Create Category'}
                onHide={() => setDialogVisible(false)}
                footer={<Button label="Save" icon="pi pi-save" onClick={save} />}
            >
                <div className="field mb-3">
                    <label htmlFor="category_name">Name</label>
                    <InputText id="category_name" className="w-full" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="field mb-0">
                    <label htmlFor="category_description">Description</label>
                    <InputTextarea
                        id="category_description"
                        className="w-full"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </Dialog>
        </div>
    );
}
