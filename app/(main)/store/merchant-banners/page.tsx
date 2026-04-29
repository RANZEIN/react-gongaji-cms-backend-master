'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';

import { getMerchantBanners } from '@/services/storeService';
import type { StoreMerchantBanner } from '@/types/store';

export default function StoreMerchantBannersPage() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const [rows, setRows] = useState<StoreMerchantBanner[]>([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const loadBanners = useCallback(async (params: Record<string, any> = {}) => {
        try {
            setLoading(true);
            const data = await getMerchantBanners(params);
            setRows(data);
        } catch (e: any) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: e?.message || 'Tidak bisa memuat merchant banners'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBanners({ type_search: 'first' });
    }, [loadBanners]);

    const completeBanner = async (event: AutoCompleteCompleteEvent) => {
        const query = `${event.query ?? ''}`.trim();
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const data = await getMerchantBanners({ merchantb_title: query, type_search: 'first' });
            setSuggestions(
                data
                    .map((it: any) => it?.merchantb_title)
                    .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
                    .slice(0, 10)
            );
        } catch {
            setSuggestions([]);
        }
    };

    const onApply = async () => {
        if (keyword.trim()) {
            await loadBanners({ merchantb_title: keyword.trim(), type_search: 'first' });
        } else {
            await loadBanners({ type_search: 'first' });
        }
    };

    const onReset = async () => {
        setKeyword('');
        setSuggestions([]);
        await loadBanners({ type_search: 'first' });
    };

    const isActive = (v: any) =>
        v === true || v === 'true' || v === 'TRUE' || v === '1' || v === 1;

    return (
        <div className="card">
            <Toast ref={toastRef} />

            <div className="flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h5 className="m-0">Store Merchant Banners</h5>
                <Button icon="pi pi-refresh" outlined onClick={() => loadBanners({ type_search: 'first' })} />
            </div>

            <div className="grid mb-3">
                <div className="col-12 md:col-4">
                    <AutoComplete
                        value={keyword}
                        suggestions={suggestions}
                        completeMethod={completeBanner}
                        onChange={(e) => setKeyword(e.value || '')}
                        placeholder="Search banner title"
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
                <Column field="merchantb_title" header="Title" />
                <Column
                    field="merchantb_image"
                    header="Image"
                    body={(row: StoreMerchantBanner) => {
                        const src = row.merchantb_image as string | undefined;
                        return src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt={row.merchantb_title || 'banner'} style={{ width: 70, height: 40, objectFit: 'cover' }} />
                        ) : (
                            <span>-</span>
                        );
                    }}
                />
                <Column field="merchantb_action" header="Action" />
                <Column field="merchantb_route" header="Route" />
                <Column field="merchantb_sequence" header="Sequence" />
                <Column
                    field="merchantb_active"
                    header="Active"
                    body={(row: StoreMerchantBanner) => (
                        <Tag
                            value={isActive(row.merchantb_active) ? 'Yes' : 'No'}
                            severity={isActive(row.merchantb_active) ? 'success' : 'secondary'}
                        />
                    )}
                />
                <Column
                    header="Actions"
                    body={(row: StoreMerchantBanner) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                text
                                onClick={() =>
                                    router.push(
                                        `/store/merchant-banners/view/${encodeURIComponent(
                                            row.merchantb_uuid || row.merchantb_title || ''
                                        )}`
                                    )
                                }
                                disabled={!row.merchantb_uuid && !row.merchantb_title}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
}

