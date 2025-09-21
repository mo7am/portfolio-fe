export default function (axios: any) {
  return {
    /*-------------- Brands ------------------*/
    getBrands(params: { search: string }) {
      return axios.get("merchant/brands", { params });
    },
    storeBrand(body: any) {
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        if (body[key]) form.append(key, body[key]);
      });
      return axios.post("merchant/brands", form);
    },
    editBrand(id: number) {
      return axios.get(`merchant/brands/${id}/edit`);
    },
    updateBrand(id: number, body: any) {
      const form = new FormData();
      Object.keys(body).forEach((key) => {
        if (body[key]) form.append(key, body[key]);
      });
      form.append("_method", "put");

      return axios.post(`merchant/brands/${id}`, form);
    },
    deleteBrand(id: number) {
      return axios.delete(`merchant/brands/${id}`);
    },
    checkUniqueBrandName(id: number, name: any) {
      let url = "merchant/brands/uniqueness";
      if (id != 0) {
        url = `merchant/brands/uniqueness/${id}`;
      }
      return axios.post(url, name);
    },
  };
}
