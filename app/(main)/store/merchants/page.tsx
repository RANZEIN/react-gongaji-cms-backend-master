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

import { getMerchants } from '@/features/store/services/storeService';
import type { StoreMerchant } from '@/features/store/types';

export default function StoreMerchantsPage() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState<StoreMerchant[]>([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const loadMerchants = useCallback(async (params: Record<string, any> = {}) => {
        try {
            setLoading(true);
            const data = await getMerchants(params);
            setRows(data);
        } catch (e: any) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: e?.message || 'Tidak bisa memuat merchants'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMerchants({ type_search: 'first' });
    }, [loadMerchants]);

    const completeMerchant = async (event: AutoCompleteCompleteEvent) => {
        const query = `${event.query ?? ''}`.trim();
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const data = await getMerchants({ merchant_name: query, type_search: 'first' });
            setSuggestions(
                data
                    .map((it: any) => it?.merchant_name)
                    .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
                    .slice(0, 10)
            );
        } catch {
            setSuggestions([]);
        }
    };

    const onApply = async () => {
        if (keyword.trim()) {
            await loadMerchants({ merchant_name: keyword.trim(), type_search: 'find' });
        } else {
            await loadMerchants({ type_search: 'first' });
        }
    };

    const onReset = async () => {
        setKeyword('');
        setSuggestions([]);
        await loadMerchants({ type_search: 'first' });
    };

    const isActive = (v: any) =>
        v === true || v === 'true' || v === 'TRUE' || v === '1';

    return (
        <div className="card">
            <Toast ref={toastRef} />

            <Toolbar
                start={<h5 className="m-0">Store Merchants</h5>}
                end={
                    <Button
                        icon="pi pi-refresh"
                        outlined
                        onClick={() => loadMerchants({ type_search: 'first' })}
                    />
                }
                className="mb-4"
            />

            <div className="grid mb-3">
                <div className="col-12 md:col-4">
                    <AutoComplete
                        value={keyword}
                        suggestions={suggestions}
                        completeMethod={completeMerchant}
                        onChange={(e) => setKeyword(e.value || '')}
                        placeholder="Search merchant name"
                        className="w-full"
                    />
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
                <Column field="merchant_code" header="Code" />
                <Column field="merchant_name" header="Name" />
                <Column
                    field="merchant_image"
                    header="Image"
                    body={(row: StoreMerchant) => {
                        const src = row.merchant_image as string | undefined;
                        return src ? (
                            <Image
                                src={src}
                                alt={row.merchant_name || 'merchant'}
                                width="70"
                                height="40"
                                className="border-round"
                            />
                        ) : (
                            <span>-</span>
                        );
                    }}
                />
                <Column field="merchant_city" header="City" />
                <Column
                    field="merchant_active"
                    header="Active"
                    body={(row: StoreMerchant) => (
                        <Tag
                            value={isActive(row.merchant_active) ? 'Yes' : 'No'}
                            severity={isActive(row.merchant_active) ? 'success' : 'info'}
                        />
                    )}
                />

                <Column
                    field="merchant_description"
                    header="Description"
                    body={(row: StoreMerchant) => (
                        <span title={(row.merchant_description as string) || ''}>{(row.merchant_description as string) || '-'}</span>
                    )}
                />

                <Column
                    header="Actions"
                    body={(row: StoreMerchant) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                text
                                onClick={() =>
                                    router.push(
                                        `/store/merchants/view/${encodeURIComponent(row.merchant_code || row.merchant_name || '')}`
                                    )
                                }
                                disabled={!row.merchant_code && !row.merchant_name}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
}

