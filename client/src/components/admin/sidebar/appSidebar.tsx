"use client";

import * as React from "react";

import { faCalendar, faNewspaper, faUser } from "@fortawesome/free-regular-svg-icons";
import { faA } from "@fortawesome/free-solid-svg-icons";

import logo from "@/assets/logoAurora.png";

import { NavMain } from "@/components/admin/sidebar/navMain";
import { NavUser } from "@/components/admin/sidebar/navUser";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation("translation", { keyPrefix: "admin.siderbar" });

  const data = {
    navMain: [
      {
        title: t("blog"),
        url: "/admin/blog",
        icon: faNewspaper,
      },
      {
        title: t("events"),
        url: "/admin/events",
        icon: faCalendar,
      },
      {
        title: t("glossary"),
        url: "/admin/glossary",
        icon: faA,
      },
      {
        title: t("users"),
        url: "/admin/users",
        icon: faUser,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row items-center gap-4">
        <img src={logo} className="w-10" alt="" />
        {/* <div className="font-romance">Aurora Onirica</div> */}
      </SidebarHeader>
      <SidebarContent className="dark">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
