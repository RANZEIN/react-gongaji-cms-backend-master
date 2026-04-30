'use client';

import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';

import type { StoreMerchant } from '@/features/store/types';

type StoreMerchantDetailsProps = {
    merchant: StoreMerchant;
    onBack: () => void;
};

export default function StoreMerchantDetails({ merchant, onBack }: StoreMerchantDetailsProps) {
    const activeRaw = merchant.merchant_active;
    const isActive =
        activeRaw === true ||
        activeRaw === 'true' ||
        activeRaw === 'TRUE' ||
        activeRaw === '1';

    return (
        <div className="card">
            <Toolbar
                start={<Button label="Kembali" icon="pi pi-arrow-left" text onClick={onBack} />}
                end={<Tag value={isActive ? 'ACTIVE' : 'INACTIVE'} severity={isActive ? 'success' : 'info'} />}
                className="mb-4"
            />

            <div className="grid">
                <div className="col-12 md:col-4">
                    <div className="p-3 border-round-2 surface-100">
                        {typeof merchant.merchant_image === 'string' && merchant.merchant_image ? (
                            <Image
                                src={merchant.merchant_image}
                                alt={merchant.merchant_name || merchant.merchant_code || 'Merchant'}
                                width="100%"
                                height="220"
                                className="border-round"
                            />
                        ) : (
                            <div className="text-500">No image</div>
                        )}
                    </div>
                </div>

                <div className="col-12 md:col-8">
                    <div className="flex flex-column gap-2">
                        <div>
                            <div className="text-500 text-sm">Merchant Code</div>
                            <div className="font-semibold">{merchant.merchant_code ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Merchant Name</div>
                            <div className="font-semibold">{merchant.merchant_name ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">City</div>
                            <div className="font-semibold">{merchant.merchant_city ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Description</div>
                            <div className="white-space-pre-wrap">{merchant.merchant_description ?? '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

