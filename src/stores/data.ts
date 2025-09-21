import type { InventoryMenuItem as MenuItem } from "@/types/inventory";

export const inventoryMenuItems: MenuItem[] = [
  {
    title: "Inventory Settings",
    sub_title: "Inventory General Settings",
    path: "/dashboard/inventory/settings",
    permission: "manage-inventory-settings",
  },
  {
    title: "Categories",
    sub_title: "Create, Edit and Delete Categories",
    add_btn_title: "Category",
    path: "/dashboard/inventory/categories",
    permission: "create-category",
  },
  {
    title: "Products",
    sub_title: "Create, Edit and Delete Products",
    add_btn_title: "Product",
    path: "/dashboard/inventory/products",
    permission: "create-product",
  },
  {
    title: "Discounts",
    sub_title: "Create, Edit and Delete Discounts",
    add_btn_title: "Discount",
    path: "/dashboard/inventory/discounts",
    permission: "create-discount",
  },
  {
    title: "Modifiers",
    sub_title: "Create, Edit and Delete Modifiers",
    add_btn_title: "Modifier",
    path: "/dashboard/inventory/modifiers",
    permission: "create-modifier",
  },
  {
    title: "Taxes",
    sub_title: "Create, Edit and Delete Taxes",
    add_btn_title: "Tax",
    path: "/dashboard/inventory/taxes",
    permission: "create-tax",
  },
  {
    title: "Brands",
    sub_title: "Create, Edit and Delete Brands",
    add_btn_title: "Brand",
    path: "/dashboard/inventory/brands",
    permission: "create-brand",
  },
  {
    title: "Order Types",
    sub_title: "Configure available Order Types",
    add_btn_title: "Order Type",
    path: "/dashboard/inventory/order-types",
    permission: "create-order-type",
  },
];

export const posMenuItems: MenuItem[] = [
  {
    title: "POS Settings",
    sub_title: "Operator Name",
    add_btn_title: "New",
    path: "/dashboard/settings",
    permission: "manage-pos-settings",
  },
  {
    title: "Tips Management",
    sub_title: "Create, Edit and Delete Tips",
    add_btn_title: "Tip",
    path: "/dashboard/settings/tips",
    permission: "view-tip",
  },
  {
    title: "Delivery Presets",
    sub_title: "Create, Edit and Delete Delivery Presets",
    add_btn_title: "Delivery Preset",
    path: "/dashboard/settings/delivery-presets",
    permission: "view-delivery-presets",
  },
  {
    title: "Receipts",
    sub_title: "Create, Edit and Delete Receipts",
    add_btn_title: "Receipt",
    path: "/dashboard/settings/receipts",
    permission: "view-receipt",
    count: 0,
  },
  {
    title: "Refund Reasons",
    sub_title: "Create, Edit and Delete Refund Reasons",
    add_btn_title: "Reason",
    path: "/dashboard/settings/refund-reasons",
    permission: "view-reason",
    count: 0,
  },
  {
    title: "Terminals",
    sub_title: "Create, Edit and Delete Terminals",
    add_btn_title: "New",
    path: "/dashboard/settings/terminals",
    permission: "manage-terminals",
    count: 0,
  },
  {
    title: "Printers",
    sub_title: "Printer",
    add_btn_title: "New",
    path: "/dashboard/settings/printers",
    permission: "manage-printers",
  },
  {
    title: "Settings Assistant",
    sub_title: "Tip adjust",
    add_btn_title: "New",
    path: "/dashboard/settings/assistant",
    permission: "manage-assistant",
  },
];

export const locationMenuItems: MenuItem[] = [
  {
    title: "Locations",
    sub_title: "Create, Edit and Delete Locations",
    add_btn_title: "Location",
    path: "/dashboard/locations",
    permission: "",
  },
  {
    title: "Operators",
    sub_title: "Create, Edit and Delete Operators",
    add_btn_title: "Operator",
    path: "/dashboard/operators",
    permission: "view-user",
  },
  {
    title: "Roles",
    sub_title: "Create, Edit and Delete Roles",
    add_btn_title: "Role",
    path: "/dashboard/roles",
    permission: "view-roles",
  },
];

export const tapeMenuItems: MenuItem[] = [
  {
    title: "X/Z Reporst History",
    sub_title: "",
    add_btn_title: "X/Z Tape",
    path: "/dashboard/tapes",
    permission: "view-xz-tape-history",
  },
  {
    title: "X Tapes",
    sub_title: "",
    add_btn_title: "X Tape",
    path: "/dashboard/tapes/x-tapes",
    permission: "view-x-tape",
  },
  {
    title: "Z Tapes",
    sub_title: "",
    add_btn_title: "Z Tape",
    path: "/dashboard/tapes/z-tapes",
    permission: "view-z-tape",
  },
  {
    title: "X Tape Operator",
    sub_title: "",
    add_btn_title: "XTapeOperator",
    path: "/dashboard/tapes/x-operator-tapes",
    permission: "view-x-tape_by_operator",
  },
];
