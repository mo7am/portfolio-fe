<script setup lang="ts">
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";

const props = defineProps({
  revenues: {
    type: Array<any>,
    default: [],
  },
  year: {
    type: Number,
    default: new Date().getFullYear(),
  },
});

interface Emit {
  (e: "callGetStatistics", value: any, value2: boolean): void;
}

const emit = defineEmits<Emit>();
const year = ref(props.year);
const earning = ref<any[]>([]);
const years = ref<any[]>([]);
const vuetifyTheme = useTheme();

var result = props.revenues.length > 0 ? props.revenues[0] : {},
  i: any;

let yearVal = new Date().getFullYear();
years.value.push(yearVal);
for (i = 1; i < 10; i++) {
  years.value.push(yearVal - i);
}

if (props.revenues.length > 0) {
  for (i = 1; i < props.revenues.length; i++) {
    if (props.revenues[i].price > result.price) {
      result = props.revenues[i];
    }
  }

  let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  function findMonth(month: any) {
    for (let i in props.revenues) {
      if (props.revenues[i].month === month) {
        return props.revenues[i].price.toFixed(2);
      }
    }
    return 0;
  }

  months.forEach((month: any) => {
    earning.value.push(findMonth(month));
  });
}

const setYear = async (yearVal: any) => {
  year.value = yearVal;
};

const onGetStatistics = useDebounceFn((year: any) => {
  emit("callGetStatistics", year, true);
}, 600);

watch(year, (value) => {
  onGetStatistics(value);
});

const series = {
  bar: [
    {
      name: "Earning",
      data: earning.value,
    },
  ],
  line: [
    {
      name: "Last Month",
      data: [20, 10, 30, 16, 24, 5, 40, 23, 28, 5, 30, 28],
    },
    {
      name: "This Month",
      data: [50, 40, 60, 46, 54, 35, 70, 53, 58, 35, 60, 28],
    },
  ],
};

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;

  const labelColor = `rgba(${hexToRgb(currentTheme["on-surface"])},${
    variableTheme["disabled-opacity"]
  })`;
  const legendColor = `rgba(${hexToRgb(currentTheme["on-background"])},${
    variableTheme["high-emphasis-opacity"]
  })`;
  const borderColor = `rgba(${hexToRgb(
    String(variableTheme["border-color"])
  )},${variableTheme["border-opacity"]})`;

  return {
    bar: {
      chart: {
        parentHeightOffset: 0,
        stacked: true,
        type: "bar",
        toolbar: { show: false },
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%",
          borderRadius: 8,
          startingShape: "rounded",
          endingShape: "rounded",
        },
      },
      colors: [
        `rgba(${hexToRgb(currentTheme.primary)}, 1)`,
        `rgba(${hexToRgb(currentTheme.warning)}, 1)`,
      ],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 6,
        lineCap: "round",
        colors: [currentTheme.surface],
      },
      legend: {
        show: true,
        horizontalAlign: "left",
        position: "top",
        fontFamily: "Public Sans",
        markers: {
          height: 12,
          width: 12,
          radius: 12,
          offsetX: -3,
          offsetY: 2,
        },
        labels: {
          colors: legendColor,
        },
        itemMargin: {
          horizontal: 5,
        },
      },
      grid: {
        show: false,
        padding: {
          bottom: -8,
          top: 20,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            fontSize: "13px",
            colors: labelColor,
            fontFamily: "Public Sans",
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          offsetX: -16,
          style: {
            fontSize: "13px",
            colors: labelColor,
            fontFamily: "Public Sans",
          },
        },
        min: 0,
        max: result?.price ?? 300,
        tickAmount: 5,
      },
      responsive: [
        {
          breakpoint: 1700,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "43%",
              },
            },
          },
        },
        {
          breakpoint: 1441,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "52%",
              },
            },
          },
        },
        {
          breakpoint: 1280,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "38%",
              },
            },
          },
        },
        {
          breakpoint: 1025,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "70%",
              },
            },
            chart: {
              height: 390,
            },
          },
        },
        {
          breakpoint: 991,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "38%",
              },
            },
          },
        },
        {
          breakpoint: 850,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "48%",
              },
            },
          },
        },
        {
          breakpoint: 449,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "70%",
              },
            },
            chart: {
              height: 360,
            },
            xaxis: {
              labels: {
                offsetY: -5,
              },
            },
          },
        },
        {
          breakpoint: 394,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "88%",
              },
            },
          },
        },
      ],
      states: {
        hover: {
          filter: {
            type: "none",
          },
        },
        active: {
          filter: {
            type: "none",
          },
        },
      },
    },
    line: {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: "line",
      },
      stroke: {
        curve: "smooth",
        dashArray: [5, 0],
        width: [1, 2],
      },
      legend: {
        show: false,
      },
      colors: [borderColor, currentTheme.primary],
      grid: {
        show: false,
        borderColor,
        padding: {
          top: -30,
          bottom: -15,
          left: 25,
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
});
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="8"
        lg="8"
        :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'"
      >
        <VCardText class="pe-2">
          <div class="flex flex-wrap px-4 justify-between gap-4 custom-style">
            <h5 class="text-h5 mb-6">Revenue Report Of {{ year }}</h5>
            <VBtn variant="outlined" size="small">
              <AppTextField
                style="height: 40px; width: 112px"
                v-model="year"
                type="text"
                placeholder="Year"
              />
              <!-- <span>2022</span> -->
              <template #append>
                <VIcon size="16" icon="tabler-chevron-down" />
              </template>
              <VMenu activator="parent">
                <VList>
                  <VListItem
                    v-for="(item, index) in years"
                    :key="index"
                    :value="index"
                    @click="setYear(item)"
                  >
                    <VListItemTitle>{{ item }}</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
          <VueApexCharts
            :options="chartOptions.bar"
            :series="series.bar"
            height="312"
          />
        </VCardText>
      </VCol>

      <VCol cols="12" sm="4">
        <VCardText
          class="d-flex flex-column justify-center align-center text-center ps-2 h-100"
        >
          <div class="d-flex flex-column mt-8">
            <h3 class="font-weight-medium text-h3">$25,825</h3>
            <p>
              <span class="text-high-emphasis font-weight-medium me-1"
                >Budget:</span
              >
              <span>56,800</span>
            </p>
          </div>

          <VueApexCharts
            :options="chartOptions.line"
            :series="series.line"
            height="100"
          />

          <VBtn class="mt-4"> Increase Budget </VBtn>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
<style>
body .v-card-text .v-btn .v-icon {
  margin-left: -9px !important;
}
body .v-btn:not(.v-btn--icon).v-btn--size-small {
  border-radius: 4px;
  height: 42px;
  width: 126px;
}
.custom-style .v-field--variant-outlined .v-field__outline {
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  margin-top: -2px;
  height: 42px;
  margin-left: -2px;
}
</style>
