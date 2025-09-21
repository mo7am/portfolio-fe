<script lang="ts" setup>
import { inject, ref } from "vue";
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoadingIcon from "../../base-components/LoadingIcon";
import type { VForm } from "vuetify/components/VForm";
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg?raw";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { Toast } from "../../plugins/swal";

definePage({
  meta: {
    layout: "blank",
    requiresAuth: false,
  },
});

const props = defineProps<{
  isAdmin?: boolean;
}>();

const router = useRouter();
const route = useRoute();
const api = inject<any>("api");
const form = reactive({
  token: route.query.token,
  email: route.query.email,
  password: "",
  password_confirmation: "",
});
const refForm = ref<VForm>();
const capsLockActiveForPassword = ref(false);
const capsLockActiveForConfirm = ref(false);
const isLoading = ref(false);
const isPasswordVisible = ref(false);
const isPasswordConfirmationVisible = ref(false);

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Reset Password";

const onSubmit = async () => {
  if (!(await refForm.value?.validate())?.valid) {
    return;
  }
  isLoading.value = true;
  try {
    await api.auth.resetPassword(form);
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">${"Password reset successfully"}</span>`,
    });
    if (props.isAdmin) {
      router.push("/admin/login");
    } else {
      router.push("/login");
    }
  } catch (error: any) {
    if (error.response.status == 400) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span style="font-size:14px">${error.response.data.email}</span>`,
      });
    }
  }
  isLoading.value = false;
};

const checkCapsLockForPassword = async (event: any) => {
  capsLockActiveForPassword.value = event.getModifierState("CapsLock");
};

const checkValueForPassword = async () => {
  if (form.password == "") {
    var element = document.getElementById("passwordId");
    if (element) {
      element.style.marginTop = "-10px";
    }
  } else {
    var element = document.getElementById("passwordId");
    if (element) {
      element.style.marginTop = "-16px";
    }
  }
};

const checkCapsLockForConfirm = async (event: any) => {
  capsLockActiveForConfirm.value = event.getModifierState("CapsLock");
};

const checkValueForConfirm = async () => {
  if (form.password == "") {
    var element = document.getElementById("confirmId");
    if (element) {
      element.style.marginTop = "-10px";
    }
  } else {
    var element = document.getElementById("confirmId");
    if (element) {
      element.style.marginTop = "0px";
    }
  }
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

        <VCardText class="pt-1 pb-2">
          <h4 class="text-h4 mb-1">
            Welcome to
            <span class="text-capitalize">{{ themeConfig.app.title }}</span
            >! 👋🏻
          </h4>
          <p class="mb-0">Please enter new password to reset it.</p>
        </VCardText>

        <div class="px-4 py-0">
          <VLabel
            >for <span class="fw-medium ml-2">{{ form.email }}</span></VLabel
          >
          <VForm ref="refForm" @submit.prevent="onSubmit" class="mt-2">
            <div class="flex flex-col gap-4">
              <div>
                <AppTextField
                  @keydown="checkCapsLockForPassword"
                  @keyup="checkValueForPassword"
                  v-model="form.password"
                  label="New Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  placeholder="......."
                  :rules="[requiredValidator, passwordValidator]"
                  :hasCapsLock="capsLockActiveForPassword"
                  :currentId="'passwordId'"
                />
              </div>

              <div>
                <AppTextField
                  @keydown="checkCapsLockForConfirm"
                  @keyup="checkValueForConfirm"
                  v-model="form.password_confirmation"
                  label="Password Confirmation"
                  placeholder="......."
                  :type="isPasswordConfirmationVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordConfirmationVisible
                      ? 'tabler-eye-off'
                      : 'tabler-eye'
                  "
                  @click:append-inner="
                    isPasswordConfirmationVisible =
                      !isPasswordConfirmationVisible
                  "
                  :rules="[
                    requiredValidator,
                    confirmedValidator(
                      form.password_confirmation,
                      form.password
                    ),
                  ]"
                  :hasCapsLock="capsLockActiveForConfirm"
                  :currentId="'confirmId'"
                />
              </div>
              <VBtn
                block
                :color="isAdmin ? 'black' : 'primary'"
                :class="{
                  'text-white': isAdmin,
                }"
                type="submit"
              >
                {{ !isLoading ? "Reset Password" : "" }}
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  class="block w-4 h-4"
                  v-if="isLoading"
                />
              </VBtn>
              <div class="text-center flex justify-center text-base">
                <RouterLink
                  :class="isAdmin ? 'text-black' : 'text-primary'"
                  class="w-fit flex justify-center items-center gap-1 text-sm"
                  :to="{ name: 'login' }"
                >
                  Back to Login
                </RouterLink>
              </div>
            </div>
          </VForm>
        </div>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
