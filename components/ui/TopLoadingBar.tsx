'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

export default function TopLoadingBar() {
  const pathname = usePathname();
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    if (pathname) {
      setIsLoading(true);
      NProgress.start();
    }

    const timeout = setTimeout(() => {
      setIsLoading(false);
      NProgress.done();
    }, 300); // You can adjust this delay

    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
