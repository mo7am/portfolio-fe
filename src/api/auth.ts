export default function (axios: any) {
  const headers = {
    "X-Tenant": null,
    "X-Emulation": null,
  };
  return {
    login(type: string, body: any) {
      return axios.post(
        `oauth/${type}/token`,
        {
          ...body,
          scope: "*",
          grant_type: "password",
          client_id: import.meta.env.VITE_API_CLIENT_ID,
          client_secret: import.meta.env.VITE_API_CLIENT_SECRET,
        },
        { headers: headers }
      );
    },

    forgetPassword(body: { email: string }) {
      return axios.post("forgot-password", body, { headers: headers });
    },

    resetPassword(body: any) {
      return axios.post("reset-password", body, { headers: headers });
    },

    changePassword(body: any) {
      return axios.post("profile/change-password", body, { headers: headers });
    },

    logout() {
      return axios.post("auth/logout", { headers: headers });
    },

    getTenants(params: { search: string }) {
      return axios.get("merchant/tenants", { params });
    },

    getTenantById(id: number) {
      return axios.get(`merchant/tenants/${id}`, {
        "X-Tenant": id,
      });
    },
  };
}
