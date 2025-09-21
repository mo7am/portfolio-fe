<script lang="ts" setup>
import { HTMLAttributes, ref, inject, onMounted } from 'vue';
import DropzoneJs, { DropzoneOptions } from 'dropzone';
import { init } from './dropzone';

export type ProvideDropzone = (el: DropzoneElement) => void;

export interface DropzoneElement extends HTMLDivElement {
  dropzone: DropzoneJs;
}

interface DropzoneProps extends /* @vue-ignore */ HTMLAttributes {
  options: DropzoneOptions;
  refKey?: string;
  msgClass?: string;
  parentClass?: string;
}

const props = defineProps<DropzoneProps>();

const fileUploadRef = ref<DropzoneElement>();

const bindInstance = (el: DropzoneElement) => {
  if (props.refKey) {
    const bind = inject<ProvideDropzone>(`bind[${props.refKey}]`);
    if (bind) {
      bind(el);
    }
  }
};

const vFileUploadDirective = {
  mounted(el: DropzoneElement) {
    init(el, props);
  },
};

onMounted(() => {
  if (fileUploadRef.value) {
    bindInstance(fileUploadRef.value);
  }
});
</script>

<template>
  <div ref="fileUploadRef" :class="parentClass" v-file-upload-directive>
    <div :class="msgClass">
      <slot></slot>
    </div>
  </div>
</template>
