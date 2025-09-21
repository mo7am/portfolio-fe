<script setup lang="ts">
import { useTapeMenu } from "@/stores/tapes-menu";

const props = defineProps({
  tape: {
    type: Object,
    default: {},
  },
  isSelectedTape: {
    type: Boolean,
    default: false,
  },
});

const menuStore = useTapeMenu();

const fn = () => {
  if (props.isSelectedTape) {
    menuStore.setIsPopupVisible(false);
  }
};

document.body.addEventListener("click", fn, true);
</script>
<template>
  <VIcon
    style="margin-top: -20px; margin-left: 36px !important"
    v-print="'#section-to-print'"
    class="flip-in-rtl stepper-chevron-indicator mx-6 cursor-pointer"
    size="24"
    icon="tabler-printer"
    :color="'warning'"
  />
  <div
    class="mt-4 col-span-full lg:mt-0 lg:col-span-1 sm:border-r sm:px-10"
    id="section-to-print"
  >
    <div
      class="flex flex-col bg-white font-mono md:w-[265px] mx-auto lg:w-auto"
    >
      <div class="">
        <div>
          <!----><!----><!---->
          <div class="flex flex-col gap-">
            <div
              class="text-2xl text-center text-black uppercase border-b-[2px] border-dashed"
            >
              <h3>
                {{
                  tape.type == "x tape"
                    ? "X Report"
                    : tape.type == "z tape"
                    ? "Z Report"
                    : "X Operator Report"
                }}
              </h3>
            </div>
          </div>
          <!----><!----><!----><!----><!----><!---->
        </div>
      </div>
      <div class="" v-if="tape.setting">
        <div>
          <div class="flex justify-between gap-2">
            <div>INVENTORY NAME:</div>
            <div>{{ tape.setting.name }}</div>
          </div>
          <!----><!----><!----><!----><!----><!----><!----><!----><!---->
        </div>
      </div>

      <div class="" v-if="tape.cashDrawer">
        <div>
          <div class="flex justify-between gap-2">
            <div>OPEN AT:</div>
            <div>{{ tape.cashDrawer.created_at }}</div>
          </div>
          <!----><!----><!----><!----><!----><!----><!----><!----><!---->
        </div>
      </div>
      <div class="">
        <div>
          <div class="flex justify-between gap-2">
            <div>REPORTED:</div>
            <div>{{ tape.created_at }}</div>
          </div>
          <!----><!----><!----><!----><!----><!----><!----><!----><!---->
        </div>
      </div>
      <div class="">
        <div>
          <div class="flex justify-between gap-2">
            <div>POS:</div>
            <div>PPS</div>
          </div>
          <!----><!----><!----><!----><!----><!----><!----><!----><!---->
        </div>
      </div>
      <div class="">
        <div>
          <div class="flex justify-between gap-2">
            <div>POS ID:</div>
            <div>#7588</div>
          </div>
          <!----><!----><!----><!----><!----><!----><!----><!----><!---->
        </div>
      </div>
      <div v-if="tape.sales > 0">
        <div v-if="tape.cashDrawer">
          <div class="">
            <div>
              <!----><!----><!---->
              <div class="flex flex-col gap-">
                <div
                  class="text-center text-black uppercase border-b-[2px] border-dashed"
                >
                  <h3>DRAWER TOTALS</h3>
                </div>
              </div>
              <!----><!----><!----><!----><!----><!---->
            </div>
          </div>
          <div class="">
            <div>
              <div class="flex justify-between gap-2">
                <div>OPENING:</div>
                <div>${{ makeFLoat(tape.opening_cash_drawer, "") }}</div>
              </div>
              <!----><!----><!----><!----><!----><!----><!----><!----><!---->
            </div>
          </div>
          <div class="" v-if="tape.in_cashdrawer > 0">
            <div>
              <div class="flex justify-between gap-2">
                <div>In:</div>
                <div>${{ makeFLoat(tape.in_cashdrawer, "") }}</div>
              </div>
              <!----><!----><!----><!----><!----><!----><!----><!----><!---->
            </div>
          </div>
          <div class="" v-if="tape.in_cashdrawer > 0">
            <div>
              <div class="flex justify-between gap-2">
                <div>Out:</div>
                <div>${{ makeFLoat(tape.out_cashdrawer, "") }}</div>
              </div>
              <!----><!----><!----><!----><!----><!----><!----><!----><!---->
            </div>
          </div>
          <div class="">
            <div>
              <div class="flex justify-between gap-2">
                <div>TOTAL AUTO:</div>
                <div>${{ makeFLoat(tape.total_auto, "") }}</div>
              </div>
              <!----><!----><!----><!----><!----><!----><!----><!----><!---->
            </div>
          </div>
          <div class="">
            <div>
              <div class="flex justify-between gap-2">
                <div>TOTAL MANUAL:</div>
                <div>${{ makeFLoat(tape.total_manual, "") }}</div>
              </div>
              <!----><!----><!----><!----><!----><!----><!----><!----><!---->
            </div>
          </div>
        </div>
        <div class="">
          <div>
            <!----><!----><!---->
            <div class="flex flex-col gap-">
              <div
                class="text-center text-black uppercase border-b-[2px] border-dashed"
              >
                <h3>PAYMENT TYPE TOTALS</h3>
              </div>
            </div>
            <!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div
              class="flex justify-between gap-2"
              v-for="transaction in tape.transactions"
            >
              <div>{{ capitalize(transaction.payment_method) }}</div>
              <div>
                ({{ transaction.payment_type_count }}) ${{
                  makeFLoat(transaction.total_amount, "")
                }}
              </div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <!----><!----><!---->
            <div class="flex flex-col gap-">
              <div
                class="text-center text-black uppercase border-b-[2px] border-dashed"
              >
                <h3>TAX REPORT</h3>
              </div>
            </div>
            <!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2" v-for="tax in tape.taxes">
              <div>{{ capitalize(tax.name) }}</div>
              <div>${{ makeFLoat(tax.total_amount, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Total Tax</div>
              <div>${{ makeFLoat(tape.total_tax ?? 0, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
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
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Taxable Sales</div>
              <div>${{ makeFLoat(tape.taxable_sales, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Tax Exempt Sales</div>
              <div>${{ makeFLoat(tape.tax_exempt_sales, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Total Sales and Tax</div>
              <div>${{ makeFLoat(tape.total_sales_and_tax, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <!----><!----><!---->
            <div class="flex flex-col gap-">
              <div
                class="text-center text-black uppercase border-b-[2px] border-dashed"
              >
                <h3>CATEGORY SALES</h3>
              </div>
            </div>
            <!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div
              class="flex justify-between gap-2"
              v-for="tapeProduct in tape.products"
            >
              <div v-if="tapeProduct.type == 'item'">
                <span
                  v-if="tapeProduct?.product?.categories.length"
                  v-for="(category, index) in tapeProduct?.product?.categories"
                  ><span>{{ category.name }}</span>
                  <span
                    v-if="
                      index !=
                      Object.keys(tapeProduct.product.categories).length - 1
                    "
                    >,
                  </span></span
                >
              </div>
              <div v-else>Free</div>
              <div>
                ({{ tapeProduct.count }}) ${{
                  makeFLoat(tapeProduct.total_amount, "")
                }}
              </div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
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
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Items Subtotal</div>
              <div>${{ makeFLoat(tape.items_subtotal, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="" v-if="tape.discounts != 0">
          <div>
            <div class="flex justify-between gap-2">
              <div>Discounts</div>
              <div>-${{ makeFLoat(tape.discounts, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Subtotal</div>
              <div>${{ makeFLoat(tape.subtotal, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Tax</div>
              <div>${{ makeFLoat(tape.total_tax, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Tips</div>
              <div>${{ makeFLoat(tape.tips, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Delivery Fees</div>
              <div>${{ makeFLoat(tape.delivery_fees, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
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
        <hr />
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Total</div>
              <div>${{ makeFLoat(tape.total, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <!----><!----><!---->
            <div class="flex flex-col gap-">
              <div
                class="text-center text-black uppercase border-b-[2px] border-dashed"
              >
                STATISTICS
              </div>
            </div>
            <!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Items</div>
              <div>{{ tape.items }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Sales</div>
              <div>{{ tape.sales }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Refunds</div>
              <div>{{ tape.refunds }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Voids</div>
              <div>{{ tape.voids }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <!----><!----><!---->
            <div class="flex flex-col gap-">
              <div
                class="text-center text-black uppercase border-b-[2px] border-dashed"
              >
                OPERATORS SALES
              </div>
            </div>
            <!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div
              class="flex justify-between gap-2"
              v-for="operator in tape.operators"
            >
              <div>{{ operator?.user?.name }}</div>
              <div>${{ makeFLoat(operator.total_amount, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <!----><!----><!---->
            <div class="flex flex-col gap-">
              <div
                class="text-center text-black uppercase border-b-[2px] border-dashed"
              >
                SERVERS SALES
              </div>
            </div>
            <!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div
              class="flex justify-between gap-2"
              v-for="operator in tape.operators"
            >
              <div
                v-if="operator.total_amount - operator.not_creator_amount <= 0"
              >
                {{ operator?.user?.name }}
              </div>
              <div v-else>
                {{ operator?.user?.name }}
              </div>
              <div
                v-if="operator.total_amount - operator.not_creator_amount <= 0"
              >
                ${{ makeFLoat(operator.total_amount, "") }}
              </div>
              <div v-else>
                ${{
                  makeFLoat(
                    operator.total_amount - operator.not_creator_amount,
                    ""
                  )
                }}
              </div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <!----><!----><!---->
            <div class="flex flex-col gap-">
              <div
                class="text-center text-black uppercase border-b-[2px] border-dashed"
              >
                SERVER TIPOUTS
              </div>
            </div>
            <!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Cash Payments</div>
              <div>${{ makeFLoat(tape.cash_payment, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Total Cash</div>
              <div>${{ makeFLoat(tape.total_cash, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Cash Income</div>
              <div>${{ makeFLoat(tape.cash_income, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Cash Adjustment</div>
              <div>${{ makeFLoat(tape.cash_adjustment, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>Non-Cash Tips</div>
              <div>${{ makeFLoat(tape.non_cash_tips, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
        <div class="">
          <div>
            <div class="flex justify-between gap-2">
              <div>All Tips Sum</div>
              <div>${{ makeFLoat(tape.all_tips_sum, "") }}</div>
            </div>
            <!----><!----><!----><!----><!----><!----><!----><!----><!---->
          </div>
        </div>
      </div>
      <div class="" v-else>
        <div>
          <div
            class="flex justify-between gap-2"
            v-for="operator in tape.operators"
          >
            <div>
              {{ operator?.user?.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
