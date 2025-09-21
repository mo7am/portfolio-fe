<script setup lang="ts">
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg?raw";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import type { VForm } from "vuetify/components/VForm";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Toast } from "../../plugins/swal";

const props = defineProps<{
  isAdmin?: boolean;
}>();

const api = inject<any>("api");
const email = ref("");
const isLoading = ref(false);
const refForm = ref<VForm>();
const errors = ref("");

setPageTitle("Forget Password");

const clearError = (id: string) => {
  removeError(id);
  errors.value = "";
};

const onSubmit = async () => {
  if (!(await refForm.value?.validate())?.valid) {
    return;
  }
  isLoading.value = true;
  try {
    const response = await api.auth.forgetPassword({ email: email.value });
    errors.value = "";
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">${response.data.status}</span>`,
    });
  } catch (error: any) {
    if (error.response.status == 400) {
      errors.value = error.response.data.email;
    } else if (error.response.status == 500) {
      errors.value = "Failed to authenticate on SMTP server with username";
    }
    console.log(error);
  }
  isLoading.value = false;
};
</script>
<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="auth-v1-top-shape d-none d-sm-block"
        :class="isAdmin ? 'text-black' : 'text-primary'"
      />

      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="auth-v1-bottom-shape d-none d-sm-block"
        :class="isAdmin ? 'text-black' : 'text-primary'"
      />

      <VCard class="auth-card pa-4" max-width="448">
        <VCardItem class="justify-center">
          <template #prepend>
            <div class="flex w-[170px] h-[45px]">
              <VNodeRenderer
                class="w-[170px] h-[46px]"
                :nodes="themeConfig.app.logo"
              />
            </div>
          </template>
        </VCardItem>

        <VCardText class="pt-1">
          <h4 class="text-h4 mb-1">
            Welcome to
            <span class="text-capitalize">{{ themeConfig.app.title }}</span
            >! 👋🏻
          </h4>
          <p class="mb-0">Please enter email to reset password.</p>
        </VCardText>

        <VCardText class="pb-0">
          <VForm ref="refForm" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12">
                <div id="email">
                  <AppTextField
                    @keyup="clearError('email')"
                    v-model="email"
                    label="Email"
                    type="email"
                    placeholder="e.g. example@email.com"
                    :rules="[requiredValidator, emailValidator]"
                  />
                </div>
                <div
                  class="v-input__details"
                  :style="errors != '' ? 'display:block' : 'display:none'"
                >
                  <div class="text-sm text-danger mt-1">
                    {{ errors }}
                  </div>
                </div>
              </VCol>

              <VCol cols="12">
                <VBtn
                  block
                  :color="isAdmin ? 'black' : 'primary'"
                  :class="{
                    'text-white': isAdmin,
                  }"
                  type="submit"
                  class="w-full min-w-[368px]"
                >
                  {{ !isLoading ? "Submit" : "" }}
                  <LoadingIcon
                    icon="tail-spin"
                    color="white"
                    class="block w-4 h-4"
                    v-if="isLoading"
                  />
                </VBtn>
              </VCol>

              <VCol cols="12" class="text-center flex justify-center text-base">
                <RouterLink
                  class="w-fit flex justify-center items-center gap-1 text-sm"
                  :class="isAdmin ? 'text-black' : 'text-primary'"
                  :to="isAdmin ? { name: 'admin-login' } : { name: 'login' }"
                >
                  Back to Login
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
