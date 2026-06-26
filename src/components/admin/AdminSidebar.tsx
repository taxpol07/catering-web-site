"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  Tags,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/equipment", label: "Inventory", icon: Package },
  { href: "/admin/equipment/new", label: "Add Equipment", icon: Plus },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-surface-800 bg-surface-900">
      <div className="border-b border-surface-800 p-6">
        <p className="text-sm font-bold text-white">Admin Panel</p>
        <p className="text-xs text-surface-500">Equipment Management</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-600/20 text-brand-400"
                  : "text-surface-400 hover:bg-surface-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-surface-800 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-surface-400 hover:bg-surface-800 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-surface-400 hover:bg-red-900/20 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
