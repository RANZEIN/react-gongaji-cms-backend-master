'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { createArticleTag, deleteArticleTag, getArticleTags, toggleArticleTagActive, updateArticleTag } from '@/services/articleService';
import type { ArticleTag } from '@/types/article';

export default function ArticleTagsPage() {
    const toast = useRef<Toast>(null);
    const [rows, setRows] = useState<ArticleTag[]>([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editing, setEditing] = useState<ArticleTag | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getArticleTags({ pagination: 1, limit: 100 });
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

    const openEdit = (row: ArticleTag) => {
        setEditing(row);
        setName(row.tag_name || '');
        setDescription(row.tag_description || '');
        setDialogVisible(true);
    };

    const save = async () => {
        try {
            if (!name.trim()) {
                toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Nama tag wajib diisi' });
                return;
            }
            if (editing?.tag_uuid) {
                await updateArticleTag(editing.tag_uuid, { tag_name: name, tag_description: description });
            } else {
                await createArticleTag({ tag_name: name, tag_description: description });
            }
            setDialogVisible(false);
            await loadData();
            toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Data tag tersimpan' });
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Gagal', detail: error?.message || 'Operasi gagal' });
        }
    };

    const remove = async (row: ArticleTag) => {
        try {
            await deleteArticleTag(row.tag_uuid);
            await loadData();
            toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Tag terhapus' });
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Gagal', detail: error?.message || 'Delete gagal' });
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Article Tags</h5>
                <Button label="Create Tag" icon="pi pi-plus" onClick={openCreate} />
            </div>
            <DataTable value={rows} loading={loading} paginator rows={10}>
                <Column field="tag_name" header="Name" />
                <Column field="tag_description" header="Description" />
                <Column
                    header="Actions"
                    body={(row: ArticleTag) => (
                        <div className="flex gap-2">
                            <Button icon="pi pi-pencil" text onClick={() => openEdit(row)} />
                            <Button icon="pi pi-eye" text onClick={() => toggleArticleTagActive(row.tag_uuid).then(loadData)} />
                            <Button icon="pi pi-trash" text severity="danger" onClick={() => remove(row)} />
                        </div>
                    )}
                />
            </DataTable>

            <Dialog
                visible={dialogVisible}
                style={{ width: '40rem' }}
                header={editing ? 'Edit Tag' : 'Create Tag'}
                onHide={() => setDialogVisible(false)}
                footer={<Button label="Save" icon="pi pi-save" onClick={save} />}
            >
                <div className="field mb-3">
                    <label htmlFor="tag_name">Name</label>
                    <InputText id="tag_name" className="w-full" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="field mb-0">
                    <label htmlFor="tag_description">Description</label>
                    <InputTextarea
                        id="tag_description"
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
