import type { SettingsForm } from "@/types/inventory";

export default function (axios: any) {
  return {
    getGeneralSettings() {
      return axios.get("merchant/inventory-settings/show");
    },

    getAllCartDiscounts(params: any) {
      return axios.get("merchant/discounts/list/cart", { params });
    },

    adjustAllPrices(value: number) {
      return axios.put(`merchant/inventory-settings/adjust-all-prices`, {
        adjust_prices_percentage: value,
      });
    },

    updateSettings(body: SettingsForm) {
      return axios.put(`merchant/inventory-settings/update`, body);
    },
  };
}
