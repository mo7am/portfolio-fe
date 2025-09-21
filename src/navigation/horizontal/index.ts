import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

let sub_links = [
  {
    title: "X/Z Tapes",
    to: "/dashboard/tapes",
    icon: "LayersIcon",
  },
  {
    title: "Locations",
    to: "/dashboard/locations",
    icon: "LayersIcon",
  },
  {
    title: "Settings",
    to: "/dashboard/settings",
    icon: "LayersIcon",
  },
  {
    title: "Sign Out",
    to: "/login",
    icon: "LayersIcon",
  },
  {
    title: "Customers",
    to: "/dashboard/customers",
    icon: "LayersIcon",
  },
];

let menu = [
  {
    title: "Dashboard",
    to: { name: "dashboard" },
    icon: "POSIcon",
  },
  {
    title: "Inventory",
    to: { name: "dashboard-inventory" },
    icon: "BoxIcon",
  },
  {
    title: "Order Transactions",
    to: { name: "dashboard-sales-list" },
    icon: "LayersIcon",
  },
  {
    title: "More",
    icon: "VerticalDots",
    sub_links: sub_links,
  },
];

let inventoryIndex = menu.findIndex((obj) => obj.title == "Inventory");
if (userStore.hasPermission("manage-inventory-settings")) {
  menu[inventoryIndex].to = { name: "dashboard-inventory-settings" };
} else if (userStore.hasPermission("view-category")) {
  menu[inventoryIndex].to = { name: "dashboard-inventory-categories" };
} else if (userStore.hasPermission("view-product")) {
  menu[inventoryIndex].to = { name: "dashboard-inventory-products" };
} else if (userStore.hasPermission("view-discount")) {
  menu[inventoryIndex].to = { name: "dashboard-inventory-discounts" };
} else if (userStore.hasPermission("view-modifier")) {
  menu[inventoryIndex].to = { name: "dashboard-inventory-modifiers" };
} else if (userStore.hasPermission("view-tax")) {
  menu[inventoryIndex].to = { name: "dashboard-inventory-taxes" };
} else if (userStore.hasPermission("view-brand")) {
  menu[inventoryIndex].to = { name: "dashboard-inventory-brands" };
} else if (userStore.hasPermission("view-order-type")) {
  menu[inventoryIndex].to = { name: "dashboard-inventory-order-types" };
} else {
  menu.splice(inventoryIndex, 1);
}

let transactionsIndex = menu.findIndex(
  (obj) => obj.title == "Order Transactions"
);

if (!userStore.hasPermission("view-order")) {
  menu.splice(transactionsIndex, 1);
}

if (!userStore.hasPermission("view-customer")) {
  let customerIndex = sub_links.findIndex((obj) => obj.title == "Customers");
  sub_links.splice(customerIndex, 1);
}

let tapeIndex = sub_links.findIndex((obj) => obj.title == "X/Z Tapes");
if (userStore.hasPermission("view-xz-tape-history")) {
  sub_links[tapeIndex].to = "/dashboard/tapes";
} else if (userStore.hasPermission("view-x-tape")) {
  sub_links[tapeIndex].to = "/dashboard/tapes/x-tapes";
} else if (userStore.hasPermission("view-z-tape")) {
  sub_links[tapeIndex].to = "/dashboard/tapes/z-tapes";
} else if (userStore.hasPermission("view-x-tape_by_operator")) {
  sub_links[tapeIndex].to = "/dashboard/tapes/x-operator-tapes";
} else {
  sub_links.splice(tapeIndex, 1);
}

let settingIndex = sub_links.findIndex((obj) => obj.title == "Settings");
if (userStore.hasPermission("manage-pos-settings")) {
  sub_links[settingIndex].to = "/dashboard/settings";
} else if (
  userStore.hasPermission("view-tip") &&
  userStore.getPosSettings.tips != 0
) {
  sub_links[settingIndex].to = "/dashboard/settings/tips";
} else if (
  userStore.hasPermission("view-delivery-presets") &&
  userStore.getPosSettings.delivery_fees != 0
) {
  sub_links[settingIndex].to = "/dashboard/settings/delivery-presets";
} else if (userStore.hasPermission("view-receipt")) {
  sub_links[settingIndex].to = "/dashboard/settings/receipts";
} else if (userStore.hasPermission("view-reason")) {
  sub_links[settingIndex].to = "/dashboard/settings/refund-reasons";
} else {
  sub_links.splice(settingIndex, 1);
}

let locationIndex = sub_links.findIndex((obj) => obj.title == "Locations");
if (userStore.hasPermission("view-user")) {
  sub_links[locationIndex].to = "/dashboard/operators";
} else if (userStore.hasPermission("view-roles")) {
  sub_links[locationIndex].to = "/dashboard/roles";
} else {
  sub_links.splice(locationIndex, 1);
}

export default menu;
