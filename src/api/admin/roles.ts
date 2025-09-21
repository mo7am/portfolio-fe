export default function (axios: any) {
  const headers = {
    "X-Tenant": null,
    "X-Emulation": null,
  };
  return {
    getRolesList(params: any) {
      return axios.get("admin/roles", { headers: headers, params });
    },

    getCreateRole() {
      return axios.get("admin/roles/create", { headers: headers });
    },

    createRole(body: { name: string; permissions: number[] }) {
      return axios.post("admin/roles", body, { headers: headers });
    },

    checkIsNameValid(params: { name: string }, roleID: number | string) {
      return axios.get(`admin/roles/uniqueness${roleID ? `/${roleID}` : ""}`, {
        headers: headers,
        params,
      });
    },

    getEditRole(id: number | string) {
      return axios.get(`admin/roles/${id}/edit`, { headers: headers });
    },

    editRole(
      id: number | string,
      body: { name: string; permissions: number[] }
    ) {
      return axios.put(`admin/roles/${id}`, body, { headers: headers });
    },

    deleteRole(id: number) {
      return axios.delete(`admin/roles/${id}`, { headers: headers });
    },

    getUsers(params: any) {
      return axios.get("admin/accounts", { headers: headers, params });
    },
  };
}
