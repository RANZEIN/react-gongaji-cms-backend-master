'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import Link from 'next/link';
import { signin } from '@/services/authService';
import axios from 'axios';

const LoginPage = () => {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async () => {
        try {
            setLoading(true);
            setError('');
            await signin({ credential, password });
            router.push('/');
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const apiMessage = e.response?.data?.message;
                setError(apiMessage ?? 'Login gagal. Periksa username/email dan password Anda.');
            } else {
                setError('Login gagal. Periksa username/email dan password Anda.');
            }
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
                            <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                            <span className="text-600 font-medium">Sign in to manage articles</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Username / Email
                            </label>
                            <InputText
                                id="email1"
                                type="text"
                                placeholder="Masukkan username atau email"
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                            />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            {error && (
                                <div className="mb-4">
                                    <Message severity="error" text={error} />
                                </div>
                            )}

                            <div className="flex align-items-center justify-content-end mb-5 gap-5">
                                <Link className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} href="/auth/signup">
                                    Belum punya akun? Signup
                                </Link>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={onSubmit} loading={loading}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
