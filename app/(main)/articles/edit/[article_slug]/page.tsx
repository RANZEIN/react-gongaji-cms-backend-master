'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import ArticleForm from '@/features/articles/components/ArticleForm';
import { getArticleBySlug, updateArticle } from '@/features/articles/services/articleService';
import type { Article } from '@/features/articles/types';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [form, setForm] = useState<Partial<Article>>({});
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const slug = Array.isArray(params?.article_slug)
    ? params.article_slug[0]
    : params?.article_slug;

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoadingInitial(true);
        if (!slug) return;
        const data = await getArticleBySlug(slug);
        setForm(data ?? {});
      } catch (e: any) {
        toast.current?.show({
          severity: 'error',
          summary: 'Gagal',
          detail: e?.message || 'Tidak bisa memuat artikel'
        });
      } finally {
        setLoadingInitial(false);
      }
    };

    if (slug) loadArticle();
  }, [slug]);

  const onChange = (key: keyof Article, value: string | string[] | File) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const articleUuid = form.article_uuid as string | undefined;
      if (!articleUuid) {
        toast.current?.show({ severity: 'error', summary: 'Gagal', detail: 'UUID artikel tidak ditemukan' });
        return;
      }
      await updateArticle(articleUuid, form);
      toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Artikel berhasil diupdate' });
      router.push('/articles');
    } catch (e: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Gagal',
        detail: e?.message || 'Tidak bisa update artikel'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return <div className="card">Loading...</div>;
  }

  return (
    <>
      <Toast ref={toast} />
      <ArticleForm
        value={form}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
        submitLabel="Update Article"
      />
    </>
  );
}
