export default function (axios: any) {
  return {
    getModifiers(params: { search: string }) {
      return axios.get("merchant/modifiers", { params });
    },

    getCreateModifier() {
      return axios.get("merchant/modifiers/create");
    },

    getEditModifier(id: number) {
      return axios.get(`merchant/modifiers/${id}/edit`);
    },

    createModifier(body: any) {
      return axios.post("merchant/modifiers", body);
    },

    deleteModifier(id: number) {
      return axios.delete(`merchant/modifiers/${id}`);
    },

    editModifier(id: number, body: any) {
      return axios.put(`merchant/modifiers/${id}`, body);
    },
  };
}
