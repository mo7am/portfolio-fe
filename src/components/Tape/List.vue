<script setup lang="ts">
import Pagination from "@/base-components/Pagination/Pagination.vue";
import LoadingIcon from "@/base-components/LoadingIcon";
import TapeTemplate from "@/components/Tape/TapeTemplate.vue";

const props = defineProps({
  tapes: {
    type: Array<any>,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  metaObj: {
    type: Object,
    default: {},
  },
});

const selectedTape = ref<any>(null);
const isSelectedTape = ref<any>(false);

const showTape = (tape: any) => {
  isSelectedTape.value = true;
  selectedTape.value = tape;
};
</script>
<template>
  <section>
    <div class="flex p-4" v-if="isLoading">
      <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
    </div>
    <div v-else class="grid">
      <template v-if="tapes.length">
        <div style="margin-top: -15px" class="flex flex-col">
          <div
            style="margin-top: 18px"
            class="p-4 rounded-lg flex items-center justify-between gap-4 cursor-pointer border"
            :to="''"
            @click="showTape(tape)"
            v-for="tape in props.tapes"
          >
            <div class="flex flex-col justify-between h-full">
              <h6 class="mb-0">
                <i class="fas fa-clock"></i> {{ tape.created_at }} |
                <span class="capitalize" style="color: black">{{
                  tape.type
                }}</span>
              </h6>
              <small class="text-muted d-block"
                ><span style="color: black; font-size: 15px; font-weight: bold"
                  >POS:
                </span>
                <span class="mb-0" style="font-size: 15px">#{{ tape.id }}</span>
                |
                <span>{{ tape.user.name }}</span></small
              >
            </div>

            <div class="flex gap-2">
              <div class="flex flex-col justify-between h-full">
                <h6 class="mb-0" style="color: black">
                  ${{ makeFLoat(tape.transactionsTotalAmount, "") }}
                </h6>
                <small class="text-muted d-block"
                  >{{ tape.transactionsCount }}
                  Transaction
                </small>
              </div>

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
      </template>
      <div class="text-slate-400" v-else>No Records Found!</div>
    </div>
    <div
      class="mt-8 flex m-auto"
      v-if="metaObj && tapes.length"
      :class="{
        'opacity-0': isLoading,
      }"
    >
      <Pagination
        @pageChanged="$emit('callNextPage', $event)"
        :meta="metaObj"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
    <VDialog v-model="isSelectedTape" width="500">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isSelectedTape = false" />

      <VCard>
        <div class="p-4 mt-4">
          <TapeTemplate
            :tape="selectedTape"
            :isSelectedTape="isSelectedTape"
          ></TapeTemplate>
        </div>
      </VCard>
    </VDialog>
  </section>
</template>
