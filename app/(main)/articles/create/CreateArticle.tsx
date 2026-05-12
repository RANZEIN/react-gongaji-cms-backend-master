'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import CreateArticleForm from '@/features/articles/components/CreateArticleForm';
import { createArticle } from '@/features/articles/services/articleService';
import type { Article } from '@/features/articles/types';

export default function CreateArticle() {
  const [form, setForm] = useState<Partial<Article>>({
    article_status: 'DRAFT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const onChange = (key: keyof Article, value: string | string[] | File) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null); // Clear error when user makes changes
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const title = form.article_title as string | undefined;
      const description = form.article_description as string | undefined;
      const author = form.article_author as string | undefined;
      const image = form.article_image;

      if (!title?.trim()) {
        toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Judul artikel wajib diisi' });
        return;
      }
      if (!description?.trim()) {
        toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Deskripsi artikel wajib diisi' });
        return;
      }
      if (!author?.trim()) {
        toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Author artikel wajib diisi' });
        return;
      }
      if (!image) {
        toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Gambar artikel wajib diunggah' });
        return;
      }

      const payload: Partial<Article> = { ...form };
      await createArticle(payload);
      toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Artikel berhasil dibuat' });
      router.push('/articles');
    } catch (e: any) {
      const errorMessage = e?.message || 'Tidak bisa membuat artikel';
      setError(new Error(errorMessage));
      toast.current?.show({
        severity: 'error',
        summary: 'Gagal',
        detail: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  if (error) {
    return (
      <div className="card">
        <Toast ref={toast} />
        <div className="text-center">
          <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-3" />
          <p className="text-red-600">Gagal membuat artikel: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      <CreateArticleForm
        value={form}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
        submitLabel="Create Article"
      />
    </>
  );
}
