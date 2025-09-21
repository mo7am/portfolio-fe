export interface InventoryMenuItem {
  title: string;
  sub_title?: string;
  add_btn_title?: string;
  path: string;
  permission?: string;
  count?: number;
}

export interface Discount {
  id: number;
  type: string;
  amount: number;
  name: string;
  status: string;
  pre_selected?: boolean;
}

export interface SettingsForm {
  name: string;
  business_type: string;
  allow_double_discount: boolean;
  discounts: number[];
  unselected_discounts: number[];
}
