'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

import { getMerchantCategories } from '@/features/store/services/storeService';
import StoreMerchantCategoryDetails from '@/features/store/components/StoreMerchantCategoryDetails';
import type { StoreMerchantCategory } from '@/features/store/types';

export default function StoreMerchantCategoryViewPage() {
    const params = useParams();
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const uuidParam = params?.merchantc_uuid;
    const uuid = Array.isArray(uuidParam) ? uuidParam[0] : uuidParam;

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<StoreMerchantCategory | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                if (!uuid) return;
                setLoading(true);

                const byUuid = await getMerchantCategories({ merchantc_uuid: uuid as string, type_search: 'first' });
                const foundByUuid = byUuid?.[0] ?? null;
                if (foundByUuid) {
                    setCategory(foundByUuid);
                    return;
                }

                const byName = await getMerchantCategories({ merchantc_name: uuid as string, type_search: 'first' });
                setCategory(byName?.[0] ?? null);
            } catch (e: any) {
                toastRef.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: e?.message || 'Tidak bisa memuat merchant category'
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [uuid]);

    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="card flex flex-column align-items-center justify-content-center py-8 gap-3">
                <i className="pi pi-file-excel text-6xl text-400" />
                <h4 className="m-0 text-700">Merchant category tidak ditemukan</h4>
                <Button label="Kembali" icon="pi pi-arrow-left" outlined onClick={() => router.push('/store/merchant-categories')} />
            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            <StoreMerchantCategoryDetails category={category} onBack={() => router.push('/store/merchant-categories')} />
        </>
    );
}

