import { useInventoryMenu } from "@/stores/inventory-menu";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";
import { useLocationMenu } from "@/stores/locations-menu";
import { useTapeMenu } from "@/stores/tapes-menu";
import { useUserStore } from "@/stores/user";

const merchantRoutes = [
  "inventory",
  "sales-list",
  "tapes",
  "locations",
  "settings",
];

export default function (to: any, from: any, next: any) {
  const fullPath = to.fullPath;
  const userStore = useUserStore();
  const inventoryMenuStore = useInventoryMenu();
  const posSettingsMenuStore = usePOSSettingsMenu();
  const locationsMenuStore = useLocationMenu();
  const tapesMenuStore = useTapeMenu();
  const user = userStore.getUser;
  const token = userStore.getToken;
  const permissions = userStore.getPermissions;
  const isAdmin = useUserStore().getIsAdmin;
  const isEmulation = userStore.getIsEmulation;
  const tenant = userStore.getTenant;
  const hasSideMenu =
    fullPath.includes("inventory") ||
    fullPath.includes("dashboard/settings") ||
    fullPath.includes("locations") ||
    fullPath.includes("operators") ||
    fullPath.includes("roles") ||
    fullPath.includes("sales-list") ||
    fullPath.includes("customers") ||
    fullPath.includes("tapes") ||
    fullPath == "/dashboard";

  if (hasSideMenu) {
    if (isAdmin && tenant?.id) {
      userStore.setIsEmulation(1);
    } else {
      userStore.setIsEmulation(0);
    }
    if (getSideMenuPageTitle(fullPath) === "X/Z Tapes") {
      tapesMenuStore.setActiveItemFromTitle(to.meta.title);
    } else if (getSideMenuPageTitle(fullPath) === "Inventory") {
      inventoryMenuStore.setActiveItemFromTitle(to.meta.title);
    } else if (getSideMenuPageTitle(fullPath) === "POS Settings") {
      posSettingsMenuStore.setActiveItemFromTitle(to.meta.title);
    } else if (getSideMenuPageTitle(fullPath) === "Locations") {
      locationsMenuStore.setActiveItemFromTitle(to.meta.title);
    }
  } else {
    userStore.setIsEmulation(0);
  }

  const goNext = () => {
    if (fullPath === "/") {
      if (isAdmin) {
        next("/admin/dashboard");
      } else if (isEmulation != 0 || !isAdmin) {
        next("/dashboard");
      }
    } else if (fullPath === "/dashboard/inventory") {
      next("/dashboard/inventory/settings");
      inventoryMenuStore.setActiveItemFromTitle("Inventory Settings");
    } else if (fullPath === "/dashboard") {
      if (isAdmin && isEmulation == 0) {
        next("/admin/dashboard");
      } else if ((isAdmin && isEmulation != 0) || !isAdmin) {
        next();
      }
    } else {
      next();
    }
  };

  const isLoginPath = to.path.includes("login");
  if (
    isLoginPath ||
    to.path === "/forget-password" ||
    to.path === "/reset-password"
  ) {
    if (token == "") {
      next();
    } else {
      next("/");
    }
    return;
  }

  if (to.path === "/change-password") {
    if (token != "") {
      if (user.is_change_password) {
        next("/");
      } else {
        goNext();
      }
    } else {
      next("/login");
    }
    return;
  }

  if (isAdmin) {
    let isMerchantRoute = false;
    for (let i = 0; i < merchantRoutes.length; i++) {
      const route = merchantRoutes[i];
      if (fullPath.includes(route)) {
        isMerchantRoute = true;
        break;
      }
    }

    if (isMerchantRoute && isEmulation == 0) {
      next("/error");
      return;
    }
  } else {
    if (fullPath.includes("admin")) {
      if (
        to.path === "/admin/forget-password" ||
        to.path === "/admin/reset-password"
      ) {
        next();
      } else {
        if (token == "") {
          next("/admin/login");
        } else {
          next("/error");
        }
      }
      return;
    }
  }

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (token == "") {
      next("/login");
    } else {
      if (user && user.is_change_password) {
        if (
          (to.meta.permission != "" &&
            permissions.includes(to.meta.permission)) ||
          to.meta.permission == ""
        ) {
          goNext();
        } else {
          next("/permissions-error");
        }
      } else {
        next("/change-password");
      }
    }
  } else {
    goNext();
  }
}
