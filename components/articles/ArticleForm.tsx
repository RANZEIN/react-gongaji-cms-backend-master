'use client';
import { useMemo } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import HtmlEditor from '@/components/common/HtmlEditor';
import type { Article } from '@/types/article';

type FormValues = Partial<Article>;
type ArticleFormProps = {
  value: FormValues;
  onChange: (key: keyof FormValues, value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel: string;
};

const categories = ['Technology', 'Business', 'Lifestyle', 'Education'];
const statusOptions = ['draft', 'published'];

export default function ArticleForm({ value, onChange, onSubmit, loading, submitLabel }: ArticleFormProps) {
  const selectedDate = useMemo(() => (value.article_date ? new Date(value.article_date) : undefined), [value.article_date]);

  return (
    <div className="card">
      <h5>{submitLabel}</h5>
      <div className="grid formgrid p-fluid">

        <div className="field mb-4 col-12">
          <label htmlFor="article_title">Title <span className="text-red-500">*</span></label>
          <InputText
            id="article_title"
            value={value.article_title ?? ''}
            onChange={(e) => onChange('article_title', e.target.value)}
          />
        </div>

        {/* ✅ Field article_author ditambahkan */}
        <div className="field mb-4 col-12 md:col-6">
          <label htmlFor="article_author">Author <span className="text-red-500">*</span></label>
          <InputText
            id="article_author"
            value={(value.article_author as string) ?? ''}
            onChange={(e) => onChange('article_author', e.target.value)}
            placeholder="Masukkan nama author"
            />
        </div>

        <div className="field mb-4 col-12 md:col-6">
          <label htmlFor="article_slug">Slug</label>
          <InputText
            id="article_slug"
            value={value.article_slug ?? ''}
            onChange={(e) => onChange('article_slug', e.target.value)}
          />
        </div>

        <div className="field mb-4 col-12 md:col-6">
          <label htmlFor="article_status">Status</label>
          <Dropdown
            id="article_status"
            value={value.article_status ?? ''}
            options={statusOptions}
            onChange={(e) => onChange('article_status', e.value)}
          />
        </div>

        <div className="field mb-4 col-12 md:col-6">
          <label htmlFor="article_category">Category</label>
          <Dropdown
            id="article_category"
            value={value.article_category ?? ''}
            options={categories}
            onChange={(e) => onChange('article_category', e.value)}
          />
        </div>

        <div className="field mb-4 col-12 md:col-6">
          <label htmlFor="article_date">Publish Date</label>
          <Calendar
            id="article_date"
            value={selectedDate}
            showIcon
            dateFormat="dd/mm/yy"
            onChange={(e) => onChange('article_date', e.value ? new Date(e.value as Date).toISOString() : '')}
          />
        </div>

        <div className="field mb-4 col-12">
            <label htmlFor="article_image">Image <span className="text-red-500">*</span></label>
            <input
                id="article_image"
                type="file"
                accept="image/*"
                className="p-inputtext p-component w-full"
                onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange('article_image', file as any);
                }}
            />
            {/* Preview jika sudah ada URL (mode edit) */}
            {value.article_image && typeof value.article_image === 'string' && (
                <img
                src={value.article_image}
                alt="Preview"
                className="mt-2 border-round"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
            )}
            </div>

        <div className="field mb-4 col-12">
          <label htmlFor="article_content">Summary</label>
          <InputTextarea
            id="article_content"
            rows={3}
            value={value.article_content ?? ''}
            onChange={(e) => onChange('article_content', e.target.value)}
          />
        </div>

        <div className="field mb-4 col-12">
          <label>Description (HTML) <span className="text-red-500">*</span></label>
          <HtmlEditor
            value={value.article_description ?? ''}
            onChange={(html) => onChange('article_description', html)}
          />
        </div>

      </div>
      <Button label={submitLabel} icon="pi pi-save" loading={loading} onClick={onSubmit} />
    </div>
  );
}
