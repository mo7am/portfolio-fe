export default function (axios: any) {
  return {
    getSettings() {
      return axios.get("merchant/pos-settings/show");
    },

    updateSettings(body: any) {
      return axios.put(`merchant/pos-settings/update`, body);
    },
  };
}
