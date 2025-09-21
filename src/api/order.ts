export default function (axios: any) {
  return {
    /*-------------- Order ------------------*/
    getOrders(params: { search: string }) {
      return axios.get("merchant/orders", { params });
    },
    getReciptsByOrderStatus(status: string) {
      return axios.get(`merchant/receipts/by-order/${status}`);
    },
    getReasons(params: any) {
      return axios.get("merchant/reasons", { params });
    },
    refund(id: number, body: any) {
      return axios.post(`merchant/orders/refund/${id}`, body);
    },
    show(id: number) {
      return axios.get(`merchant/orders/${id}`);
    },
  };
}
