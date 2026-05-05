/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Menu } from 'primereact/menu';
import { TieredMenu } from 'primereact/tieredmenu';
import { useRouter } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    // Refs untuk Dropdown
    const profileMenuRef = useRef<Menu>(null);
    const featuresMenuRef = useRef<TieredMenu>(null);

    const router = useRouter();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    // 1. Model untuk Features (Menggunakan TieredMenu karena ada sub-menu/nested)
    const featuresModel = [
        {
            label: 'Home',
            icon: 'pi pi-pw pi-home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => router.push('/') }]
        },
        {
            label: 'Features',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Article',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        { label: 'Articles List', icon: 'pi pi-fw pi-list', command: () => router.push('/articles') },
                        { label: 'Create Article', icon: 'pi pi-fw pi-plus-circle', command: () => router.push('/articles/create') },
                        { label: 'Article Tags', icon: 'pi pi-fw pi-tag', command: () => router.push('/articles/tags') },
                        { label: 'Article Categories', icon: 'pi pi-fw pi-folder', command: () => router.push('/articles/categories') }
                    ]
                },
                {
                    label: 'Store',
                    icon: 'pi pi-fw pi-shopping-cart',
                    items: [
                        { label: 'Store Addresses', icon: 'pi pi-fw pi-map-marker', command: () => router.push('/store/addresses') },
                        { label: 'Store Brands', icon: 'pi pi-fw pi-globe', command: () => router.push('/store/brands') }
                    ]
                }
            ]
        }
    ];

    // 2. Model untuk User Account (Menggunakan Menu biasa)
    const userMenuItems = [
        {
            label: 'User Account',
            items: [
                {
                    label: 'Sign Up',
                    icon: 'pi pi-user-plus',
                    command: () => router.push('/auth/signup')
                },
                {
                    label: 'Sign Out',
                    icon: 'pi pi-sign-out',
                    // template: (item: any, options: any) => {
                    //     return (
                    //         <button onClick={(e) => options.onClick(e)} className={classNames(options.className, 'w-full p-link flex align-items-center p-2 text-red-500')}>
                    //             <i className={classNames('mr-2', item.icon)}></i>
                    //             <span>{item.label}</span>
                    //         </button>
                    //     );
                    // },
                    command: () => router.push('/auth/signout')
                }
            ]
        }
    ];

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-gongaji${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} width="50px" height={'100px'} alt="logo" />
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                {/* <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button> */}

                {/* Dropdown Features */}
                <TieredMenu model={featuresModel} popup ref={featuresMenuRef} breakpoint="767px" />
                <button type="button" className="p-link layout-topbar-button" onClick={(e) => featuresMenuRef.current?.toggle(e)}>
                    <i className="pi pi-th-large"></i>
                    <span>Features</span>
                </button>

                {/* Dropdown Profile */}
                <Menu model={userMenuItems} popup ref={profileMenuRef} id="popup_menu_user" />
                <button
                    type="button"
                    className="p-link layout-topbar-button"
                    onClick={(e) => profileMenuRef.current?.toggle(e)}
                >
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>

                {/* <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link> */}
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
