"use client";

import { useEffect, useState } from "react";
import { getAdminMenus, updateAdminMenuOrder } from "@/app/actions/admin-menu";
import DraggableSidebarNav, { AdminMenu } from "@/components/admin/layout/DraggableSidebarNav";
import { Loader2 } from "lucide-react";

export default function SidebarMenuWrapper() {
    const [menus, setMenus] = useState<AdminMenu[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenus = async () => {
            const res = await getAdminMenus();
            if (res.success && res.menus) {
                setMenus(res.menus);
            }
            setIsLoading(false);
        };
        fetchMenus();
    }, []);

    const handleOrderChange = async (updatedItems: AdminMenu[]) => {
        // Optimistic UI update
        setMenus(updatedItems);

        const payload = updatedItems.map((item) => ({
            id: item.id,
            group: item.group,
            orderIndex: item.orderIndex
        }));

        const res = await updateAdminMenuOrder(payload);
        if (!res.success) {
            alert(`오류: ${res.error}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
            </div>
        );
    }

    return (
        <DraggableSidebarNav
            initialMenus={menus}
            onOrderChange={handleOrderChange}
        />
    );
}
