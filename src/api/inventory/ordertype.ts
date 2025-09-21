export default function (axios: any) {
  return {
    /*-------------- Order Type ------------------*/
    getOrderTypes(params: { search: string }) {
      return axios.get("merchant/order-types", { params });
    },
    storeOrderType(body: any) {
      return axios.post("merchant/order-types", body);
    },
    editOrderType(id: number) {
      return axios.get(`merchant/order-types/${id}/edit`);
    },
    updateOrderType(id: number, body: any) {
      return axios.put(`merchant/order-types/${id}`, body);
    },
    deleteOrderType(id: number) {
      return axios.delete(`merchant/order-types/${id}`);
    },
  };
}
