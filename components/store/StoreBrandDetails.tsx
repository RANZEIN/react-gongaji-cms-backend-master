'use client';

import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

import type { StoreBrand } from '@/types/store';

type StoreBrandDetailsProps = {
    brand: StoreBrand;
    onBack: () => void;
};

export default function StoreBrandDetails({ brand, onBack }: StoreBrandDetailsProps) {
    const code = brand.brand_code ?? '-';
    const activeRaw = brand.brand_active;
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
                        {typeof brand.brand_image === 'string' && brand.brand_image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={brand.brand_image}
                                alt={brand.brand_name || brand.brand_code || 'Brand'}
                                style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }}
                            />
                        ) : (
                            <div className="text-500">No image</div>
                        )}
                    </div>
                </div>

                <div className="col-12 md:col-8">
                    <div className="flex flex-column gap-2">
                        <div>
                            <div className="text-500 text-sm">Brand Code</div>
                            <div className="font-semibold">{code}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Brand Name</div>
                            <div className="font-semibold">{brand.brand_name ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Description</div>
                            <div className="white-space-pre-wrap">{brand.brand_description ?? '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

