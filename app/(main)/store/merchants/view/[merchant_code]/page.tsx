'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

import { getMerchants } from '@/services/storeService';
import StoreMerchantDetails from '@/components/store/StoreMerchantDetails';
import type { StoreMerchant } from '@/types/store';

export default function StoreMerchantViewPage() {
    const params = useParams();
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const keyParam = params?.merchant_code;
    const key = Array.isArray(keyParam) ? keyParam[0] : keyParam;

    const [loading, setLoading] = useState(true);
    const [merchant, setMerchant] = useState<StoreMerchant | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                if (!key) return;
                setLoading(true);
                const byCode = await getMerchants({ merchant_code: key as string, type_search: 'first' });
                const found = byCode?.[0] ?? null;
                if (found) {
                    setMerchant(found);
                    return;
                }

                const byName = await getMerchants({ merchant_name: key as string, type_search: 'first' });
                setMerchant(byName?.[0] ?? null);
            } catch (e: any) {
                toastRef.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: e?.message || 'Tidak bisa memuat merchant'
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [key]);

    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }

    if (!merchant) {
        return (
            <div className="card flex flex-column align-items-center justify-content-center py-8 gap-3">
                <i className="pi pi-file-excel text-6xl text-400" />
                <h4 className="m-0 text-700">Merchant tidak ditemukan</h4>
                <Button label="Kembali" icon="pi pi-arrow-left" outlined onClick={() => router.push('/store/merchants')} />
            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            <StoreMerchantDetails merchant={merchant} onBack={() => router.push('/store/merchants')} />
        </>
    );
}

