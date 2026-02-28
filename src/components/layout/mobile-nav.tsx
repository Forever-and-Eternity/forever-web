'use client';

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useUiStore } from '@/lib/stores/ui-store';
import { Sidebar } from './sidebar';

export function MobileNav() {
    const { sidebarOpen, setSidebarOpen } = useUiStore();

    return (
        <Sheet open={!sidebarOpen} onOpenChange={(open) => setSidebarOpen(!open)}>
            <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}
