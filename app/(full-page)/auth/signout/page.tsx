'use client';

import { useEffect } from 'react';
import { signout } from '@/features/auth/services/authService';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function SignoutPage() {
    useEffect(() => {
        const performSignout = async () => {
            try {
                // 1. Hapus session di backend & cookies
                await signout();

                // 2. Bersihkan storage
                localStorage.clear();
                sessionStorage.clear();

                await new Promise((resolve) => setTimeout(resolve, 1500));

            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                window.location.replace('/auth/signin');
            }
        };

        performSignout();
    }, []);

    return (
        <div className="surface-ground flex flex-column align-items-center justify-content-center min-h-screen">
            <div className="text-center p-5 shadow-2 border-round-xl bg-white" style={{ minWidth: '250px' }}>
                <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="6" />
                <h5 className="mt-4 text-900 font-bold">Signing Out</h5>
                <p className="text-600">Menghapus sesi keamanan Anda...</p>
            </div>
        </div>
    );
}

