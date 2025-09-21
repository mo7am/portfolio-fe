<script lang="ts" setup>
import { GROUPED_FIELDS } from "@/components/PosSettings/Forms/Receipt/data";

const props = defineProps({
  receipt: {
    type: Object,
    default: {},
  },
  type: {
    type: String,
    default: "",
  },
  order: {
    type: Object,
    default: {},
  },
  transaction: {
    type: Object,
    default: {},
  },
  posSetting: {
    type: Object,
    default: {},
  },
});

const api = inject<any>("api");
const selectedFields = ref<any[]>([]);
const fields = ref<any[]>([]);

const getReceiptFields = async () => {
  try {
    const res = await api.settings.receipts.getReceiptTypeFields(props.type);
    fields.value = res?.data?.fields;

    if (selectedFields.value.length) {
      filterSelectedSingleFields();
    }
  } catch (error) {
    console.log(error);
  }
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

const addPreSelectedFields = (pre_selected_fields: any[]) => {
  selectedFields.value = pre_selected_fields.map((field) => {
    let obj: any = {
      ...field,
    };

    if (field.name == "Items & Details") {
      if (props.type == "kitchen-bar") {
        delete field?.receipt_data?.options[0].selected_options.Discounts;
        delete field?.receipt_data?.options[0].selected_options.Comment;
        obj.options = obj.options.otherData.filter(
          (item: any) => item !== "Discounts" && item !== "Comment"
        );
      }
      if (props.type == "terminal") {
        delete field?.receipt_data?.options[0].selected_options.Discounts;
        delete field?.receipt_data?.options[0].selected_options.Comment;
        delete field?.receipt_data?.options[0].selected_options[
          "Highlight modifiers"
        ];
        obj.options = obj.options.otherData.filter(
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
              dataURL: props?.receipt?.logo,
            },
            is_editable: false,
          },
        },
      };
    }
    return obj;
  });
};

getReceiptFields();
addPreSelectedFields(props.receipt?.fields);
</script>

<template>
  <ReceiptTemplate
    :order="props.order"
    :transaction="props.transaction"
    :posSetting="posSetting"
    :fields="selectedFields"
    class="md:w-[265px] mx-auto lg:w-auto"
  />
</template>
