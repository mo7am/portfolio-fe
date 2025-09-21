<script lang="ts" setup>
import EcommerceCongratulationsJohn from "./Components/EcommerceCongratulationsJohn.vue";
import EcommerceExpensesRadialBarCharts from "./Components/EcommerceExpensesRadialBarCharts.vue";
import EcommerceGeneratedLeads from "./Components/EcommerceGeneratedLeads.vue";
import EcommerceRevenueReport from "./Components/EcommerceRevenueReport.vue";
import EcommerceStatistics from "./Components/EcommerceStatistics.vue";
import EcommerceTotalProfitLineCharts from "./Components/EcommerceTotalProfitLineCharts.vue";
import EcommercePopularProducts from "./Components/EcommercePopularProducts.vue";
import LoadingIcon from "@/base-components/LoadingIcon";

const api = inject<any>("api");
const isLoading = ref(false);
const year = ref<Number>();
const isLoadingTransactions = ref(false);
const isLoadingRevenue = ref(false);
const data = ref<any>({});
const transactions = ref<any[]>([]);
const meta = ref<any>({});

const params = reactive({
  search: "",
  page: 1,
  limit: 5,
});

const getTransactions = async () => {
  isLoadingTransactions.value = true;
  try {
    const res = await api.dashboard.merchant.getTransactions(params);
    transactions.value = await res?.data.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoadingTransactions.value = false;
};

const getStatistics = async (
  yearVal = new Date().getFullYear(),
  fromMenu = false
) => {
  isLoading.value = true;
  if (fromMenu) {
    isLoadingRevenue.value = true;
  }
  try {
    year.value = yearVal;
    const res = await api.dashboard.merchant.getStatistics({
      year: yearVal,
    });
    data.value = await res?.data;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
  isLoadingRevenue.value = false;
};

const onSearch = useDebounceFn((search: string) => {
  params.page = 1;
  params.search = search;
  getTransactions();
}, 600);

const nextPage = async (page: number) => {
  if (meta.value.current_page < meta.value.last_page) {
    params.page = page;
    getTransactions();
  }
};

getStatistics();
getTransactions();
</script>

<template>
  <VRow class="match-height pb-[6rem]">
    <VCol cols="12" md="5" lg="4">
      <VCard v-if="isLoading && !isLoadingRevenue">
        <div class="flex p-4">
          <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
        </div>
      </VCard>
      <EcommerceCongratulationsJohn
        v-else
        :revenueThisMonth="data.revenueThisMonth"
      />
    </VCol>

    <VCol cols="12" md="7" lg="8">
      <VCard title="Statistics" v-if="isLoading && !isLoadingRevenue">
        <div class="flex p-4">
          <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
        </div>
      </VCard>
      <EcommerceStatistics
        v-else
        :isLoading="isLoading"
        :sales="data.sales"
        :revenue="data.revenue"
        :productsCount="data.productsCount"
        :customersCount="data.customersCount"
        class="h-100"
      />
    </VCol>

    <VCol cols="12" lg="4">
      <VRow>
        <VCol cols="12" lg="6" md="3" sm="6">
          <EcommerceExpensesRadialBarCharts />
        </VCol>

        <VCol cols="12" lg="6" md="3" sm="6">
          <EcommerceTotalProfitLineCharts />
        </VCol>

        <VCol cols="12" md="6" lg="12">
          <VCard v-if="isLoading && !isLoadingRevenue">
            <div class="flex p-4">
              <LoadingIcon
                icon="tail-spin"
                color="orange"
                class="w-8 h-8 m-auto"
              />
            </div>
          </VCard>
          <EcommerceGeneratedLeads
            v-else
            :ordersCountThisMonth="data.ordersCountThisMonth"
            :percentageRevenueWithLastMonth="
              data.percentageRevenueWithLastMonth
            "
            :ordersCount="data.ordersCount"
            :popularCategories="data.popularCategories"
          />
        </VCol>
      </VRow>
    </VCol>

    <VCol cols="12" lg="8">
      <VCard v-if="(isLoading && isLoadingRevenue) || isLoading">
        <div class="flex p-4">
          <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
        </div>
      </VCard>
      <EcommerceRevenueReport
        v-else
        :revenues="data.revenueEachMonthByYear"
        @callGetStatistics="getStatistics"
        :year="year"
      />
    </VCol>

    <VCol cols="12" sm="6" lg="4">
      <VCard v-if="isLoading && !isLoadingRevenue">
        <div class="flex p-4">
          <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
        </div>
      </VCard>
      <EcommercePopularProducts v-else :products="data.popularProducts" />
    </VCol>

    <VCol cols="12" lg="8" v-can="'view-order'">
      <EcommerceInvoiceTable
        :transactions="transactions"
        @callOnSearch="onSearch"
        @callNextPage="nextPage"
        :isLoadingTransactions="isLoadingTransactions"
        :metaObj="meta"
      />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
