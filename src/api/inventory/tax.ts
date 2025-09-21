export default function (axios: any) {
  return {
    /*-------------- Tax ------------------*/
    getTaxes(params: { search: string }) {
      return axios.get("merchant/taxes", { params });
    },
    storeTax(body: any) {
      return axios.post("merchant/taxes", body);
    },
    editTax(id: number) {
      return axios.get(`merchant/taxes/${id}/edit`);
    },
    updateTax(id: number, body: any) {
      return axios.put(`merchant/taxes/${id}`, body);
    },
    deleteTax(id: number) {
      return axios.delete(`merchant/taxes/${id}`);
    },
  };
}
