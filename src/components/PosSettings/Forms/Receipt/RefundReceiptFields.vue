<script setup lang="ts">
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import placeholder from "@/assets/images/placeholder.png";

const props = defineProps({
  transaction: {
    type: Object,
    default: {},
  },
  posSetting: {
    type: Object,
    default: {},
  },
});
</script>
<template>
  <div
    class="mt-4 col-span-full lg:mt-0 lg:col-span-1 sm:border-r sm:px-10"
    style="width: 492px; margin-left: -38px"
  >
    <div
      id="section-print"
      class="flex flex-col bg-white font-mono md:w-[265px] mx-auto lg:w-auto"
    >
      <div class="">
        <div>
          <!----><!----><!---->
          <div class="flex flex-col gap-">
            <div class="text-2xl text-center text-black capitalize">
              <h3>Amount</h3>
              <h1 style="font-weight: bold; font-size: 30px" class="text-black">
                ${{ props.transaction.total_amount.toFixed(2) }}
              </h1>
            </div>
          </div>
          <br />
          <div class="">
            <div class="text-center gap-2 capitalize" v-if="props.posSetting">
              {{ props.posSetting.name }}
            </div>
          </div>
          <br />
          <!----><!----><!----><!----><!----><!---->
        </div>
      </div>
      <div class="">
        <div>
          <div class="flex justify-between gap-2">
            <div>{{ props.transaction.created_at }}</div>
            <div>{{ props.transaction.created_time_at }}</div>
          </div>
          <!----><!----><!----><!----><!----><!----><!----><!----><!---->
        </div>
      </div>
      <br />
      <div class="text-center">
        <span style="font-weight: bold" class="text-black">Refund</span>
      </div>
      <br />
      <div class="">
        <div>
          <div class="flex justify-between gap-2">
            <div>ReferenceId:</div>
            <div>#{{ props.transaction.id }}</div>
          </div>
        </div>
      </div>
      <div class="">
        <div>
          <div class="flex justify-between gap-2">
            <div>Cashier:</div>
            <div class="capitalize">{{ props.transaction.user.name }}</div>
          </div>
        </div>
      </div>
      <div class="">
        <div>
          <!----><!----><!---->
          <div class="flex flex-col gap-">
            <div
              class="text-center text-black uppercase border-b-[2px] border-dashed"
            ></div>
          </div>
          <!----><!----><!----><!----><!----><!---->
        </div>
      </div>
      <br />
      <div class="">
        <div>
          <div class="flex justify-between gap-2">
            <div>{{ props.transaction.refund_reason }}</div>
          </div>
        </div>
      </div>
      <br />
      <div v-if="props.transaction.refundedItems.length">
        <br />
        <span style="color: black; font-size: 17px; font-weight: bold">
          Items
        </span>
        <br />
        <PerfectScrollbar :options="{ wheelPropagation: false }">
          <div
            style="margin-top: -15px"
            class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
          >
            <div
              style="height: 86px"
              class="p-4 rounded-lg shadow flex items-center justify-between gap-4"
              v-for="item in props.transaction.refundedItems"
            >
              <div
                class="flex justify-between"
                v-if="item.orderItem.type == 'item'"
              >
                <img
                  :src="
                    item.orderItem?.product?.image
                      ? item?.orderItem?.product?.image
                      : placeholder
                  "
                  class="w-[40px] h-[40px] rounded"
                />
                <div class="flex-col h-full pl-4">
                  <h6 class="mb-0">
                    <span>{{ item.orderItem.name }} </span>
                  </h6>
                  <small class="text-muted d-block">
                    <span class="mb-0">
                      <span v-if="item.orderItem.product.categories.length > 5">
                        <span
                          v-for="(
                            category, index
                          ) in item.orderItem.product.categories.slice(0, 5)"
                          ><span style="color: #0ebcf5">{{
                            category.name
                          }}</span>
                          <span
                            v-if="
                              index !=
                              Object.keys(
                                item.orderItem.product.categories.slice(0, 5)
                              ).length -
                                1
                            "
                          >
                            -
                          </span>
                          <span v-else> ....</span>
                          <VTooltip
                            open-delay="500"
                            location="top"
                            activator="parent"
                          >
                            <span
                              v-for="(
                                category, index
                              ) in item.orderItem.product.categories.slice(
                                0,
                                10
                              )"
                              ><span>{{ category.name }}</span>
                              <span
                                v-if="
                                  index !=
                                  Object.keys(
                                    item.orderItem.product.categories.slice(
                                      0,
                                      10
                                    )
                                  ).length -
                                    1
                                "
                              >
                                ,
                              </span></span
                            >
                          </VTooltip>
                        </span>
                      </span>
                      <span
                        class="mb-0"
                        v-else-if="
                          item.orderItem.product.categories.length <= 5
                        "
                      >
                        <span
                          v-for="(
                            category, index
                          ) in item.orderItem.product.categories.slice(0, 5)"
                          ><span style="color: #0ebcf5"
                            >{{ category.name }}
                            <span
                              v-if="
                                index !=
                                Object.keys(
                                  item.orderItem.product.categories.slice(0, 5)
                                ).length -
                                  1
                              "
                            >
                              -
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </small>
                </div>
              </div>
              <div class="flex justify-between" v-else>
                <img :src="placeholder" class="w-[40px] h-[40px] rounded" />
                <div class="flex-col h-full pl-4">
                  <h6 class="mb-0">
                    <span>{{ item?.orderItem?.name ?? "Manual Entry" }} </span>
                  </h6>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="p-4 flex items-center justify-between gap-4"></div>
                <div class="flex flex-col justify-between h-full">
                  <small class="text-muted d-block"
                    ><i class="fas fa-clock"></i>
                    {{ item.orderItem.created_time_at }}
                  </small>
                  <h6 class="mb-0" style="color: black">
                    ${{ makeFLoat(item.orderItem.total_amount, "") }}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
      <br />
    </div>
    <div class="flex justify-between mt-4">
      <div class="flex justify-end mt-4">
        <VBtn class="btn btn-secondary w-fit px-8" v-print="'#section-print'">
          Print
        </VBtn>
      </div>
      <div class="flex justify-start mt-4">
        <VBtn
          class="btn btn-primary w-fit px-8"
          @click="$emit('closeViewRefundReceiptPopup')"
        >
          Finish
        </VBtn>
      </div>
    </div>
  </div>
</template>
