'use client';

import { useMemo, useState } from 'react';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import type { StoreAddress, StoreAddressCreatePayload } from '@/types/store';
import { getAddresses } from '@/services/storeService';

type FormValues = Partial<StoreAddress & StoreAddressCreatePayload>;

type AddressFormProps = {
    value: FormValues;
    onChange: (key: keyof FormValues, v: string | boolean | undefined) => void;
    onSubmit: () => void | Promise<void>;
    loading?: boolean;
    submitLabel: string;
};

const addressMainOptions = [
    { label: 'Main (true)', value: true },
    { label: 'Bukan main (false)', value: false }
];

export default function AddressForm({ value, onChange, onSubmit, loading, submitLabel }: AddressFormProps) {
    const [receiverNameSuggestions, setReceiverNameSuggestions] = useState<string[]>([]);

    const dropdownAddressMain = useMemo(() => {
        if (typeof value.address_main === 'boolean') return value.address_main;
        if (typeof value.address_main === 'string') return value.address_main.toLowerCase() === 'true';
        return undefined;
    }, [value.address_main]);

    const searchReceiverName = async (event: AutoCompleteCompleteEvent) => {
        const query = `${event.query ?? ''}`.trim();
        if (!query || query.length < 2) {
            setReceiverNameSuggestions([]);
            return;
        }

        try {
            const data = await getAddresses({
                address_receiver_name: query
            });

            setReceiverNameSuggestions(
                data
                    .map((it: any) => it?.address_receiver_name)
                    .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
                    .slice(0, 10)
            );
        } catch {
            setReceiverNameSuggestions([]);
        }
    };

    return (
        <div className="card">
            <h5>{submitLabel}</h5>
            <div className="grid formgrid p-fluid">
                <div className="field mb-4 col-12 md:col-6">
                    <label htmlFor="address_receiver_name">
                        Receiver Name <span className="text-red-500">*</span>
                    </label>
                    <AutoComplete
                        id="address_receiver_name"
                        value={value.address_receiver_name ?? ''}
                        suggestions={receiverNameSuggestions}
                        completeMethod={searchReceiverName}
                        onChange={(e) => onChange('address_receiver_name', e.value)}
                        placeholder="Masukkan nama penerima"
                        className="w-full"
                    />
                </div>

                <div className="field mb-4 col-12 md:col-6">
                    <label htmlFor="address_receiver_telp">
                        Receiver Telp <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="address_receiver_telp"
                        value={typeof value.address_receiver_telp === 'string' ? value.address_receiver_telp : (value.address_receiver_telp ?? '')}
                        onChange={(e) => onChange('address_receiver_telp', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                    />
                </div>

                <div className="field mb-4 col-12 md:col-6">
                    <label htmlFor="address_label">
                        Address Label <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="address_label"
                        value={value.address_label ?? ''}
                        onChange={(e) => onChange('address_label', e.target.value)}
                        placeholder="Rumah / Kantor / dll"
                    />
                </div>

                <div className="field mb-4 col-12 md:col-6">
                    <label htmlFor="address_main">Main Address</label>
                    <Dropdown
                        id="address_main"
                        value={dropdownAddressMain}
                        options={addressMainOptions}
                        onChange={(e: DropdownChangeEvent) => onChange('address_main', e.value)}
                        placeholder="Pilih"
                    />
                </div>

                <div className="field mb-4 col-12 md:col-6">
                    <label htmlFor="address_subdistrict">
                        Subdistrict <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="address_subdistrict"
                        value={value.address_subdistrict ?? ''}
                        onChange={(e) => onChange('address_subdistrict', e.target.value)}
                        placeholder="Nama kecamatan/kelurahan"
                    />
                </div>

                <div className="field mb-4 col-12 md:col-6">
                    <label htmlFor="address_postal_code">
                        Postal Code <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="address_postal_code"
                        value={value.address_postal_code ?? ''}
                        onChange={(e) => onChange('address_postal_code', e.target.value)}
                        placeholder="Kode pos"
                    />
                </div>

                <div className="field mb-4 col-12">
                    <label htmlFor="address_detail">
                        Address Detail <span className="text-red-500">*</span>
                    </label>
                    <InputTextarea
                        id="address_detail"
                        value={value.address_detail ?? ''}
                        rows={4}
                        onChange={(e) => onChange('address_detail', e.target.value)}
                    />
                </div>

                <div className="field mb-2 col-12 md:col-6">
                    <label htmlFor="address_benchmark">Benchmark</label>
                    <InputText
                        id="address_benchmark"
                        value={value.address_benchmark ?? ''}
                        onChange={(e) => onChange('address_benchmark', e.target.value)}
                        placeholder="Patokan lokasi (opsional)"
                    />
                </div>
            </div>

            <Button label={submitLabel} icon="pi pi-save" loading={loading} onClick={onSubmit} />
        </div>
    );
}

