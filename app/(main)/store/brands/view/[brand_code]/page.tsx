'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

import { getBrands } from '@/services/storeService';
import StoreBrandDetails from '@/components/store/StoreBrandDetails';
import type { StoreBrand } from '@/types/store';

export default function StoreBrandViewPage() {
    const params = useParams();
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const keyParam = params?.brand_code;
    const key = Array.isArray(keyParam) ? keyParam[0] : keyParam;

    const [loading, setLoading] = useState(true);
    const [brand, setBrand] = useState<StoreBrand | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                if (!key) return;
                setLoading(true);

                const byCode = await getBrands({ brand_code: key as string, type_search: 'first' });
                const foundByCode = byCode?.[0] ?? null;
                if (foundByCode) {
                    setBrand(foundByCode);
                    return;
                }

                const byName = await getBrands({ brand_name: key as string, type_search: 'first' });
                setBrand(byName?.[0] ?? null);
            } catch (e: any) {
                toastRef.current?.show({
                    severity: 'error',
                    summary: 'Gagal',
                    detail: e?.message || 'Tidak bisa memuat brand'
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

    if (!brand) {
        return (
            <div className="card flex flex-column align-items-center justify-content-center py-8 gap-3">
                <i className="pi pi-file-excel text-6xl text-400" />
                <h4 className="m-0 text-700">Brand tidak ditemukan</h4>
                <Button label="Kembali" icon="pi pi-arrow-left" outlined onClick={() => router.push('/store/brands')} />
            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            <StoreBrandDetails brand={brand} onBack={() => router.push('/store/brands')} />
        </>
    );
}

