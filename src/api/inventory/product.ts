export const appendObjectToFormData = (
  formData: any,
  data: any,
  parentKey: string
) => {
  for (let key in data) {
    if (typeof data[key] === "object") {
      // If the value is an object, recursively call the function
      appendObjectToFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    } else {
      // If the value is not an object, append it directly to FormData
      formData.append(
        parentKey ? `${parentKey}[${key}]` : key,
        typeof data[key] == "boolean" ? (data[key] ? 1 : 0) : data[key]
      );
    }
  }
};

export default function (axios: any) {
  return {
    getProducts(params: { search: string }) {
      return axios.get("merchant/products", { params });
    },
    getFavouriteProducts(params: { search: string }) {
      return axios.get("merchant/favorite-products", { params });
    },
    getCreateProduct() {
      return axios.get("/merchant/products/create");
    },

    getEditProduct(id: number) {
      return axios.get(`merchant/products/${id}/edit`);
    },

    deleteProduct(id: number) {
      return axios.delete(`merchant/products/${id}`);
    },

    createProduct(body: any) {
      const image = body["image"] ?? "";
      delete body["image"];
      const form = new FormData();
      appendObjectToFormData(form, body, "");
      form.append("image", image);
      return axios.post("merchant/products", form);
    },

    editProduct(id: number, body: any) {
      const image = body["image"] ?? "";
      delete body["image"];
      const form = new FormData();
      appendObjectToFormData(form, body, "");
      if (image != null) {
        form.append("image", image);
      }
      form.append("_method", "put");
      return axios.post(`merchant/products/${id}`, form);
    },
  };
}
