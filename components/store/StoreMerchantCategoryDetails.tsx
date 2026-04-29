'use client';

import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

import type { StoreMerchantCategory } from '@/types/store';

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
        activeRaw === '1' ||
        activeRaw === 1;

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
                <Button label="Kembali" icon="pi pi-arrow-left" text onClick={onBack} />
                <Tag value={isActive ? 'ACTIVE' : 'INACTIVE'} severity={isActive ? 'success' : 'secondary'} />
            </div>

            <div className="grid">
                <div className="col-12 md:col-4">
                    <div className="p-3 border-round-2 surface-100">
                        {typeof category.merchantc_icon === 'string' && category.merchantc_icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={category.merchantc_icon}
                                alt={category.merchantc_name || category.merchantc_uuid || 'Category'}
                                style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }}
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

