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

const headers = {
  "X-Tenant": null,
  "X-Emulation": null,
};

export default function (axios: any) {
  return {
    checkUserExistance(body: any) {
      return axios.post(`admin/check-user-exists`, body, {
        headers: headers,
      });
    },
    getMerchantsList(params: any) {
      return axios.get("admin/merchants", {
        headers: headers,
        params,
      });
    },

    getCreateMerchant() {
      return axios.get("admin/merchants/create", { headers: headers });
    },

    createMerchant(body: any) {
      const image = body["logo"] ?? "";
      delete body["logo"];
      const form = new FormData();
      appendObjectToFormData(form, body, "");
      form.append("logo", image);

      return axios.post("admin/merchants", form, { headers: headers });
    },

    getEditMerchant(id: number | string) {
      return axios.get(`admin/merchants/${id}/edit`);
    },

    editMerchant(id: number | string, body: any) {
      const image = body["logo"] ?? "";
      delete body["logo"];
      delete body["user"];
      const form = new FormData();
      appendObjectToFormData(form, body, "");
      if (image != null) {
        form.append("logo", image);
      }
      form.append("_method", "put");

      return axios.post(`admin/merchants/${id}`, form, { headers: headers });
    },

    deleteMerchant(id: number) {
      return axios.delete(`admin/merchants/${id}`, { headers: headers });
    },
  };
}
