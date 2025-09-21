<script setup lang="ts">
import Lucide from "../Lucide/Lucide.vue";

const props = defineProps({
  items: {
    type: Array<any>,
    default: [],
  },
  modelValue: {
    type: null,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Select Option",
  },
  itemTitle: {
    type: String,
    default: "name",
  },
  itemValue: {
    type: String,
    default: "id",
  },
  disabledKey: {
    type: String,
    default: "",
  },
  isWithSubArray: {
    type: Boolean,
    default: false,
  },
  preSelectedItem: {
    type: null,
    default: "",
  },
  hasSearch: {
    type: Boolean,
    default: false,
  },
  hasClosed: {
    type: Boolean,
    default: false,
  },
  hasCheckboxes: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const filteredOptions = computed(() => {
  if (props.hasSearch) {
    return props.items.filter((item) => {
      return (
        item?.name?.toLowerCase()?.includes(searchQuery.value.toLowerCase()) ||
        item?.path
          ?.join(",")
          ?.toLowerCase()
          ?.includes(searchQuery.value.toLowerCase())
      );
    });
  } else {
    return props.items;
  }
});

const searchQuery = ref("");
const emit = defineEmits(["update:modelValue"]);
const showMenu = ref(false);
const isMenuOpen = ref(false);
const selectedValues = ref<any>({});
const selectedItems = ref<any>(props.preSelectedItem);
const hasCurrentItem = ref<any>(
  props.preSelectedItem.id == undefined ? false : true
);

const closeDropdown = () => {
  showMenu.value = false;
  isMenuOpen.value = false;
  searchQuery.value = "";
};

const getSelectedArray = (key: string) => {
  if (selectedItems.value?.length)
    return selectedItems.value?.map((item: any) => item[key]);
  return [];
};

const selectItem = (item: any) => {
  if (item.is_disabled) {
    showMenu.value = true;
    isMenuOpen.value = true;
    return;
  }
  const itemId = item[props.itemValue];
  const isDeselectItem = selectedValues.value[itemId];
  let modelValue = null;

  if (isDeselectItem) {
    isMenuOpen.value = true;
    if (props.multiple) {
      const itemIdx = selectedItems.value.findIndex(
        (option: any) => option?.id === item?.id
      );

      selectedItems.value.splice(itemIdx, 1);

      modelValue = getSelectedArray(props.itemValue);
    } else {
      selectedItems.value = {};
    }
  } else {
    if (props.multiple) {
      if (!selectedItems.value?.length) {
        selectedItems.value = [
          {
            ...item,
          },
        ];
      } else {
        selectedItems.value.push({
          ...item,
        });
      }

      modelValue = getSelectedArray(props.itemValue);

      showMenu.value = true;
      isMenuOpen.value = true;
    } else {
      selectedValues.value = {};
      selectedItems.value = item;

      modelValue = itemId;

      closeDropdown();
    }
  }
  selectedValues.value[itemId] = !isDeselectItem;
  emit("update:modelValue", modelValue);
};

const onOpenSearchClick = () => {
  isMenuOpen.value = true;
};

const removeOption = () => {
  if (selectedItems.value?.id !== undefined) {
    hasCurrentItem.value = false;
    selectedItems.value = {};
    showMenu.value = true;
    selectedValues.value = {};
    emit("update:modelValue", null);
    return;
  }
};

const onCloseSearchClick = (event: any) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isMenuOpen.value = false;
  }
};

const handleClickEvent = (e: MouseEvent) => {
  onOutsideClick(e, closeDropdown);
};

const selectedInputValue = computed(() => {
  if (props.multiple) {
    return getSelectedArray(props.itemTitle).join(", ");
  } else {
    return selectedItems.value[props.itemTitle];
  }
});

watch(showMenu, (value) => {
  if (isMenuOpen.value) {
    showMenu.value = true;
  } else {
    if (!value) {
      isMenuOpen.value = false;
      searchQuery.value = "";
    }
  }
});

watch(selectedItems, (value) => {
  hasCurrentItem.value = value.id !== undefined ? true : false;
});

onMounted(() => {
  if (props.multiple) {
    if (props.preSelectedItem?.length) {
      props.preSelectedItem.forEach((item: any) => {
        selectedValues.value[item[props.itemValue]] = true;
      });
    }
  } else {
    const pre_selected_value = props.preSelectedItem[props.itemValue];
    if (pre_selected_value) selectedValues.value[pre_selected_value] = true;
  }
  window.addEventListener("click", handleClickEvent);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickEvent);
});
</script>
<template>
  <div>
    <VLabel>
      {{ label }}<span v-if="$attrs.isRequired" class="required-icon">*</span>
    </VLabel>
    <VMenu v-model="showMenu">
      <template #activator="{ props }">
        <AppTextField
          as="button"
          v-bind="props"
          type="text"
          class="mt-2 !cursor-pointer"
          :placeholder="placeholder"
          :value="selectedInputValue || ''"
          readonly
          :isSelectedItem="hasCurrentItem"
          :hasClosedBtn="hasClosed"
          @callRemoveOption="removeOption"
        />
      </template>

      <VCard id="popup-content">
        <div
          class="p-2 flex flex-col gap-1"
          :class="filteredOptions.length > 4 ? 'h-80 overflow-y-auto' : ''"
        >
          <AppTextField
            v-if="hasSearch"
            v-model="searchQuery"
            placeholder="Search..."
            id="text_search"
            @click="onOpenSearchClick"
            @blur="onCloseSearchClick"
          />
          <div
            v-for="(item, index) in filteredOptions"
            :key="item[itemValue] || index"
            class="p-2.5 px-4 text-sm rounded-sm transition"
            :class="[
              {
                'bg-primary': selectedValues[item[itemValue]],
                'flex gap-2 items-start': hasCheckboxes,
              },
              disabledKey && item[disabledKey]
                ? 'opacity-70 cursor-not-allowed'
                : ' hover:bg-secondary hover:text-primary cursor-pointer',
            ]"
            @click="selectItem(item)"
          >
            <div
              class="w-4 h-4 mt-1.5 flex rounded-sm border bg-white shadow-sm"
              v-if="hasCheckboxes"
            >
              <Lucide
                icon="Check"
                class="w-4 h-4 m-auto text-primary"
                v-if="selectedValues[item[itemValue]]"
              />
            </div>

            <div>
              <div v-if="isWithSubArray" class="font-black text-base">
                {{ item[itemTitle] }}
              </div>
              <div v-else>
                {{ item[itemTitle] }}
              </div>
              <div v-if="isWithSubArray">
                <p v-if="item.path.length > 4" class="dots" variant="outlined">
                  {{ item.path.slice(0, 4).join(" > ") + " ..." }}
                  <VTooltip open-delay="500" location="top" activator="parent">
                    <span>{{ item.path.join(" > ") }}</span>
                  </VTooltip>
                </p>
                <p v-else>{{ item.path.join(" > ") }}</p>
              </div>
            </div>
          </div>
          <div
            v-if="filteredOptions.length == 0"
            class="p-2.5 px-4 text-sm rounded-sm transition hover:bg-secondary text-center"
          >
            No items found
          </div>
        </div>
      </VCard>
    </VMenu>
  </div>
</template>
