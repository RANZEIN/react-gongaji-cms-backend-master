'use client';

import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';

import type { StoreBrand } from '@/features/store/types';

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
                        {typeof brand.brand_image === 'string' && brand.brand_image ? (
                            <Image
                                src={brand.brand_image}
                                alt={brand.brand_name || brand.brand_code || 'Brand'}
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

