import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faGear, faGears, faLanguage } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import i18n from "@/config/i18n";
import { logout } from "@/services/userServices";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import toggleLang from "@/hooks/useToggleLanguage";
import { useSidebar } from "@/hooks/useSidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { t } = useTranslation("translation", { keyPrefix: "admin.siderbar" });
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      const response = await logout();
      toast.success(response.data.message);
      navigate(response.data.redirect);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message || "Logout failed");
      } else {
        console.error("Unexpected error during logout:", error);
      }
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg cursor-pointer" >
                <AvatarFallback className="rounded-lg"><FontAwesomeIcon icon={faGears} /></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{t("settings")}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="dark w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg"><FontAwesomeIcon icon={faGear} /></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{t("settings")}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onClick={toggleLang}>
                <FontAwesomeIcon icon={faLanguage} />
                {t("language")} - {i18n.language.toUpperCase()}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
