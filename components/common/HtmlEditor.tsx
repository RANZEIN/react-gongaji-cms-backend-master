'use client';

import { Editor } from 'primereact/editor';

type HtmlEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export default function HtmlEditor({ value, onChange, placeholder }: HtmlEditorProps) {
    return <Editor value={value} onTextChange={(event) => onChange(event.htmlValue ?? '')} style={{ height: '300px' }} placeholder={placeholder} />;
}
