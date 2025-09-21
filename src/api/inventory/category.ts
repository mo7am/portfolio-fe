export default function (axios: any) {
  return {
    getCategories(params: any) {
      return axios.get("merchant/categories", { params });
    },

    getCreateCategory() {
      return axios.get("merchant/categories/create");
    },

    getEditCategory(id: number) {
      return axios.get(`merchant/categories/${id}/edit`);
    },

    createCategory(body: any) {
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        if (body[key]) form.append(key, body[key]);
      });
      return axios.post("merchant/categories", form);
    },

    deleteCategory(id: number) {
      return axios.delete(`merchant/categories/${id}`);
    },

    editCategory(id: number, body: any) {
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        if (body[key]) {
          form.append(key, body[key]);
        }
      });

      if (body["parent_id"] == null) {
        form.append("parent_id", "");
      }

      form.append("_method", "put");

      return axios.post(`merchant/categories/${id}`, form);
    },
  };
}
