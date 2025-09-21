<script lang="ts" setup>
import { inject, ref } from "vue";
import { useUserStore } from "../../stores/user";
import Pagination from "../../base-components/Pagination";
import Lucide from "../../base-components/Lucide";

definePage({
  meta: {
    requiresAuth: true,
    layout: "blank",
    title: "Tenants",
    permission: "",
  },
});

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Tenants";

const userStore = useUserStore();
const router = useRouter();
const api = inject<any>("api");
const tenants = ref<any[]>([]);
const meta = ref<any>(null);
const params = ref<any>({
  limit: 10,
  page: 1,
});

const getTenants = async () => {
  try {
    const response = await api.auth.getTenants(params.value);
    tenants.value = response?.data?.data;
    meta.value = response?.data?.meta;
  } catch (error) {}
};

const setTenant = async (tenant: any) => {
  userStore.setTenant(tenant);
  try {
    const response = await api.auth.getTenantById(tenant.id);
    userStore.setPermissions(response.data.permissions);
    router.push(`/dashboard`);
  } catch (error) {}
};

const goBack = () => {
  router.go(-1);
};

const logout = () => {
  try {
    const response = api.auth.logout();

    userStore.logOut();
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};

getTenants();
</script>

<template>
  <div class="w-3/5 m-auto">
    <section>
      <div class="grid">
        <div
          class="flex items-center justify-between h-10 intro-x"
          style="margin-top: 30px; margin-bottom: 30px"
        >
          <RouterLink
            class="btn btn-primary ms-2 mb-1 custom-back"
            to=""
            @click="goBack"
          >
            <Lucide icon="ArrowLeft" class="w-4 h-4 mr-2" />
            <p style="margin-top: -20px">Back</p>
          </RouterLink>

          <h2 class="mr-5 text-lg font-medium truncate text-primary">
            Choose Tenant
          </h2>
          <VBtn class="bg-white text-white" @click="logout">
            <Lucide icon="LogOut" class="w-4 h-4 mr-2" /> Logout
          </VBtn>
        </div>
      </div>
    </section>
    <section>
      <div class="grid">
        <div
          class="rounded-full cursor-pointer hover:scale-[1.1] transition d-flex flex-column gap-3"
          v-for="tenant in tenants"
          style="margin-bottom: 7px"
          @click="setTenant(tenant)"
        >
          <div style="padding: 7px" class="tax-card">
            <div
              class="p-4 py-3 rounded-lg shadow flex items-center justify-between gap-4 bg-[#f8f7fa] dark:bg-darkmode-bg"
            >
              <div class="meta">
                <div class="d-flex align-items-center justify-content-between">
                  <span class="title">{{ tenant.business_name }}</span>
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <div
                  v-if="tenant.status == 'active'"
                  class="status"
                  style="color: rgb(36 215 24)"
                >
                  {{ tenant.status }}
                </div>
                <div v-else style="color: #ea5455">{{ tenant.status }}</div>
                <svg
                  width="46"
                  height="36"
                  viewBox="0 0 46 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="46" height="35.1429" rx="4" fill="#E9F5FE" />
                  <path
                    d="M20 12L26 17.5714L20 23.1429"
                    stroke="#2196F3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-8 flex m-auto"
        v-if="meta && tenants.length"
        :class="{
          'opacity-0': false,
        }"
      >
        <Pagination
          @pageChanged="
            params.page = $event;
            getTenants();
          "
          :meta="meta"
          class="w-full sm:w-auto sm:mr-auto"
        >
        </Pagination>
      </div>
    </section>
  </div>
</template>
