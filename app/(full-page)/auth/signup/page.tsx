'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import Link from 'next/link';
import { signup } from '@/features/auth/services/authService';

const SignupPage = () => {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async () => {
        try {
            setLoading(true);
            setError('');
            await signup({ fullname, username, email, password });
            router.push('/');
        } catch (e) {
            setError('Signup gagal. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Create Account</div>
                            <span className="text-600 font-medium">Signup untuk mengelola artikel</span>
                        </div>

                        <div>
                            <label htmlFor="fullname" className="block text-900 font-medium mb-2">
                                Full Name
                            </label>
                            <InputText id="fullname" className="w-full mb-4" value={fullname} onChange={(e) => setFullname(e.target.value)} />

                            <label htmlFor="username" className="block text-900 font-medium mb-2">
                                Username
                            </label>
                            <InputText id="username" className="w-full mb-4" value={username} onChange={(e) => setUsername(e.target.value)} />

                            <label htmlFor="email" className="block text-900 font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email" className="w-full mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />

                            <label htmlFor="password" className="block text-900 font-medium mb-2">
                                Password
                            </label>
                            <Password inputId="password" className="w-full mb-5" inputClassName="w-full" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />

                            {error && (
                                <div className="mb-4">
                                    <Message severity="error" text={error} />
                                </div>
                            )}

                            <div className="flex justify-content-end mb-5">
                                <Link href="/auth/signin" className="font-medium no-underline" style={{ color: 'var(--primary-color)' }}>
                                    Sudah punya akun? Login
                                </Link>
                            </div>

                            <Button label="Signup" className="w-full p-3 text-xl" onClick={onSubmit} loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

