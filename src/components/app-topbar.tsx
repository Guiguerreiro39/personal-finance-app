'use client';

import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const AppTopbar = () => {
  const pathname = usePathname();

  const segments = pathname.split('/').filter((segment) => segment !== '');

  return (
    <div className="relative">
      <div className="fixed top-0 z-50 flex h-18 w-full items-center justify-between gap-8 border-b bg-background p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {segments.length === 0 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              {segments.map((segment, index) => (
                <Fragment key={segment}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === segments.length - 1 ? (
                      <BreadcrumbPage className="capitalize">
                        {segment}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className="capitalize"
                        href={`/${segment}`}
                      >
                        {segment}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};
