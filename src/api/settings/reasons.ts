export default function (axios: any) {
  return {
    getReasonsList(params: SearchParams) {
      return axios.get("merchant/reasons", { params });
    },

    getCreateReason() {
      // return axios.get("merchant/reasons/create");
    },

    getEditReason(id: number) {
      return axios.get(`merchant/reasons/${id}/edit`);
    },

    createReason(body: any) {
      return axios.post("merchant/reasons", body);
    },

    editReason(id: number, body: any) {
      return axios.put(`merchant/reasons/${id}`, body);
    },

    deleteReason(id: number) {
      return axios.delete(`merchant/reasons/${id}`);
    },
  };
}
