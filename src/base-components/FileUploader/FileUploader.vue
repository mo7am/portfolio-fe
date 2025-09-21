<script lang="ts" setup>
import Dropzone from "../Dropzone";
import Lucide from "../Lucide";
import { Toast } from "@/plugins/swal";

type FileData = {
  uuid: string;
  size: number;
  name: string;
  url: string;
  accepted: boolean;
  is_primary?: boolean;
};

const props = defineProps<{
  setFiles: (value: string, type?: string, name?: string) => void;
  editFormFiles?: any;
  single?: boolean;
  acceptedTypes?: string[];
  className?: string;
  notDelete?: boolean;
  isProduct?: boolean;
  tenantID?: number;
  isLogoField?: boolean;
}>();
const { editFormFiles } = toRefs(props);

const emit = defineEmits(["setPrimary"]);
const api = inject<any>("api");
const dropzoneRef = ref();
const isLoading = ref(false);
const progress = reactive({
  count: 0,
  error: false,
});
const filesData = ref<FileData[]>([]);
const apiUrl: string = import.meta.env.VITE_API_BASE_URL;

const upload = async (file: any) => {
  const timer = setTimeout(() => {
    const fileData = {
      uuid: file.upload.uuid,
      accepted: file.accepted,
      size: Math.ceil(file.upload.total / 1000),
      name: file.upload.filename,
      url: file?.dataURL,
    };

    if (props.single) {
      filesData.value = [fileData];
    } else {
      filesData.value.push(fileData);
    }
    if (!props.isProduct) props.setFiles(file);
  }, 100);

  if (props.isProduct) {
    isLoading.value = true;
    try {
      resetProgressBar();

      const res = await api.assets.uploadProductImage(file, onUploading);
      const uploadedFile = await res.data;

      if (res.statusText === "OK") {
        props.setFiles(uploadedFile);
        const fileIndex = filesData.value.findIndex(
          (uploadedFile) => uploadedFile.uuid === file.upload.uuid
        );

        filesData.value[fileIndex].url = file?.dataURL;
        resetProgressBar();
      }
    } catch (error) {
      progress.error = true;
      console.log(error);
    }
    isLoading.value = false;
  }
  return () => {
    clearTimeout(timer);
  };
};

const checkAccepted = (file: any) => {
  const splittedName = file.name.split(".");
  const ext = splittedName[splittedName.length - 1];
  if (props.acceptedTypes?.includes(ext) && file.size < 2000 * 1024) {
    return true;
  } else {
    Toast.fire({
      icon: "error",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Not accepted</span>`,
    });
  }

  return false;
};

const onUploading = (progressEvent: any) => {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );

  progress.count = percentCompleted;
};

const resetProgressBar = () => {
  progress.count = 0;
  progress.error = false;
};

const uploadFile = async (file: any) => {
  const accepted = props.acceptedTypes?.length ? checkAccepted(file) : true;
  if (accepted) {
    if (props.isLogoField) {
      let newImage = new Image();
      newImage.src = URL.createObjectURL(file);
      newImage.onload = function () {
        if (newImage.width <= 500 && newImage.height <= 500) {
          upload(file);
        } else {
          Toast.fire({
            icon: "error",
            padding: "10px",
            background: "#fff",
            html: `<span style="font-size:14px">Image should be 500*500 px</span>`,
          });
        }
      };
    } else {
      upload(file);
    }
  }
};

const removeFile = (name: string, uuid: string) => {
  if (props.single) {
    props.setFiles("");
  } else {
    props.setFiles(uuid, "DELETE", name);
  }
  const fileIndex = filesData.value.findIndex(
    ({ uuid: fileID }) => fileID === uuid
  );
  filesData.value.splice(fileIndex, 1);
};

const setPrimary = (index: number) => {
  if (props.isProduct) {
    emit("setPrimary", index);
    filesData.value.forEach((file) => {
      file.is_primary = false;
    });
    filesData.value[index].is_primary = true;
  }
};

onMounted(() => {
  if (editFormFiles.value?.length) {
    filesData.value = editFormFiles.value.map((file: any) => ({
      accepted: true,
      name: file?.file_name,
      size: 0,
      uuid: file?.uuid,
      url: file?.url,
    }));
  }
});
</script>
<template>
  <div :class="[className]">
    <Dropzone
      :options="{
        url: apiUrl,
        autoProcessQueue: false,
        thumbnailWidth: 150,
        addedfile: (file: any) => uploadFile(file),
        maxFiles: single ? 1 : undefined
      }"
      ref="dropzoneRef"
      msgClass="shadow-sm border border-dashed  rounded"
    >
      <div class="px-2 py-3 dz-message dz-custom relative">
        <button type="button">Upload Image</button>
        <p class="text-slate-300 text-xs" v-if="isProduct && filesData.length">
          Tap on an image to set as Primary
        </p>
        <div
          class="progress-bar absolute bottom-0 left-0 right-0 h-0.5"
          :style="{
            width: `${progress.count}%`,
          }"
          :class="{
            'bg-green-500': !progress.error,
            'bg-danger': progress.error,
          }"
        ></div>
      </div>

      <div class="" v-if="filesData.length || isLoading">
        <template v-if="filesData.length">
          <div class="flex gap-2 flex-wrap p-2">
            <template
              v-for="(
                { name, size, url, uuid, is_primary }, index
              ) in filesData"
            >
              <div :key="uuid" class="relative" v-if="url">
                <button
                  type="button"
                  class="w-[40px] h-[40px] hover:scale-110 transition-all rounded"
                  :class="{
                    'cursor-pointer ': isProduct,
                  }"
                  @click="setPrimary(index)"
                >
                  <img
                    :alt="name"
                    :src="url"
                    class="rounded w-full h-full object-cover"
                    :class="{
                      'border !border-[#ff6f61]': is_primary,
                    }"
                    v-if="url"
                  />
                </button>
                <button
                  type="button"
                  class="cursor-pointer bg-danger flex rounded-full absolute top-[-10px] right-0 z-50"
                  @click.stop="removeFile(name, uuid)"
                >
                  <Lucide icon="X" class="w-4 h-4 m-auto text-white" />
                </button>
              </div>
            </template>
          </div>
        </template>
      </div>
    </Dropzone>
  </div>
</template>
<style>
.progress-bar {
  transition: all linear 0.3s;
}

.skeleton .square {
  height: 120px;
  width: 120px;
  border-radius: 1rem;
  background: rgba(130, 130, 130, 0.2);
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(8%, rgba(130, 130, 130, 0.2)),
    color-stop(18%, rgba(130, 130, 130, 0.3)),
    color-stop(33%, rgba(130, 130, 130, 0.2))
  );
  background: linear-gradient(
    to right,
    rgba(130, 130, 130, 0.2) 8%,
    rgba(130, 130, 130, 0.3) 18%,
    rgba(130, 130, 130, 0.2) 33%
  );
  background-size: 800px 100px;
  animation: wave-squares 2s infinite ease-out;
}

@keyframes wave-squares {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.file-parent {
  position: relative;
  width: fit-content;
}

.remove-btn {
  position: absolute;
  top: -16px;
  right: -15px;
  z-index: 1000000;
  opacity: 0;
  transition: 0.6s;
  padding: 4px;
}

.file-parent:hover .remove-btn {
  opacity: 1;
  background: red;
}
.my-swal {
  z-index: 10000000;
}
</style>
