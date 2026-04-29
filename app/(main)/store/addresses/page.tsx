'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';

import { deleteAddress, getAddresses } from '@/services/storeService';
import type { StoreAddress } from '@/types/store';

export default function StoreAddressesPage() {
    const router = useRouter();

    const [rows, setRows] = useState<StoreAddress[]>([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const toast = useRef<Toast>(null);

    const loadAddresses = useCallback(
        async (params: Record<string, any> = {}) => {
            try {
                setLoading(true);
                const data = await getAddresses(params);
                setRows(data);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        loadAddresses({ type_search: 'first' });
    }, [loadAddresses]);

    const searchReceiverName = async (event: AutoCompleteCompleteEvent) => {
        const query = `${event.query ?? ''}`.trim();
        setKeyword(query);
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const data = await getAddresses({
                address_receiver_name: query
            });
            setSuggestions(
                data
                    .map((it: any) => it?.address_receiver_name)
                    .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
                    .slice(0, 10)
            );
        } catch {
            setSuggestions([]);
        }
    };

    const onApply = async () => {
        await loadAddresses(
            keyword.trim()
                ? { address_receiver_name: keyword.trim() }
                : { type_search: 'first' }
        );
    };

    const onReset = async () => {
        setKeyword('');
        setSuggestions([]);
        await loadAddresses({ type_search: 'first' });
    };

    const onDelete = (addressUuid?: string) => {
        if (!addressUuid) return;
        confirmDialog({
            message: 'Hapus address ini?',
            header: 'Konfirmasi',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                await deleteAddress(addressUuid);
                toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Address dihapus' });
                loadAddresses({ type_search: 'first' });
            }
        });
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="flex justify-content-between align-items-center mb-4">
                <h5 className="m-0">Store Addresses</h5>
                <Button label="Create Address" icon="pi pi-plus" onClick={() => router.push('/store/addresses/create')} />
            </div>

            <div className="grid mb-3">
                <div className="col-12 md:col-4">
                    <AutoComplete
                        value={keyword}
                        suggestions={suggestions}
                        completeMethod={searchReceiverName}
                        onChange={(e) => setKeyword(e.value || '')}
                        placeholder="Search receiver name"
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
                <Column field="address_receiver_name" header="Receiver" />
                <Column field="address_label" header="Label" />
                <Column field="address_subdistrict" header="Subdistrict" />
                <Column field="address_postal_code" header="Postal" />
                <Column
                    header="Main"
                    body={(row: StoreAddress) => {
                        const v = row.address_main;
                        const isMain =
                            v === true || v === 'true' || v === 'TRUE' || v === '1' || v === 1;
                        return <Tag value={isMain ? 'Yes' : 'No'} severity={isMain ? 'success' : 'secondary'} />;
                    }}
                />
                <Column
                    header="Actions"
                    body={(row: StoreAddress) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                text
                                onClick={() => router.push(`/store/addresses/view/${row.address_uuid}`)}
                                disabled={!row.address_uuid}
                            />
                            <Button
                                icon="pi pi-pencil"
                                text
                                onClick={() => router.push(`/store/addresses/edit/${row.address_uuid}`)}
                                disabled={!row.address_uuid}
                            />
                            <Button
                                icon="pi pi-trash"
                                text
                                severity="danger"
                                onClick={() => onDelete(row.address_uuid)}
                                disabled={!row.address_uuid}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
}

