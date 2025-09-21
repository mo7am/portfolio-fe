<script setup lang="ts">
import { useTapeMenu } from "@/stores/tapes-menu";
import TapeList from "@/components/Tape/List.vue";

definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "X Tapes",
    permission: "view-x-tape",
  },
});

const menuStore = useTapeMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const meta = ref<any>({});
const tapes = ref<any[]>([]);
const page = ref(1);
const limit = ref(5);

setPageTitle("X Tapes");

const getTapes = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    const res = await api.tape.getXTapes({
      search: search,
      page: page.value,
      limit: limit.value,
    });
    tapes.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const nextPage = (pageNum: any) => {
  page.value = pageNum;
  getTapes();
};

getTapes();

watch(
  () => menuStore.getSearchValue,
  () => {
    getTapes();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getTapes();
  }
);
</script>
<template>
  <TapeList
    :tapes="tapes"
    :isLoading="isLoading"
    :metaObj="meta"
    @callNextPage="nextPage"
  ></TapeList>
</template>
