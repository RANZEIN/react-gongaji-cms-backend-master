'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import AddressForm from '@/features/store/components/AddressForm';
import { getAddresses, updateAddress } from '@/features/store/services/storeService';
import type { StoreAddress, StoreAddressCreatePayload } from '@/features/store/types';

export default function EditStoreAddressPage() {
    const params = useParams();
    const router = useRouter();
    const toastRef = useRef<Toast>(null);

    const uuidParam = params?.address_uuid;
    const addressUuid = Array.isArray(uuidParam) ? uuidParam[0] : uuidParam;

    const [loadingInitial, setLoadingInitial] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [form, setForm] = useState<Partial<StoreAddress & StoreAddressCreatePayload>>({
        address_main: false
    });

    const onChange = (key: keyof typeof form, v: string | boolean | undefined) => {
        setForm((prev) => ({ ...prev, [key]: v }));
    };

    useEffect(() => {
        const load = async () => {
            try {
                if (!addressUuid) return;

                setLoadingInitial(true);
                const data = await getAddresses({ address_uuid: addressUuid, type_search: 'first' });
                const found = data?.[0] as any;
                if (!found?.address_uuid) {
                    setNotFound(true);
                    return;
                }
                setForm(found);
            } catch {
                setNotFound(true);
            } finally {
                setLoadingInitial(false);
            }
        };

        load();
    }, [addressUuid]);

    const onSubmit = async () => {
        try {
            if (!form.address_uuid) {
                toastRef.current?.show({ severity: 'error', summary: 'Gagal', detail: 'UUID tidak ditemukan' });
                return;
            }

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

            await updateAddress(form.address_uuid, form as StoreAddressCreatePayload);
            toastRef.current?.show({ severity: 'success', summary: 'Berhasil', detail: 'Address diupdate' });
            router.push('/store/addresses');
        } catch (e: any) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Gagal',
                detail: e?.message || 'Tidak bisa update address'
            });
        }
    };

    if (loadingInitial) {
        return <div className="card">Loading...</div>;
    }

    if (notFound) {
        return (
            <div className="card flex flex-column align-items-center justify-content-center py-8 gap-3">
                <i className="pi pi-file-excel text-6xl text-400" />
                <h4 className="m-0 text-700">Address tidak ditemukan</h4>
                <Button label="Kembali" icon="pi pi-arrow-left" outlined onClick={() => router.push('/store/addresses')} />
            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            <AddressForm
                value={form}
                onChange={onChange as any}
                onSubmit={onSubmit}
                loading={false}
                submitLabel="Update Address"
            />
        </>
    );
}

