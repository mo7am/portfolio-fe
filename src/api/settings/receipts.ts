export default function (axios: any) {
  return {
    getReceiptsList(params: SearchParams) {
      return axios.get("merchant/receipts", { params });
    },

    getCreateReceipt() {
      return axios.get("merchant/receipts/create");
    },

    getEditReceipt(id: number) {
      return axios.get(`merchant/receipts/${id}/edit`);
    },

    getReceiptTypeFields(type: string) {
      return axios.get(`merchant/receipts/fields/${type}`);
    },

    getFieldsByReceiptType(type: string) {
      return axios.get(`merchant/receipts/required-fields/${type}`);
    },

    getOrderTypeReceipts(type: string) {
      return axios.get(`merchant/receipts/by-order/${type}`);
    },

    checkActiveType(type: string) {
      return axios.get(`merchant/receipts/get-active-type/${type}`);
    },

    createReceipt(body: any) {
      return axios.post("merchant/receipts", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    editReceipt(id: number, body: any) {
      body.append("_method", "PUT");
      return axios.post(`merchant/receipts/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    deleteReceipt(id: number) {
      return axios.delete(`merchant/receipts/${id}`);
    },
  };
}
