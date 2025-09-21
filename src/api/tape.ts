import { Integer } from "type-fest";

export default function (axios: any) {
  return {
    /*-------------- Tape ------------------*/
    getXZTapesHistory(params: { search: string }) {
      return axios.get(`merchant/tapes/xz-tapes-history`, { params });
    },
    getXTapes(params: { search: string }) {
      return axios.get(`merchant/tapes/x-tapes`, { params });
    },
    getZTapes(params: { search: string }) {
      return axios.get(`merchant/tapes/z-tapes`, { params });
    },
    create() {
      return axios.get(`merchant/tapes/create`);
    },
    getXTapesByOperator(operator_id: number, params: { search: string }) {
      return axios.get(`merchant/tapes/x-tapes-by-operator/${operator_id}`, {
        params,
      });
    },
    storeXTape(body: any) {
      return axios.post("merchant/tapes/x-store", body);
    },
    storeZTape(body: any) {
      return axios.post("merchant/tapes/z-store", body);
    },
    showTape(id: number) {
      return axios.get(`merchant/tapes/show/${id}`);
    },
    getMerchantUsers(params: { search: string }) {
      return axios.get(`merchant/users`, { params });
    },
  };
}
