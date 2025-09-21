export default function (axios: any) {
  return {
    getRolesList(params: any) {
      return axios.get("merchant/roles", { params });
    },

    getCreateRole() {
      return axios.get("merchant/roles/create");
    },

    createRole(body: { name: string; permissions: number[] }) {
      return axios.post("merchant/roles", body);
    },

    checkIsNameValid(params: { name: string }, roleID: number | string) {
      return axios.get(
        `merchant/roles/uniqueness${roleID ? `/${roleID}` : ""}`,
        {
          params,
        }
      );
    },

    getEditRole(id: number | string) {
      return axios.get(`merchant/roles/${id}/edit`);
    },

    editRole(
      id: number | string,
      body: { name: string; permissions: number[] }
    ) {
      return axios.put(`merchant/roles/${id}`, body);
    },

    deleteRole(id: number) {
      return axios.delete(`merchant/roles/${id}`);
    },
  };
}
