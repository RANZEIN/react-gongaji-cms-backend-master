'use client';

import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';

import type { StoreMerchantCategory } from '@/features/store/types';

type StoreMerchantCategoryDetailsProps = {
    category: StoreMerchantCategory;
    onBack: () => void;
};

export default function StoreMerchantCategoryDetails({
    category,
    onBack
}: StoreMerchantCategoryDetailsProps) {
    const activeRaw = category.merchantc_active;
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
                        {typeof category.merchantc_icon === 'string' && category.merchantc_icon ? (
                            <Image
                                src={category.merchantc_icon}
                                alt={category.merchantc_name || category.merchantc_uuid || 'Category'}
                                width="100%"
                                height="220"
                                className="border-round"
                            />
                        ) : (
                            <div className="text-500">No icon</div>
                        )}
                    </div>
                </div>

                <div className="col-12 md:col-8">
                    <div className="flex flex-column gap-2">
                        <div>
                            <div className="text-500 text-sm">Name</div>
                            <div className="font-semibold">{category.merchantc_name ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Brand</div>
                            <div className="font-semibold">{category.merchantc_brand ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Sequence</div>
                            <div className="font-semibold">{category.merchantc_sequence ?? '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

