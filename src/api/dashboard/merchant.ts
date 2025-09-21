export default function (axios: any) {
  return {
    getStatistics(params: { year: string }) {
      return axios.get("merchant/dashboard/statistics", { params });
    },
    getTransactions(params: { search: string }) {
      return axios.get("merchant/dashboard/transactions", { params });
    },
  };
}
