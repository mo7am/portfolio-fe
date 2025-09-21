export default function (axios: any) {
  return {
    /*-------------- Customer ------------------*/
    getCustomers(params: { search: string }) {
      return axios.get("merchant/customers", { params });
    },
    getAllCustomers() {
      return axios.get("merchant/customers/all");
    },
    createCustomer() {
      return axios.get("merchant/customers/create");
    },
    storeCustomer(body: any) {
      return axios.post("merchant/customers/store", body);
    },
    editCustomer(id: number) {
      return axios.get(`merchant/customers/${id}/edit`);
    },
    updateCustomer(id: number, body: any) {
      return axios.put(`merchant/customers/${id}`, body);
    },
    deleteCustomer(id: number) {
      return axios.delete(`merchant/customers/${id}`);
    },
    checkUniqueCustomerPhone(id: number, name: any) {
      let url = `merchant/customers/uniqueness${id != 0 ? `/${id}` : ""}`;
      return axios.post(url, name);
    },
    getExistingCustomerByPhone(phone: string) {
      return axios.get(`merchant/customers/get-by-phone/${phone}`);
    },
  };
}
