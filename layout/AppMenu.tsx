/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Article CMS',
            items: [
                { label: 'Articles', icon: 'pi pi-fw pi-list', to: '/articles' },
                { label: 'Create Article', icon: 'pi pi-fw pi-plus-circle', to: '/articles/create' },
                { label: 'Article Categories', icon: 'pi pi-fw pi-folder', to: '/articles/categories' },
                { label: 'Article Tags', icon: 'pi pi-fw pi-tag', to: '/articles/tags' }
            ]
        },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    to: '/landing'
                },
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        // {
                        //     label: 'Login',
                        //     icon: 'pi pi-fw pi-sign-in',
                        //     to: '/auth/login'
                        // },
                        { label: 'Sign out',
                            icon: 'pi pi-fw pi-sign-out',
                            to: '/auth/signout'
                        }
                    ]
                },
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
