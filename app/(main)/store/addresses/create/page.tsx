'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

import AddressForm from '@/components/store/AddressForm';
import { createAddress } from '@/services/storeService';
import type { StoreAddress, StoreAddressCreatePayload } from '@/types/store';

export default function CreateStoreAddressPage() {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<Partial<StoreAddress & StoreAddressCreatePayload>>({
        address_main: false
    });

    const onChange = (key: keyof typeof form, v: string | boolean | undefined) => {
        setForm((prev) => ({ ...prev, [key]: v }));
    };

    const onSubmit = async () => {
        try {
            setLoading(true);

            const required: Array<keyof StoreAddressCreatePayload> = [
                'address_receiver_name',
                'address_receiver_telp',
                'address_label',
                'address_subdistrict',
                'address_postal_code',
                'address_detail'
            ];

            for (const k of required) {
                const value = (form as any)[k];
                if (!`${value ?? ''}`.trim()) {
                    toastRef.current?.show({
                        severity: 'warn',
                        summary: 'Validasi',
                        detail: `Field "${String(k)}" wajib diisi`
                    });
                    return;
                }
            }

            const payload = form as StoreAddressCreatePayload;
            await createAddress(payload);

            toastRef.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Address dibuat' });
            router.push('/store/addresses');
        } catch (e: any) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: e?.message || 'Tidak bisa membuat address'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toastRef} />
            <AddressForm value={form} onChange={onChange as any} onSubmit={onSubmit} loading={loading} submitLabel="Create Address" />
        </>
    );
}

