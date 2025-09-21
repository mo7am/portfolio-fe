<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
// import type { ProjectAnalytics } from '@/plugins/fake-api/handlers/dashboard/type'
// import { paginationMeta } from '@api-utils/paginationMeta'

import { avatarText } from "@core/utils/formatters";

const searchQuery = ref("");

// Data table options
const itemsPerPage = ref(5);
const page = ref(1);
const sortBy = ref();
const orderBy = ref();

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page;
  sortBy.value = options.sortBy[0]?.key;
  orderBy.value = options.sortBy[0]?.order;
};

// 👉 headers
const headers = [
  { title: "Name", key: "name" },
  { title: "Joining Date", key: "date" },
  { title: "Industry", key: "industry" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions", sortable: false },
];

const resolveStatus: {
  [key: string]: string;
} = {
  active: "success",
  invited: "pending",
  inactive: "error",
};

// 👉 Fetch Projects
const projects = [
  {
    id: 1,
    name: "Metro Market",
    email: "kocrevy0@thetimes.co.uk",
    logo: "",
    date: new Date().toLocaleDateString(),
    industry: "Retail",
    status: "active",
  },
  {
    id: 1,
    name: "Carrefour",
    email: "sganderton2@tuttocitta.it",
    logo: "",
    date: new Date().toLocaleDateString(),
    industry: "Pharmaceutical",
    status: "invited",
  },
  {
    id: 1,
    name: "Genevra Honeywood",
    email: "ediehn6@163.com",
    logo: "",
    date: new Date().toLocaleDateString(),
    industry: "Fashion",
    status: "inactive",
  },
];
</script>

<template>
  <VCard v-if="projects">
    <VCardItem
      class="project-header d-flex flex-wrap justify-space-between py-4 gap-4"
    >
      <VCardTitle>Recent Merchants</VCardTitle>

      <template #append>
        <div class="flex gap-4">
          <AppTextField
            v-model="searchQuery"
            placeholder="Search"
            class="min-w-[200px]"
          />
          <VBtn color="black" class="text-white">Add New Merchant</VBtn>
        </div>
      </template>
    </VCardItem>

    <VDivider />

    <!-- SECTION Table -->
    <VDataTable
      v-model:page="page"
      :items-per-page="5"
      show-select
      fixed-footer
      height="360"
      :search="searchQuery"
      :headers="headers"
      :items="projects"
      item-value="name"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <template #item.name="{ item }">
        <div class="d-flex align-center gap-3 py-2">
          <VAvatar
            :variant="!item.logo.length ? 'tonal' : undefined"
            :color="!item.logo.length ? 'primary' : undefined"
            size="38"
          >
            <VImg v-if="item.logo.length" :src="item.logo" />
            <span v-else class="font-weight-medium">{{
              avatarText(item.name)
            }}</span>
          </VAvatar>

          <div>
            <p class="font-weight-medium mb-0">
              {{ item.name }}
            </p>
            <span class="text-disabled text-sm">{{ item.email }}</span>
          </div>
        </div>
      </template>

      <template #item.date="{ item }">
        <span>{{ item.date }}</span>
      </template>

      <template #item.industry="{ item }">
        <span>{{ item.industry }}</span>
      </template>

      <template #item.status="{ item }">
        <div class="d-flex align-center gap-3" style="min-inline-size: 150px">
          <VChip label :color="resolveStatus[item.status]" class="capitalize">
            {{ item.status }}
          </VChip>
        </div>
      </template>

      <!-- 👉 Actions -->
      <template #item.actions>
        <MoreBtn
          color="default"
          :menu-list="[
            { title: 'Details', value: 'Details' },
            { title: 'Archive', value: 'Archive' },
          ]"
        />
      </template>

      <template #bottom>
        <VDivider />

        <div
          class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3 pa-4"
        >
          <VPagination
            v-model="page"
            :total-visible="Math.ceil(projects.length / itemsPerPage)"
            :length="Math.ceil(projects.length / itemsPerPage)"
          >
            <template #next="slotProps">
              <VBtn
                v-bind="slotProps"
                :icon="false"
                variant="tonal"
                color="default"
              >
                Next
              </VBtn>
            </template>

            <template #prev="slotProps">
              <VBtn
                v-bind="slotProps"
                :icon="false"
                variant="tonal"
                color="default"
              >
                Previous
              </VBtn>
            </template>
          </VPagination>
        </div>
      </template>
    </VDataTable>
    <!-- !SECTION -->
  </VCard>
</template>

<style lang="scss">
.project-header .v-card-item__append {
  padding-inline-start: 0;
}
</style>
