export default function (axios: any) {
  return {
    /*-------------- Discount ------------------*/
    getCardDiscounts(params: { search: string }) {
      return axios.get("merchant/discounts/list/cart", { params });
    },
    getItemDiscounts(params: { search: string }) {
      return axios.get("merchant/discounts/list/item", { params });
    },
    storeDiscount(body: any) {
      return axios.post("merchant/discounts", body);
    },
    createDiscount() {
      return axios.get("merchant/discounts/create");
    },
    editDiscount(id: number) {
      return axios.get(`merchant/discounts/${id}/edit`);
    },
    updateDiscount(id: number, body: any) {
      return axios.put(`merchant/discounts/${id}`, body);
    },
    deleteDiscount(id: number) {
      return axios.delete(`merchant/discounts/${id}`);
    },
  };
}
