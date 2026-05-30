import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

interface Props {
  items: {
    title: string
    url: string
    icon: FontAwesomeIconProps["icon"]
  }[]
}

export function NavMain({ items }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "admin.siderbar" });
  const activeClass = "text-purple-300!";
  return (
    <SidebarGroup >
      <SidebarGroupLabel>{t("title")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem>
            <NavLink className={({ isActive }) => ` ${isActive ? activeClass : ""}`} to={item.url}>
              <SidebarMenuButton className="cursor-pointer" tooltip={item.title}>
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup >
  );
}
