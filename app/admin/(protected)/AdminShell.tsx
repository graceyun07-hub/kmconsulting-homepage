"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  ChartNoAxesColumnIncreasing,
  ExternalLink,
  FileText,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "#analytics", icon: ChartNoAxesColumnIncreasing },
  { label: "Inquiries", href: "#inquiries", icon: FileText },
  { label: "Chatbot", href: "#chatbot", icon: Bot },
  { label: "Site info", href: "#site-info", icon: Info },
  { label: "External links", href: "#external-links", icon: ExternalLink },
];

export default function AdminShell({
  children,
  logoutAction,
}: {
  children: ReactNode;
  logoutAction: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className={isSidebarOpen ? "adminPage" : "adminPage sidebarClosed"}>
      {isSidebarOpen ? (
        <aside className="adminSidebar">
          <div className="adminSidebarTop">
            <Link className="adminBrand" href="/admin">
              <Image className="brandLogo" src="/images/logo-dog.png" alt="" width={32} height={32} />
              <span>KM Admin</span>
            </Link>
            <button className="iconButton adminCollapseButton" type="button" onClick={() => setIsSidebarOpen(false)}>
              <PanelLeftClose size={19} />
              <span className="srOnly">Close sidebar</span>
            </button>
          </div>

          <nav aria-label="Admin menu">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <a className={item.href === "/admin" ? "active" : ""} href={item.href} key={item.label}>
                  <Icon size={18} />
                  {item.label}
                </a>
              );
            })}
            <Link href="/">
              <Home size={18} />
              Homepage
            </Link>
          </nav>

          <form action={logoutAction} className="adminLogoutForm">
            <button type="submit">
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </aside>
      ) : null}

      <section className="adminContent">
        <div className="adminContentControls">
          {!isSidebarOpen ? (
            <button className="adminHamburger" type="button" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={21} />
              <span className="srOnly">Open sidebar</span>
            </button>
          ) : (
            <span />
          )}
          <form action={logoutAction} className="adminTopLogoutForm">
            <button type="submit">
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
        {children}
      </section>
    </main>
  );
}
