/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";

export type AdminMenu = {
    id: string;
    label: string;
    href: string;
    iconName: string;
    group: string;
    orderIndex: number;
    isVisible: boolean;
};

// --- Sortable Item Component ---
function SortableMenuItem({ item, isActive }: { item: AdminMenu; isActive: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        opacity: isDragging ? 0.7 : 1,
    };

    // Dynamically get the Icon component
    const IconComponent = (LucideIcons as any)[item.iconName] || LucideIcons.FileText;

    const linkBaseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full select-none";
    const activeClass = "bg-navy-800 text-white font-bold";
    const inactiveClass = "text-gray-300 hover:bg-navy-800 hover:text-white";

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group">
            <Link
                href={item.href}
                className={`${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                onClick={(e) => {
                    // Prevent navigation if we are dragging
                    if (isDragging) e.preventDefault();
                }}
            >
                <IconComponent size={20} />
                <span className="flex-1 text-left">{item.label}</span>
                {/* Drag handle visual indicator */}
                <LucideIcons.GripVertical size={16} className="opacity-0 group-hover:opacity-50 text-gray-400" />
            </Link>
        </div>
    );
}

// --- Main Container Component ---
interface DraggableSidebarNavProps {
    initialMenus: AdminMenu[];
    onOrderChange: (items: AdminMenu[]) => void;
}

export default function DraggableSidebarNav({ initialMenus, onOrderChange }: DraggableSidebarNavProps) {
    const pathname = usePathname();
    const [menus, setMenus] = useState<AdminMenu[]>([]);

    useEffect(() => {
        // Sort initial menus to ensure they are in order of orderIndex before rendering
        const sorted = [...initialMenus].sort((a, b) => a.orderIndex - b.orderIndex);
        setMenus(sorted);
    }, [initialMenus]);

    const isLinkActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname?.startsWith(path);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires minimum distance of 5px to start drag (prevents accidental clicks)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = menus.findIndex((item) => item.id === active.id);
            const newIndex = menus.findIndex((item) => item.id === over.id);

            const newArray = arrayMove(menus, oldIndex, newIndex);

            // Update orderIndex sequentially based on the new array
            const updatedMenus = newArray.map((item, index) => ({
                ...item,
                orderIndex: index,
            }));

            setMenus(updatedMenus);

            // Notify parent to save to DB in the next tick to prevent render cycle conflicts
            setTimeout(() => {
                onOrderChange(updatedMenus);
            }, 0);
        }
    };

    // Removed grouping logic per user request.

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={menus.map(m => m.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-2 relative">
                    {menus.map((item) => (
                        <SortableMenuItem
                            key={item.id}
                            item={item}
                            isActive={isLinkActive(item.href)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
