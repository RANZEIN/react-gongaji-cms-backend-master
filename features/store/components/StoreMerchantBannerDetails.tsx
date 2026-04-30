'use client';

import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';

import type { StoreMerchantBanner } from '@/features/store/types';

type StoreMerchantBannerDetailsProps = {
    banner: StoreMerchantBanner;
    onBack: () => void;
};

export default function StoreMerchantBannerDetails({
    banner,
    onBack
}: StoreMerchantBannerDetailsProps) {
    const activeRaw = banner.merchantb_active;
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
                        {typeof banner.merchantb_image === 'string' && banner.merchantb_image ? (
                            <Image
                                src={banner.merchantb_image}
                                alt={banner.merchantb_title || banner.merchantb_uuid || 'Banner'}
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
                            <div className="text-500 text-sm">Title</div>
                            <div className="font-semibold">{banner.merchantb_title ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Brand</div>
                            <div className="font-semibold">{banner.merchantb_brand ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Action</div>
                            <div className="font-semibold">{banner.merchantb_action ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Route</div>
                            <div className="font-semibold">{banner.merchantb_route ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">Sequence</div>
                            <div className="font-semibold">{banner.merchantb_sequence ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-500 text-sm">URL</div>
                            <div className="white-space-pre-wrap">{banner.merchantb_url ?? '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

