/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Link from 'next/link';
import GoNgajiLogo from './logo-gongaji';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        // <div className="layout-footer">
        //     <img src={`/layout/images/logo-gongaji-only${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} alt="Logo" height="50" className="mr-2" />
        //     by
        //     <span className="font-medium ml-2">Go Ngaji</span>
        // </div>
          <div className="layout-footer">
              <Link href="/" className="layout-topbar-logo">
                <GoNgajiLogo colorScheme={layoutConfig.colorScheme} />
         </Link>
         <div className="mr-2" ></div> by
            <span className="font-medium ml-2">Go Ngaji</span>
        </div>
    );
};

export default AppFooter;
