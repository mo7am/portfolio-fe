<script lang="ts" setup>
import { computed, ref } from "vue";
import Link from "./Link.vue";
import Lucide from "../Lucide";

const props = defineProps<{
  meta?: any;
}>();

const emit = defineEmits(["pageChanged"]);
const currentPage = ref(1);

const pages = computed(() => {
  const lastPage = props?.meta?.last_page;
  const arr: number[] = [];
  const current = currentPage.value;
  for (let i = current - 3; i <= current + 3; i++) {
    if (i <= lastPage && i >= 1) {
      arr.push(i);
    }
  }
  return arr;
});

const setPage = (page: number, isMetaChange?: boolean) => {
  currentPage.value = page;
  if (!isMetaChange) emit("pageChanged", page);
  return page;
};

const isFirstPage = computed(() => {
  return currentPage.value === 1;
});

const isLastPage = computed(() => {
  return currentPage.value >= props?.meta?.last_page;
});

watch(
  () => props.meta,
  (value) => {
    if (value?.current_page) setPage(value.current_page, true);
  },
  {
    deep: true,
  }
);
</script>

<template>
  <nav v-if="meta">
    <ul class="flex w-full mr-0 sm:w-auto sm:mr-auto">
      <template v-if="!isFirstPage">
        <Link @click="setPage(1)">
          <Lucide icon="ChevronsLeft" class="w-4 h-4" />
        </Link>
      </template>
      <Link v-if="currentPage > 1" @click="setPage(currentPage - 1)">
        <Lucide icon="ChevronLeft" class="w-4 h-4" />
      </Link>
      <div v-for="page in pages" :key="page">
        <Link @click="setPage(page)" :active="page === currentPage">
          <a>{{ page }}</a>
        </Link>
      </div>

      <Link v-if="!isLastPage" @click="setPage(currentPage + 1)">
        <Lucide icon="ChevronRight" class="w-4 h-4" />
      </Link>
      <Link v-if="!isLastPage" @click="setPage(meta.last_page)">
        <Lucide icon="ChevronsRight" class="w-4 h-4" />
      </Link>
    </ul>
  </nav>
</template>
