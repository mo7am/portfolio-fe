export default function (axios: any) {
  const headers = {
    "X-Tenant": null,
    "X-Emulation": null,
  };
  return {
    getUsersList(params: any) {
      return axios.get("admin/accounts", { headers: headers, params });
    },

    getCreateUser() {
      return axios.get("admin/accounts/create", { headers: headers });
    },

    createUser(body: any) {
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        if (key === "status") {
          const statusValue = body[key] ? 1 : 0;
          form.append(key, statusValue as any);
        } else {
          form.append(key, body[key]);
        }
      });

      return axios.post("admin/accounts", form, { headers: headers });
    },

    getEditUser(id: number | string) {
      return axios.get(`admin/accounts/${id}/edit`, { headers: headers });
    },

    editUser(id: number | string, body: any) {
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        if (key === "status") {
          const statusValue = body[key] ? 1 : 0;
          form.append(key, statusValue as any);
        } else {
          form.append(key, body[key]);
        }
      });
      form.append("_method", "put");

      return axios.post(`admin/accounts/${id}`, form, { headers: headers });
    },

    changeStatus(id: number, status: string) {
      return axios.put(`admin/change-status/${id}/${status}`, {
        headers: headers,
      });
    },

    deleteUser(id: number) {
      return axios.delete(`admin/accounts/${id}`, { headers: headers });
    },
  };
}
