'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import ArticleForm from '@/components/articles/ArticleForm';
import { createArticle } from '@/services/articleService';
import type { Article } from '@/types/article';

export default function CreateArticlePage() {
  const [form, setForm] = useState<Partial<Article>>({
    article_status: 'draft'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const onChange = (key: keyof Article, value: string | File) => {
    if (value instanceof File) setImageFile(value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const title = form.article_title as string | undefined;
      const description = form.article_description as string | undefined;
      const author = form.article_author as string | undefined;

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
      if (!imageFile) {
        toast.current?.show({ severity: 'warn', summary: 'Validasi', detail: 'Gambar artikel wajib diunggah' });
        return;
      }

      await createArticle({ ...form, article_image: imageFile as any });
      toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Artikel berhasil dibuat' });
      router.push('/articles');
    } catch (e: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Gagal',
        detail: e?.message || 'Tidak bisa membuat artikel'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <ArticleForm
        value={form}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
        submitLabel="Create Article"
      />
    </>
  );
}
