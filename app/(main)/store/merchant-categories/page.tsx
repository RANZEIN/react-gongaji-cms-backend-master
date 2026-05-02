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

import { getMerchantCategories } from '@/features/store/services/storeService';
import type { StoreMerchantCategory } from '@/features/store/types';

export default function StoreMerchantCategoriesPage() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState<StoreMerchantCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const loadCategories = useCallback(async (params: Record<string, any> = {}) => {
        try {
            setLoading(true);
            const data = await getMerchantCategories(params);
            setRows(data);
        } catch (e: any) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: e?.message || 'Tidak bisa memuat merchant categories'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories({ type_search: 'first' });
    }, [loadCategories]);

    const completeCategory = async (event: AutoCompleteCompleteEvent) => {
        const query = `${event.query ?? ''}`.trim();
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const data = await getMerchantCategories({ merchantc_name: query, type_search: 'first' });
            setSuggestions(
                data
                    .map((it: any) => it?.merchantc_name)
                    .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
                    .slice(0, 10)
            );
        } catch {
            setSuggestions([]);
        }
    };

    const onApply = async () => {
        if (keyword.trim()) {
            await loadCategories({ merchantc_name: keyword.trim(), type_search: 'first' });
        } else {
            await loadCategories({ type_search: 'first' });
        }
    };

    const onReset = async () => {
        setKeyword('');
        setSuggestions([]);
        await loadCategories({ type_search: 'first' });
    };

    const isActive = (v: any) =>
        v === true || v === 'true' || v === 'TRUE' || v === '1';

    return (
        <div className="card">
            <Toast ref={toastRef} />

            <Toolbar
                start={<h5 className="m-0">Store Merchant Categories</h5>}
                end={
                    <Button
                        icon="pi pi-refresh"
                        outlined
                        onClick={() => loadCategories({ type_search: 'first' })}
                    />
                }
                className="mb-4"
            />

            <div className="grid mb-3">
                <div className="col-12 md:col-4">
                    <AutoComplete
                        value={keyword}
                        suggestions={suggestions}
                        completeMethod={completeCategory}
                        onChange={(e) => setKeyword(e.value || '')}
                        placeholder="Search category name"
                        className="w-full"
                    />
                </div>

                {/* <div className="col-12 md:col-2 flex gap-2">
                    <Button label="Apply" onClick={onApply} className="w-full" />
                    <Button icon="pi pi-refresh" outlined className="w-full" onClick={onReset} />
                </div> */}
            </div>

            <DataTable
                value={rows}
                loading={loading}
                paginator
                rows={10}
                responsiveLayout="scroll"
                emptyMessage="Belum ada data."
            >
                <Column field="merchantc_name" header="Name" />
                <Column field="merchantc_brand" header="Brand" />
                <Column
                    field="merchantc_icon"
                    header="Icon"
                    body={(row: StoreMerchantCategory) => {
                        const src = row.merchantc_icon as string | undefined;
                        return src ? (
                            <Image
                                src={src}
                                alt={row.merchantc_name || 'category'}
                                width="70"
                                height="40"
                                className="border-round"
                            />
                        ) : (
                            <span>-</span>
                        );
                    }}
                />
                <Column field="merchantc_sequence" header="Sequence" />
                <Column
                    field="merchantc_active"
                    header="Active"
                    body={(row: StoreMerchantCategory) => (
                        <Tag
                            value={isActive(row.merchantc_active) ? 'Yes' : 'No'}
                            severity={isActive(row.merchantc_active) ? 'success' : 'info'}
                        />
                    )}
                />
                <Column
                    header="Actions"
                    body={(row: StoreMerchantCategory) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                text
                                onClick={() =>
                                    router.push(
                                        `/store/merchant-categories/view/${encodeURIComponent(
                                            row.merchantc_uuid || row.merchantc_name || ''
                                        )}`
                                    )
                                }
                                disabled={!row.merchantc_uuid && !row.merchantc_name}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
}

