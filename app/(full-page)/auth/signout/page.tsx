'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signout } from '@/services/authService';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function SignoutPage() {
    const router = useRouter();

    useEffect(() => {
        signout();
        router.replace('/auth/login');
    }, [router]);

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen">
            <ProgressSpinner />
        </div>
    );
}
