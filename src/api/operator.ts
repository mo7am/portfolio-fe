export default function (axios: any) {
  return {
    /*-------------- Operators ------------------*/
    getOperators(params: { search: string }) {
      return axios.get("merchant/operators", { params });
    },
    createOperator() {
      return axios.get("merchant/operators/create");
    },
    storeOperator(body: any) {
      return axios.post("merchant/operators", body);
    },
    editOperator(id: number) {
      return axios.get(`merchant/operators/${id}/edit`);
    },
    updateOperator(id: number, body: any) {
      return axios.put(`merchant/operators/${id}`, body);
    },
    deleteOperator(id: number) {
      return axios.delete(`merchant/operators/${id}`);
    },
  };
}
