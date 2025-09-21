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
import { useUserStore } from "../../stores/user";
import { Toast } from "../../plugins/swal";

definePage({
  meta: {
    layout: "blank",
    requiresAuth: true,
  },
});

const router = useRouter();
const api = inject<any>("api");
const form = reactive({
  old_password: "",
  new_password: "",
  new_password_confirmation: "",
});
const refForm = ref<VForm>();
const capsLockActiveForOld = ref(false);
const capsLockActiveForNew = ref(false);
const capsLockActiveForConfirm = ref(false);
const isLoading = ref(false);
const isOldPasswordVisible = ref(false);
const isPasswordVisible = ref(false);
const isPasswordConfirmationVisible = ref(false);
const userStore = useUserStore();
const user = userStore.getUser;

setPageTitle("Change Password");

const logout = () => {
  try {
    const response = api.auth.logout();

    userStore.logOut();
    router.push("/login");
  } catch (error) {
    console.log(error);
  }
};

const onSubmit = async () => {
  if (!(await refForm.value?.validate())?.valid) {
    return;
  }
  isLoading.value = true;
  try {
    const response = await api.auth.changePassword(form);
    userStore.setUser(response.data.user);
    router.push("/dashboard");
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">${"Your password has been changed"}</span>`,
    });
  } catch (error: any) {
    console.log(error);
  }
  isLoading.value = false;
};

const checkCapsLockForOld = async (event: any) => {
  capsLockActiveForOld.value = event.getModifierState("CapsLock");
};

const checkValueForOld = async () => {
  if (form.old_password == "") {
    const element = document.getElementById("oldId");
    if (element) {
      element.style.marginTop = "-10px";
    }
  } else {
    const element = document.getElementById("oldId");
    if (element) {
      element.style.marginTop = "0px";
    }
  }
};

const checkCapsLockForNew = async (event: any) => {
  capsLockActiveForNew.value = event.getModifierState("CapsLock");
};

const checkValueForNew = async () => {
  if (form.new_password == "") {
    const element = document.getElementById("newId");
    if (element) {
      element.style.marginTop = "-10px";
    }
  } else {
    const element = document.getElementById("newId");
    if (element) {
      element.style.marginTop = "-12px";
    }
  }
};

const checkCapsLockForConfirm = async (event: any) => {
  capsLockActiveForConfirm.value = event.getModifierState("CapsLock");
};

const checkValueForConfirm = async () => {
  const element = document.getElementById("confirmId");
  if (element) {
    element.style.marginTop = "-10px";
  }
};
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
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
          <p class="mb-0">Please enter passwords to change it.</p>
        </VCardText>

        <div class="px-4 py-0">
          <VLabel
            >for <span class="fw-medium ml-2">{{ user.email }}</span></VLabel
          >
          <VForm ref="refForm" @submit.prevent="onSubmit" class="mt-2">
            <div class="flex flex-col gap-4">
              <div id="old_password">
                <AppTextField
                  @keydown="checkCapsLockForOld"
                  @keyup="checkValueForOld"
                  v-model="form.old_password"
                  label="Old Password"
                  :type="isOldPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isOldPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="
                    isOldPasswordVisible = !isOldPasswordVisible
                  "
                  placeholder="......."
                  :rules="[requiredValidator]"
                  :hasCapsLock="capsLockActiveForOld"
                  :currentId="'oldId'"
                />
              </div>
              <div>
                <AppTextField
                  @keydown="checkCapsLockForNew"
                  @keyup="checkValueForNew"
                  v-model="form.new_password"
                  label="New Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  placeholder="......."
                  :rules="[requiredValidator, passwordValidator]"
                  :hasCapsLock="capsLockActiveForNew"
                  :currentId="'newId'"
                />
              </div>

              <div>
                <AppTextField
                  @keydown="checkCapsLockForConfirm"
                  @keyup="checkValueForConfirm"
                  v-model="form.new_password_confirmation"
                  label="Confirm New Password"
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
                      form.new_password_confirmation,
                      form.new_password
                    ),
                  ]"
                  :hasCapsLock="capsLockActiveForConfirm"
                  :currentId="'confirmId'"
                />
              </div>

              <VBtn class="min-w-[302px]" block type="submit">
                {{ !isLoading ? "Set New Password" : "" }}
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  class="block w-4 h-4"
                  v-if="isLoading"
                />
              </VBtn>

              <div
                cols="12"
                class="text-center flex justify-center text-base px-0 py-0"
              >
                <VListItem
                  class="text-primary w-fit flex justify-center items-center gap-1 text-sm"
                  @click="logout"
                >
                  Logout
                </VListItem>
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
