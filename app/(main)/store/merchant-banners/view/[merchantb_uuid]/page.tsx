'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

import { getMerchantBanners } from '@/services/storeService';
import StoreMerchantBannerDetails from '@/components/store/StoreMerchantBannerDetails';
import type { StoreMerchantBanner } from '@/types/store';

export default function StoreMerchantBannerViewPage() {
    const params = useParams();
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const uuidParam = params?.merchantb_uuid;
    const uuid = Array.isArray(uuidParam) ? uuidParam[0] : uuidParam;

    const [loading, setLoading] = useState(true);
    const [banner, setBanner] = useState<StoreMerchantBanner | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                if (!uuid) return;
                setLoading(true);

                const byUuid = await getMerchantBanners({ merchantb_uuid: uuid as string, type_search: 'first' });
                const foundByUuid = byUuid?.[0] ?? null;
                if (foundByUuid) {
                    setBanner(foundByUuid);
                    return;
                }

                const byTitle = await getMerchantBanners({ merchantb_title: uuid as string, type_search: 'first' });
                setBanner(byTitle?.[0] ?? null);
            } catch (e: any) {
                toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: e?.message || 'Tidak bisa memuat banner' });
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

    if (!banner) {
        return (
            <div className="card flex flex-column align-items-center justify-content-center py-8 gap-3">
                <i className="pi pi-file-excel text-6xl text-400" />
                <h4 className="m-0 text-700">Merchant banner tidak ditemukan</h4>
                <Button label="Kembali" icon="pi pi-arrow-left" outlined onClick={() => router.push('/store/merchant-banners')} />
            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            <StoreMerchantBannerDetails banner={banner} onBack={() => router.push('/store/merchant-banners')} />
        </>
    );
}

