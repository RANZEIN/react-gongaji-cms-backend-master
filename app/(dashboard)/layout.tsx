import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'CMS Dashboard',
    description: 'Dashboard layout for authenticated CMS pages.',
    robots: { index: false, follow: false }
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return <Layout>{children}</Layout>;
}
