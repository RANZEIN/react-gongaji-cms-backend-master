'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';

import { getBrands } from '@/features/store/services/storeService';
import type { StoreBrand } from '@/features/store/types';

export default function StoreBrandsPage() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState<StoreBrand[]>([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const loadBrands = useCallback(async (params: Record<string, any> = {}) => {
        try {
            setLoading(true);
            const data = await getBrands(params);
            setRows(data);
        } catch (e: any) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: e?.message || 'Tidak bisa memuat brand'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBrands({ type_search: 'first' });
    }, [loadBrands]);

    const completeBrand = async (event: AutoCompleteCompleteEvent) => {
        const query = `${event.query ?? ''}`.trim();
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const data = await getBrands({ brand_name: query, type_search: 'first' });
            setSuggestions(
                data
                    .map((it: any) => it?.brand_name)
                    .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
                    .slice(0, 10)
            );
        } catch {
            setSuggestions([]);
        }
    };

    const onApply = async () => {
        if (keyword.trim()) {
            await loadBrands({ brand_name: keyword.trim(), type_search: 'find' });
        } else {
            await loadBrands({ type_search: 'first' });
        }
    };

    const onReset = async () => {
        setKeyword('');
        setSuggestions([]);
        await loadBrands({ type_search: 'first' });
    };

    const isActive = (v: any) =>
        v === true || v === 'true' || v === 'TRUE' || v === '1';

    return (
        <div className="card">
            <Toast ref={toastRef} />

            <Toolbar
                start={<h5 className="m-0">Store Brands</h5>}
                end={
                    <Button
                        icon="pi pi-refresh"
                        outlined
                        onClick={() => loadBrands({ type_search: 'first' })}
                    />
                }
                className="mb-4"
            />

            <div className="grid mb-3">
                <div className="col-12 md:col-4">
                    <AutoComplete
                        value={keyword}
                        suggestions={suggestions}
                        completeMethod={completeBrand}
                        onChange={(e) => setKeyword(e.value || '')}
                        placeholder="Search brand name"
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-2 flex gap-2">
                    <Button label="Apply" onClick={onApply} className="w-full" />
                    <Button icon="pi pi-refresh" outlined className="w-full" onClick={onReset} />
                </div>
            </div>

            <DataTable
                value={rows}
                loading={loading}
                paginator
                rows={10}
                responsiveLayout="scroll"
                emptyMessage="Belum ada data."
            >
                <Column field="brand_code" header="Code" />
                <Column field="brand_name" header="Name" />
                <Column
                    field="brand_image"
                    header="Image"
                    body={(row: StoreBrand) => {
                        const src = row.brand_image as string | undefined;
                        return src ? (
                            <Image
                                src={src}
                                alt={row.brand_name || 'brand'}
                                width="70"
                                height="40"
                                className="border-round"
                            />
                        ) : (
                            <span>-</span>
                        );
                    }}
                />
                <Column
                    field="brand_active"
                    header="Active"
                    body={(row: StoreBrand) => (
                        <Tag value={isActive(row.brand_active) ? 'Yes' : 'No'} severity={isActive(row.brand_active) ? 'success' : 'info'} />
                    )}
                />
                <Column
                    field="brand_description"
                    header="Description"
                    body={(row: StoreBrand) => (
                        <span title={(row.brand_description as string) || ''}>{(row.brand_description as string) || '-'}</span>
                    )}
                />
                <Column
                    header="Actions"
                    body={(row: StoreBrand) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                text
                                onClick={() =>
                                    router.push(`/store/brands/view/${encodeURIComponent(row.brand_code || row.brand_name || '')}`)
                                }
                                disabled={!row.brand_code && !row.brand_name}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
}

