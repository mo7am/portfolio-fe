import auth from "./auth";
import tax from "./inventory/tax";
import brand from "./inventory/brand";
import ordertype from "./inventory/ordertype";
import discount from "./inventory/discount";
import product from "./inventory/product";
import category from "./inventory/category";
import modifier from "./inventory/modifier";
import order from "./order";
import customer from "./customer";
import tape from "./tape";
import operator from "./operator";
import assets from "./assets";
import roles from "./admin/roles";
import users from "./admin/users";
import operatorAdmin from "./admin/operator";
import merchants from "./admin/merchants";
import settings from "./inventory/settings";
import receipts from "./settings/receipts";
import reasons from "./settings/reasons";
import presets from "./settings/presets";
import pos from "./settings/pos";
import merchantDashboard from "./dashboard/merchant";
import MerchantRoles from "./roles";

export default function ({ appAxios }: { appAxios: any }) {
  return {
    auth: auth(appAxios),
    assets: assets(appAxios),
    order: order(appAxios),
    customer: customer(appAxios),
    tape: tape(appAxios),
    operator: operator(appAxios),
    roles: MerchantRoles(appAxios),
    inventory: {
      settings: settings(appAxios),
      tax: tax(appAxios),
      brand: brand(appAxios),
      ordertype: ordertype(appAxios),
      discount: discount(appAxios),
      product: product(appAxios),
      category: category(appAxios),
      modifier: modifier(appAxios),
    },
    admin: {
      roles: roles(appAxios),
      users: users(appAxios),
      merchants: merchants(appAxios),
      operator: operatorAdmin(appAxios),
    },
    settings: {
      receipts: receipts(appAxios),
      reasons: reasons(appAxios),
      presets: presets(appAxios),
      pos: pos(appAxios),
    },
    dashboard: {
      merchant: merchantDashboard(appAxios),
    },
  };
}
