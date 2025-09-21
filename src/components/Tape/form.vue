<script setup lang="ts">
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Toast } from "../../plugins/swal";
import { useTapeMenu } from "@/stores/tapes-menu";
import { useUserStore } from "@/stores/user";
import TapeTemplate from "@/components/Tape/TapeTemplate.vue";
import Pagination from "@/base-components/Pagination/Pagination.vue";

const api = inject<any>("api");

const types = [
  {
    key: "x tape",
    title: "X Tape",
  },
  {
    key: "z tape",
    title: "Z Tape",
  },
];

const emit = defineEmits(["getTapes"]);

const isLoading = reactive({
  submitting: false,
  initial: false,
  operators: false,
});
const menuStore = useTapeMenu();
const selectedTape = ref<any>(null);
const isSelectedTape = ref<any>(false);
const isGenerateXtapeOperator = ref<any>(false);
const isCloseShift = ref<any>(false);
const isCashDrawerPopup = ref<any>(false);
const initialData = ref<any>({});
const metaOperator = ref<any>(null);
const operators = ref<any[]>([]);
const selectedOperator = ref<any>(null);
const params = reactive({
  search: "",
  page: 1,
  limit: 6,
});

const route = useRoute();
const tapeType = ref(
  route.fullPath.includes("x-tapes")
    ? "x tape"
    : route.fullPath.includes("z-tapes")
    ? "z tape"
    : route.fullPath.includes("x-operator")
    ? "x tape by operator"
    : ""
);

const showTape = (tape: any) => {
  isSelectedTape.value = true;
  selectedTape.value = tape;
};

const getMerchantUsers = async () => {
  isLoading.operators = true;
  try {
    const res = await api.tape.getMerchantUsers({
      search: params.search,
      page: params.page,
      limit: params.limit,
    });
    operators.value = await res?.data?.data;
    metaOperator.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.operators = false;
};

const isHistory = ref(
  !route.fullPath.includes("x-tapes") &&
    !route.fullPath.includes("x-operator") &&
    !route.fullPath.includes("z-tapes")
    ? true
    : false
);

const userStore = useUserStore();

const generate = async () => {
  isLoading.submitting = true;
  try {
    let res = undefined;
    if (tapeType.value == "z tape") {
      res = await api.tape.storeZTape({
        type: tapeType.value,
        is_generate_xtape_operator: isGenerateXtapeOperator.value,
        is_close_shift: isCloseShift.value,
      });
    } else {
      if (tapeType.value == "x tape by operator" && !selectedOperator.value) {
        Toast.fire({
          icon: "error",
          padding: "10px",
          background: "#fff",
          html: `<span style="font-size:14px">Select operator first!</span>`,
        });
        isLoading.submitting = false;
        return false;
      }
      res = await api.tape.storeXTape({
        type: tapeType.value,
        operator_id:
          tapeType.value == "x tape by operator"
            ? selectedOperator.value.id
            : null,
      });
    }

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">${capitalize(
        tapeType.value
      )} Added Successfully!</span>`,
    });
    showTape(res.data.data);
    menuStore.setIsGetData();
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

const closePopUp = () => {
  if (isHistory.value) {
    tapeType.value = "";
  } else {
    menuStore.setIsPopupVisible(false);
  }
};

const create = async () => {
  isLoading.initial = true;
  try {
    const res = await api.tape.create();
    initialData.value = await res?.data;
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const changeTapeType = (type: any) => {
  tapeType.value = type;
};

const generateXTapeOperatorBeforeZTape = (is_true: any) => {
  isGenerateXtapeOperator.value = is_true;
  if (initialData.value.cashDrawer) {
    isCashDrawerPopup.value = true;
  } else {
    generate();
  }
};

const closeShift = (is_true: any) => {
  isCloseShift.value = is_true;
  generate();
};

const onOperatorsSearch = useDebounceFn(getMerchantUsers, 600);

const onOperatorClick = async (operator: any) => {
  selectedOperator.value = operator;
};

const onSave = async () => {
  if (selectedOperator.value) {
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Select operator first!</span>`,
    });
  }
};

getMerchantUsers();

watch(
  () => tapeType.value,
  (value) => {
    if (value) {
      create();
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div v-if="tapeType != ''">
    <div v-if="isLoading.initial || initialData.openTransactionsCount > 0">
      <div v-if="tapeType == 'x tape' || tapeType == 'x tape by operator'">
        <div v-if="tapeType == 'x tape by operator' && !selectedOperator">
          <div class="p-4 mt-4">
            <div class="flex gap-2">
              <AppTextField
                type="text"
                v-model="params.search"
                placeholder="Search Operators"
                @keyup="onOperatorsSearch"
              />
            </div>
            <div class="mt-4">
              <div
                class="flex p-4"
                v-if="isLoading.operators && !operators.length"
              >
                <LoadingIcon
                  icon="tail-spin"
                  class="w-6 h-6 m-auto"
                  color="orange"
                />
              </div>
              <div
                v-else-if="operators.length"
                class="flex flex-col gap-1 max-h-[400px] overflow-auto"
                :class="{
                  'opacity-70 pointer-events-none':
                    isLoading.operators && operators.length,
                }"
              >
                <div
                  v-for="operator in operators"
                  style="padding-top: 5px; padding-bottom: 10px"
                  :class="
                    selectedOperator && selectedOperator.id == operator.id
                      ? 'border-b-2 border-on-primary'
                      : 'border-b-1'
                  "
                  class="relative items-center cursor-pointer"
                  @click="onOperatorClick(operator)"
                >
                  <p class="font-medium">
                    {{ operator.name }}
                  </p>
                  <p class="capitalize">{{ operator.email }}</p>
                </div>
              </div>
              <div class="py-2 text-slate-400" v-else>No operator found</div>
              <div class="mt-4 flex m-auto" v-if="metaOperator">
                <Pagination
                  @pageChanged="
                    params.page = $event;
                    getMerchantUsers();
                  "
                  :meta="metaOperator"
                  class="w-full sm:w-auto sm:mr-auto"
                >
                </Pagination>
              </div>
              <div class="w-full flex">
                <VBtn
                  :color="'primary'"
                  type="button"
                  class="text-white mt-3 w-[60%] mx-auto"
                  @click="onSave"
                  v-if="operators.length"
                  >Save</VBtn
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="flex p-4" v-if="isLoading.initial">
            <LoadingIcon
              icon="tail-spin"
              color="orange"
              class="w-8 h-8 m-auto"
            />
          </div>
          <div v-else class="py-8 px-4">
            <div class="mb-2 flex">
              <Lucide
                icon="AlertTriangle"
                class="m-auto w-16 h-16"
                :class="'text-danger'"
              />
            </div>
            <div class="text-center text-xl" :class="'text-danger'">
              Are you sure you want to generate {{ capitalize(tapeType) }} for
              {{ initialData.openTransactionsCount }} transactions ?
            </div>
            <div class="mt-4 flex justify-center">
              <VBtn :color="'warning'" @click="closePopUp">No!</VBtn>
              &nbsp;&nbsp;&nbsp;
              <VBtn
                class="flex text-white"
                :color="'primary'"
                @click="generate"
              >
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  class="w-4 h-4 m-auto"
                  v-if="isLoading.submitting"
                />
                <span v-else>Yes?</span>
              </VBtn>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flex p-4" v-if="isLoading.initial">
          <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
        </div>
        <div v-else class="py-8 px-4">
          <div v-if="userStore.hasPermission('create-x-tape')">
            <div class="text-center text-xl" :class="'text-danger'">
              Make X reports by operators before Z reports for
              {{ initialData.openTransactionsCount }} transactions ?
            </div>
            <div class="mt-4 flex justify-center">
              <VBtn
                :color="'warning'"
                @click="generateXTapeOperatorBeforeZTape(false)"
                >No!</VBtn
              >
              &nbsp;&nbsp;&nbsp;
              <VBtn
                class="flex text-white"
                :color="'primary'"
                @click="generateXTapeOperatorBeforeZTape(true)"
              >
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  class="w-4 h-4 m-auto"
                  v-if="isLoading.submitting"
                />
                <span v-else>Yes?</span>
              </VBtn>
            </div>
          </div>
          <div v-else>
            <div class="text-center text-xl" :class="'text-danger'">
              <h3>Shift</h3>
              <span>You have an open shift</span>
            </div>
            <div class="mt-4 flex justify-center">
              <VBtn
                class="flex text-white"
                :color="'primary'"
                @click="closeShift(true)"
              >
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  class="w-4 h-4 m-auto"
                  v-if="isLoading.submitting"
                />
                <span v-else>CLose Shift?</span>
              </VBtn>
              &nbsp;&nbsp;&nbsp;
              <VBtn :color="'warning'" @click="closeShift(false)">
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  class="w-4 h-4 m-auto"
                  v-if="isLoading.submitting"
                />
                <span v-else>Skip Closing Shift!</span>
              </VBtn>
              &nbsp;&nbsp;&nbsp;
              <VBtn
                :color="'info'"
                @click="
                  isCashDrawerPopup = false;
                  menuStore.setIsPopupVisible(false);
                "
                >Cancel!</VBtn
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-16 px-8" v-else>
      <div class="text-center text-xl" :class="'text-danger'">
        <h3>
          No data to create
          <span class="capitalize">{{ tapeType }}</span> report
        </h3>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex flex-col gap-2">
      <div class="grid grid-cols-2 p-1 bg-[#fafafa]">
        <button
          v-for="type in types"
          :key="type.key"
          class="p-2 rounded text-black"
          :class="
            tapeType === type.key
              ? 'bg-primary text-black'
              : 'bg-secondary text-black'
          "
          @click="changeTapeType(type.key)"
        >
          {{ type.title }}
        </button>
      </div>
    </div>
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

  <VDialog v-model="isCashDrawerPopup" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isCashDrawerPopup = false" />

    <VCard>
      <div class="py-16 px-8">
        <div class="text-center text-xl" :class="'text-danger'">
          <h3>Shift</h3>
          <span>You have an open shift</span>
        </div>
        <div class="mt-4 flex justify-center">
          <VBtn
            class="flex text-white"
            :color="'primary'"
            @click="closeShift(true)"
          >
            <LoadingIcon
              icon="tail-spin"
              color="white"
              class="w-4 h-4 m-auto"
              v-if="isLoading.submitting"
            />
            <span v-else>CLose Shift?</span>
          </VBtn>
          &nbsp;&nbsp;&nbsp;
          <VBtn :color="'warning'" @click="closeShift(false)">
            <LoadingIcon
              icon="tail-spin"
              color="white"
              class="w-4 h-4 m-auto"
              v-if="isLoading.submitting"
            />
            <span v-else>Skip Closing Shift!</span>
          </VBtn>
          &nbsp;&nbsp;&nbsp;
          <VBtn
            :color="'info'"
            @click="
              isCashDrawerPopup = false;
              menuStore.setIsPopupVisible(false);
            "
            >Cancel!</VBtn
          >
        </div>
      </div>
    </VCard>
  </VDialog>
</template>
<style>
.my-swal {
  z-index: 10000000;
}

.text-black {
  color: #6e6868 !important;
}
</style>
