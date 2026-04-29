'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';

import { getAddresses } from '@/services/storeService';
import type { StoreAddress } from '@/types/store';

export default function ViewStoreAddressPage() {
    const params = useParams();
    const router = useRouter();

    const uuidParam = params?.address_uuid;
    const addressUuid = Array.isArray(uuidParam) ? uuidParam[0] : uuidParam;

    const [address, setAddress] = useState<StoreAddress | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                if (!addressUuid) return;
                setLoading(true);
                const data = await getAddresses({ address_uuid: addressUuid, type_search: 'first' });
                const found = data?.[0] ?? null;
                if (!found?.address_uuid) setNotFound(true);
                else setAddress(found as any);
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [addressUuid]);

    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }

    if (notFound || !address) {
        return (
            <div className="card flex flex-column align-items-center justify-content-center py-8 gap-3">
                <i className="pi pi-file-excel text-6xl text-400" />
                <h4 className="m-0 text-700">Address tidak ditemukan</h4>
                <Button label="Kembali" icon="pi pi-arrow-left" outlined onClick={() => router.push('/store/addresses')} />
            </div>
        );
    }

    const isMain =
        address.address_main === true ||
        address.address_main === 'true' ||
        address.address_main === 'TRUE' ||
        address.address_main === 1 ||
        address.address_main === '1';

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
                <Button
                    label="Kembali"
                    icon="pi pi-arrow-left"
                    text
                    onClick={() => router.push('/store/addresses')}
                />

                <div className="flex gap-2 align-items-center">
                    <Tag value={isMain ? 'MAIN' : 'NON-MAIN'} severity={isMain ? 'success' : 'secondary'} />
                    <Button
                        label="Edit"
                        icon="pi pi-pencil"
                        outlined
                        onClick={() => router.push(`/store/addresses/edit/${address.address_uuid}`)}
                    />
                </div>
            </div>

            <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="flex flex-column gap-1 mb-3">
                        <span className="text-500 text-sm">Receiver</span>
                        <span className="font-medium">
                            {address.address_receiver_name || '-'} ({address.address_receiver_telp || '-'})
                        </span>
                    </div>
                    <div className="flex flex-column gap-1 mb-3">
                        <span className="text-500 text-sm">Label</span>
                        <span className="font-medium">{address.address_label || '-'}</span>
                    </div>
                    <div className="flex flex-column gap-1 mb-3">
                        <span className="text-500 text-sm">Subdistrict</span>
                        <span className="font-medium">{address.address_subdistrict || '-'}</span>
                    </div>
                </div>

                <div className="col-12 md:col-6">
                    <div className="flex flex-column gap-1 mb-3">
                        <span className="text-500 text-sm">Postal Code</span>
                        <span className="font-medium">{address.address_postal_code || '-'}</span>
                    </div>
                    <div className="flex flex-column gap-1 mb-3">
                        <span className="text-500 text-sm">Benchmark</span>
                        <span className="font-medium">{address.address_benchmark || '-'}</span>
                    </div>
                </div>

                <div className="col-12">
                    <div className="flex flex-column gap-1">
                        <span className="text-500 text-sm">Address Detail</span>
                        <div className="p-3 border-round-2 surface-100">
                            <div className="white-space-pre-wrap">{address.address_detail || '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

