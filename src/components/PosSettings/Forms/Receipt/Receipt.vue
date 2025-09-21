<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";
import { GROUPED_FIELDS, OPTIONS_ARRAY_KEYS } from "./data";
import { Toast } from "@/plugins/swal";
import draggable from "vuedraggable";

const menuStore = usePOSSettingsMenu();

const api = inject<any>("api");
const isLoading = reactive({
  initial: false,
  receipt_fields: false,
  submitting: false,
});
const initialData = ref<any>({});
const form = reactive<{
  name: string;
  type: string;
  fields: any[];
}>({
  name: "",
  type: "merchant",
  fields: [],
});
const status = ref(false);
const typeError = ref(false);
const receiptDialog = reactive({
  preview: false,
  fields: [],
});
const fields = ref<any[]>([]);
const requiredFields = ref<any[]>([]);
const selectedFields = ref<any[]>([]);
const fieldsGroupToDeselct = ref<any[]>([]);

const convertValuesToBoolean = (obj: any) => {
  const newObj: any = {};
  for (const key in obj) {
    if (obj[key] === "true") {
      newObj[key] = true;
    } else if (obj[key] === "false") {
      newObj[key] = false;
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

const addPreSelectedFields = (
  pre_selected_fields: any[],
  is_required = false
) => {
  selectedFields.value = pre_selected_fields.map((field) => {
    let obj: any = {
      ...field,
    };
    if (field.name == "Items & Details") {
      if (form.type == "kitchen-bar") {
        if (field?.receipt_data?.options) {
          delete field?.receipt_data?.options[0]?.selected_options.Discounts;
          delete field?.receipt_data?.options[0]?.selected_options.Comment;
        }
        obj.options.otherData = obj.options.otherData.filter(
          (item: any) => item !== "Discounts" && item !== "Comment"
        );

        let arr = obj.options.otherData.filter(
          (item: any) => item !== "Discounts" && item !== "Comment"
        );
        let arr2 = [];
        for (const a of arr) {
          arr2[a] = false;
        }
        obj.options.selected_options = Object.assign({}, arr2);
      }
      if (form.type == "terminal") {
        if (field?.receipt_data?.options) {
          delete field?.receipt_data?.options[0].selected_options.Discounts;
          delete field?.receipt_data?.options[0].selected_options.Comment;
          delete field?.receipt_data?.options[0].selected_options[
            "Highlight modifiers"
          ];
        }
        obj.options.otherData = obj.options.otherData.filter(
          (item: any) =>
            item !== "Discounts" &&
            item !== "Comment" &&
            item !== "Highlight modifiers"
        );
      }
    }

    const fieldOptions = field?.receipt_data?.options[0];

    const display_when_paying_cash: any =
      fieldOptions?.display_when_paying_cash;
    const display_when_paying_other_types: any =
      fieldOptions?.display_when_paying_other_types;

    if (field.type !== "repeatable") {
      const indexInFieldsArray = fields.value.findIndex(
        (f) => f.id === field.id
      );
      if (indexInFieldsArray !== -1)
        fields.value[indexInFieldsArray]["inactive"] = true;
    }
    // var is_required = requiredFields.value?.some(function (obj) {
    //   return obj.name === field.name;
    // });

    // if (indexInFieldsArray !== -1) {
    //   fields.value[indexInFieldsArray]["is_required"] = is_required;
    // }

    const isStyledField = field?.options?.style || field?.options?.direction;
    if (isStyledField) {
      const selected_styles: any[] = fieldOptions?.selected_styles;
      obj = {
        ...obj,
        selected_styles: selected_styles || [],
      };
    }

    if (GROUPED_FIELDS.includes(field.name)) {
      const selected_options: any = convertValuesToBoolean(
        fieldOptions?.selected_options
      );

      obj = {
        ...obj,
        selected_options: selected_options || {},
      };

      if (selected_options["split taxes"]) {
        if (obj?.options?.orderPayments) {
          const index = obj?.options?.orderPayments?.indexOf("Tax");
          if (index !== -1) {
            obj?.options?.orderPayments?.splice(index, 1, "Tax 1", "Tax 2");
          } else {
            const index1 = obj?.options?.orderPayments?.indexOf("Tax 1");
            const index2 = obj?.options?.orderPayments?.indexOf("Tax 2");
            if (index1 !== -1 && index2 === index1 + 1) {
              obj?.options?.orderPayments?.splice(index1, 2, "Tax");
            }
          }
        }
      }
    }

    if (display_when_paying_cash) {
      obj = {
        ...obj,
        display_when_paying_cash,
      };
    }
    if (display_when_paying_other_types) {
      obj = {
        ...obj,
        display_when_paying_other_types,
      };
    }

    if (field.name === "Logo") {
      obj = {
        ...obj,
        options: {
          Logo: {
            image: {
              dataURL: initialData.value?.Receipt?.logo,
            },
            is_editable: false,
          },
        },
      };
    }
    return obj;
  });
};

const openReceipt = () => {
  const receipt = initialData.value?.Receipt;
  if (form.type) {
    if (!fields.value.length) {
      getReceiptFields();
    }

    if (receipt) {
      if (receipt.type != form.type) {
        onFieldsReset();
      } else {
        if (receipt?.fields?.length) {
          addPreSelectedFields(receipt?.fields);
          onFieldsSave(true);
        }
      }
    }
    receiptDialog.preview = true;
  } else {
    typeError.value = true;
  }
};

const getInitialData = async (idToEdit?: number) => {
  isLoading.initial = true;
  try {
    let res: any = {};
    if (idToEdit) {
      res = await api.settings.receipts.getEditReceipt(idToEdit);
    } else {
      res = await api.settings.receipts.getCreateReceipt();
    }
    initialData.value = res?.data;
    const receipt = initialData.value?.Receipt;

    if (receipt) {
      form.name = receipt?.name || "";
      form.type = receipt?.type || "";
      status.value = receipt?.status === "active";
      if (receipt?.fields?.length) {
        if (initialData.value?.requiredFields.length > 0) {
          receipt?.fields?.map(function (field: any) {
            var is_required = initialData.value?.requiredFields?.some(function (
              obj: any
            ) {
              return obj.name === field.name && form.type != "customer";
            });
            field.is_required = is_required;
          });
        }
        addPreSelectedFields(receipt?.fields);
        onFieldsSave(true);
      } else {
        getReceiptFields();
      }
    } else {
      getReceiptFields();
    }
  } catch (error) {}
  isLoading.initial = false;
};

const getFormData = () => {
  const formToSubmit: any = {
    ...form,
    status: status.value ? "active" : "inactive",
  };
  const formKeys = Object.keys(formToSubmit);
  const fields = formToSubmit.fields;
  const formData = new FormData();
  formKeys.forEach((key) => {
    if (key === "fields") {
      if (fields.length) {
        fields.forEach((field: any, fieldIndex: number) => {
          formData.append(`fields[${fieldIndex}][id]`, field.id);
          const optionsKeys = Object.keys(field?.options || {});
          if (optionsKeys.length) {
            optionsKeys.forEach((optionKey: any) => {
              const optionKeyToSend = `fields[${fieldIndex}][options][0][${optionKey}]`;
              const optionValue = field.options[optionKey];

              if (OPTIONS_ARRAY_KEYS.includes(optionKey)) {
                optionValue.forEach((value: any, valIndex: number) => {
                  formData.append(`${optionKeyToSend}[${valIndex}]`, value);
                });
              } else if (optionKey === "selected_options") {
                Object.keys(optionValue).forEach((key) => {
                  formData.append(
                    `${optionKeyToSend}[${key}]`,
                    optionValue[key]
                  );
                });
              } else {
                if (optionKey === "Logo") {
                  const isEditableValue = JSON.stringify(
                    Boolean(optionValue?.is_editable) ? 1 : 0
                  );
                  formData.append(
                    `${optionKeyToSend}[is_editable]`,
                    isEditableValue
                  );
                  formData.append(
                    `${optionKeyToSend}[image]`,
                    optionValue?.image
                  );
                } else {
                  formData.append(optionKeyToSend, optionValue);
                }
              }
            });
          } else {
            // has_no_options is dummy data required for BE validation
            formData.append(
              `fields[${fieldIndex}][options][0][has_no_options]`,
              "true"
            );
          }
        });
      } else {
        formData.append("fields", "");
      }
    } else {
      formData.append(key, formToSubmit[key]);
    }
  });

  return formData;
};

const checkActiveType = async () => {
  removeError("type");
  try {
    const res = await api.settings.receipts.checkActiveType(form.type);
  } catch (error: any) {
    if (error.response.status == 400) {
      Toast.fire({
        icon: "error",
        padding: "10px",
        background: "#fff",
        html: `<span style="font-size:14px">${error.response.data.message}</span>`,
      });
    }
  }
};

const onSubmit = async () => {
  isLoading.submitting = true;
  const formToSubmit = getFormData();

  try {
    const idToEdit = menuStore.getIDToEdit;
    let res: any = {};

    if (idToEdit) {
      res = await api.settings.receipts.editReceipt(idToEdit, formToSubmit);
    } else {
      res = await api.settings.receipts.createReceipt(formToSubmit);
    }

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Receipt ${
        idToEdit ? "Updated" : "Created"
      } Successfully!</span>`,
    });

    menuStore.setIsPopupVisible(false);
    menuStore.setIsGetData();
  } catch (error) {}
  isLoading.submitting = false;
};

const filterSelectedSingleFields = () => {
  fields.value.forEach((field, index) => {
    if (field.type !== "repeatable") {
      const fieldID = field.id;
      const selected_field_index = selectedFields.value.findIndex(
        (f) => f.id === fieldID
      );

      if (selected_field_index !== -1) {
        fields.value[index]["inactive"] = true;
      }
    }
  });
};

const getReceiptFields = async () => {
  isLoading.receipt_fields = true;
  try {
    const res = await api.settings.receipts.getReceiptTypeFields(form.type);

    fields.value = res?.data?.fields;
    requiredFields.value = res?.data?.requiredFields;
    fields.value.map(function (field: any) {
      var is_required = requiredFields.value?.some(function (obj) {
        return obj.name === field.name && form.type != "customer";
      });
      field.is_required = is_required;
    });
    requiredFields.value.map(function (field: any) {
      field.is_required = true;
    });
    if (selectedFields.value.length) {
      filterSelectedSingleFields();
    }

    const receipt = initialData.value?.Receipt;

    if (form.type != "customer") {
      if (!receipt) {
        if (fields.value?.length && form.fields.length) {
          addPreSelectedFields(fields.value);
          onFieldsSave(false);
        } else {
          addPreSelectedFields(res?.data?.requiredFields, true);
          onFieldsSave(false);
        }
      } else {
        if (form.fields.length) {
          addPreSelectedFields(receipt?.fields);
          onFieldsSave(false);
        } else {
          addPreSelectedFields(res?.data?.requiredFields);
          onFieldsSave(false);
        }
      }
    }
  } catch (error) {}
  isLoading.receipt_fields = false;
};

const onSwitchClick = () => {
  status.value = !status.value;
  if (status.value) {
    checkActiveType();
  }
};

const changeType = () => {
  status.value = false;
  selectedFields.value = [];
  form.fields = [];
};

function isEmpty(obj: any) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

const onFieldsSave = (isClosedPopup: any) => {
  const fieldsToSave: any[] = selectedFields.value.map((field) => {
    const id = field.id;
    const selected_styles: any = field?.selected_styles;
    const selected_options: any = !isEmpty(field?.selected_options)
      ? field?.selected_options
      : field?.options?.selected_options;
    const orderPayments: any = field?.options?.orderPayments;
    const shippingData: any = field?.options?.shippingData;
    const display_when_paying_cash = field?.display_when_paying_cash;
    const display_when_paying_other_types =
      field?.display_when_paying_other_types;
    const logo = field?.options?.Logo;

    let options: any = {};

    if (field.has_options) {
      if (selected_styles?.length) {
        options = {
          selected_styles,
        };

        if (shippingData) {
          options = {
            ...options,
            shippingData,
          };
        }
      }
      if (selected_options) {
        options = {
          ...options,
          selected_options,
        };

        if (orderPayments) {
          options = {
            ...options,
            orderPayments,
          };
        }
      }

      if (display_when_paying_cash) {
        options = {
          ...options,
          display_when_paying_cash,
        };
      }

      if (display_when_paying_other_types) {
        options = {
          ...options,
          display_when_paying_other_types,
        };
      }
    } else {
      if (logo) {
        options = {
          ...options,
          Logo: logo,
        };
      }
    }

    return {
      id,
      options,
    };
  });

  form.fields = fieldsToSave;
  if (isClosedPopup) {
    receiptDialog.preview = false;
  }
};

const onFieldsReset = () => {
  selectedFields.value = [];
  form.fields = [];
  fields.value = [];
  requiredFields.value = [];
  getReceiptFields();
  fields.value.forEach((field) => {
    field["inactive"] = false;
  });
};

const onTypeChange = () => {
  getReceiptFields();
  typeError.value = false;
};

const deSelectField = (field: any, index: number, is_group: boolean) => {
  if (is_group) {
    index = selectedFields.value.findIndex(
      (selectedField) => selectedField.id === field.id
    );
  }
  selectedFields.value.splice(index, 1);

  let repeatable = 0;

  selectedFields.value.forEach((fieldObject: any) => {
    if (field.id == fieldObject.id) {
      repeatable++;
    }
  });

  if (field.type != "repeatable" || repeatable == 0) {
    const deselctedID = field.id;
    const indexInFieldsArray = fields.value.findIndex(
      (field) => field.id === deselctedID
    );
    if (indexInFieldsArray !== -1) {
      fields.value[indexInFieldsArray]["inactive"] = false;
    }
  }
};

const addFieldToDeselectedGroup = (field: any, index: number) => {
  // const addedIndex = fieldsGroupToDeselct.value.findIndex(
  //   (field_id) => field_id === field.id
  // );

  const addedIndex = fieldsGroupToDeselct.value.findIndex(function (
    fieldGroup: any
  ) {
    return fieldGroup.field.id == field.id && fieldGroup.index == index;
  });

  if (addedIndex === -1) {
    fieldsGroupToDeselct.value.push({ index: index, field: field });
  } else {
    fieldsGroupToDeselct.value.splice(addedIndex, 1);
  }
};

const deselectByGroup = () => {
  fieldsGroupToDeselct.value.forEach((fieldGroup) => {
    deSelectField(fieldGroup.field, fieldGroup.index, true);
  });
  fieldsGroupToDeselct.value = [];
};

watch(
  () => menuStore.getIDToEdit,
  (value) => {
    getInitialData(value);
  },
  {
    immediate: true,
  }
);

watch(
  () => form.type,
  (value) => {
    if (value !== initialData.value?.Receipt?.type) {
      onTypeChange();
    }
  }
);
</script>

<template>
  <VForm ref="formRef" @submit.prevent="onSubmit">
    <div class="p-4 flex justify-center items-center" v-if="isLoading.initial">
      <LoadingIcon icon="tail-spin" class="w-6 h-6" color="orange" />
    </div>
    <div class="flex flex-col gap-4 py-4" v-else>
      <div id="name">
        <AppTextField
          type="text"
          v-model="form.name"
          placeholder="Name"
          label="Name"
        />
      </div>
      <div id="type">
        <AppSelect
          v-model="form.type"
          :items="initialData?.ReceiptTypes"
          :error="typeError"
          label="Type"
          item-title="name"
          item-value="value"
          form-id="type"
          placeholder="Select Type"
          @update:model-value="changeType"
          :showHint="true"
          messageHint="Change type will reset an options"
          :isRequired="true"
        />
        <div class="mt-2 text-danger" v-if="typeError">Value is required</div>
      </div>
      <div class="flex justify-between">
        <div class="flex flex-col">
          <label class="text-base" for="status">Active</label>
          <span class="text-slate-300 text-xs"> Allow to disable Receipt </span>
        </div>
        <div>
          <VSwitch
            v-model="status"
            id="status"
            color="success"
            @click="onSwitchClick"
            class="cursor-pointer"
          />
        </div>
      </div>
      <div id="fields">
        <VBtn type="button" variant="text" class="w-full" @click="openReceipt">
          Open Receipt</VBtn
        >
      </div>
    </div>
    <div class="flex">
      <VBtn type="submit" class="w-[120px] ml-auto" v-if="!isLoading.initial">
        <LoadingIcon
          icon="tail-spin"
          class="w-4 h-4"
          color="white"
          v-if="isLoading.submitting"
        />
        <span v-else>Save</span>
      </VBtn>
    </div>
  </VForm>

  <VDialog v-model="receiptDialog.preview" width="1200">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="receiptDialog.preview = false" />

    <VCard>
      <div class="py-8 px-4">
        <div
          class="p-4 flex justify-center items-center"
          v-if="isLoading.receipt_fields"
        >
          <LoadingIcon icon="tail-spin" class="w-6 h-6" color="orange" />
        </div>
        <ReceiptFields
          :type="form.type"
          :fields="fields"
          :requiredFields="requiredFields"
          :selectedFields="selectedFields"
          :showDeleteBtn="!!fieldsGroupToDeselct.length"
          @deselectByGroup="deselectByGroup"
          @save="onFieldsSave(true)"
          @reset="onFieldsReset"
          v-else
        >
          <draggable
            ghost-class="ghost"
            v-model="selectedFields"
            group="fields"
            item-key="id"
          >
            <template #item="{ element: field, index: index }">
              <StyledField
                :field="field"
                :is_used="true"
                :isDeselectedByGroup="fieldsGroupToDeselct.some((fieldObject: any) => fieldObject.field.id === field.id && fieldObject.index === index)"
                @deSelectField="deSelectField"
                @deSelectFieldByGroup="addFieldToDeselectedGroup"
                :keyVal="index"
              />
            </template>
          </draggable>
        </ReceiptFields>
      </div>
    </VCard>
  </VDialog>
</template>
