export default function (axios: any) {
  return {
    uploadProductImage(file: any, onProgress?: () => void, tenantID?: number) {
      const formData = new FormData();
      formData.append("image", file);
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      if (tenantID) (headers as any)["X-TENANT"] = tenantID;

      return axios.post("merchant/upload/image", formData, {
        headers,
        onUploadProgress: onProgress,
      });
    },
  };
}
