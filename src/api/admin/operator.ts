export default function (axios: any) {
  const headers = {
    "X-Tenant": null,
    "X-Emulation": null,
  };

  return {
    /*-------------- Operators ------------------*/
    getOperators(params: { search: string }) {
      return axios.get("admin/operators", { headers: headers, params });
    },
    createOperator(body: any) {
      return axios.get("admin/operators/create", body, { headers: headers });
    },
    storeOperator(body: any) {
      return axios.post("admin/operators", body, { headers: headers });
    },
    editOperator(id: number) {
      return axios.get(`admin/operators/${id}/edit`, { headers: headers });
    },
    updateOperator(id: number, body: any) {
      return axios.put(`admin/operators/${id}`, body, { headers: headers });
    },
    deleteOperator(id: number) {
      return axios.delete(`admin/operators/${id}`, { headers: headers });
    },
  };
}
