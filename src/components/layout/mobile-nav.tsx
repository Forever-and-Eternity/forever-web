'use client';

import { XIcon } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useUiStore } from '@/lib/stores/ui-store';
import { Sidebar } from './sidebar';

export function MobileNav() {
    const { sidebarOpen, setSidebarOpen } = useUiStore();

    function closeSidebar() {
        setSidebarOpen(true);
    }

    return (
        <Sheet open={!sidebarOpen} onOpenChange={(open) => setSidebarOpen(!open)}>
            <SheetContent side="left" className="w-[260px] p-0" showCloseButton={false}>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetClose className="absolute right-4 top-0 h-14 flex items-center opacity-70 hover:opacity-100 transition-opacity z-10">
                    <XIcon className="size-4" />
                    <span className="sr-only">Close</span>
                </SheetClose>
                <Sidebar onNavigate={closeSidebar} />
            </SheetContent>
        </Sheet>
    );
}
