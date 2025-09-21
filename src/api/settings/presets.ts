export default function (axios: any) {
  return {
    getPresetsList(type: string, params: any) {
      return axios.get(`merchant/${type}`, { params });
    },

    getCreatePreset(type: string) {
      return axios.get(`merchant/${type}/create`);
    },

    getEditPreset(type: string, id: number) {
      return axios.get(`merchant/${type}/${id}/edit`);
    },

    createPreset(type: string, body: any) {
      return axios.post(`merchant/${type}`, body);
    },

    editPreset(type: string, id: number, body: any) {
      return axios.put(`merchant/${type}/${id}`, body);
    },

    deletePreset(type: string, id: number) {
      return axios.delete(`merchant/${type}/${id}`);
    },
  };
}
