<script setup lang="ts">
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg?raw";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import type { VForm } from "vuetify/components/VForm";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useUserStore } from "../../stores/user";
import { useRouter } from "vue-router";

const props = defineProps<{
  isAdmin?: boolean;
}>();

const userStore = useUserStore();

const api = inject<any>("api");
const router = useRouter();
const isPasswordVisible = ref(false);
const capsLockActive = ref(false);
const errors = ref("");
const isRememberMe = ref(false);
const devMode = ref(import.meta.env.DEV);
const isLoading = ref(false);
const initialForm = props.isAdmin
  ? {
      username: "admin@pps.com", //admin@pps.com
      password: "admin123", //admin123
    }
  : {
      business_id: "merch1business", //merch1business
      username: "merch1user@mailinator.com", //merch1user@mailinator.com
      password: "Password_!3", //password
    };
const form = reactive(initialForm);
const refForm = ref<VForm>();
const remainingSecondsForLockedAcc = ref(userStore.getRemaining);

setPageTitle("Sign In");

const updateRemainingSeconds = () => {
  const timer = setInterval(() => {
    let val = userStore.getRemaining;
    if (val > 0) {
      val--;
      userStore.setRemaining(val);
      remainingSecondsForLockedAcc.value = userStore.getRemaining;
    }
  }, 1000);

  removeError("username");
  removeError("business_id");
  return () => {
    clearInterval(timer);
  };
};

if (userStore.getRemaining > 0) {
  updateRemainingSeconds();
}

const onSubmit = async () => {
  if (!(await refForm.value?.validate())?.valid) {
    errors.value = "";
    return;
  }
  isLoading.value = true;
  try {
    const loginType = props.isAdmin ? "admin" : "merchant";
    const response = await api.auth.login(loginType, form);
    userStore.setUser(response.data.user);
    userStore.setToken(response.data.token, isRememberMe.value);
    userStore.setPermissions(response.data.permissions);
    if (loginType == "merchant") {
      userStore.setTenant(response.data.tenant);
      userStore.setPosSettings(response.data.tenant.posSetting);
    }

    if (response?.data?.user?.is_change_password) {
      if (props.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/change-password");
    }
  } catch (error: any) {
    console.log(error);
    errors.value = "";

    if (error?.response?.status === 429 && error?.response?.data?.retry_after) {
      userStore.setRemaining(error?.response?.data?.retry_after || 0);
      // console.log(userStore.getRemaining);
      // remainingSecondsForLockedAcc.value =
      //   error?.response?.data?.retry_after || 0;

      updateRemainingSeconds();
    } else if (
      error?.response?.status == 401 ||
      error?.response?.status == 400
    ) {
      errors.value = error.response.data.message;
    }
  }
  isLoading.value = false;
};

const checkCapsLock = async (event: any) => {
  if (capsLockActive) {
    capsLockActive.value = event?.getModifierState("CapsLock");
  }
};

const checkValue = async () => {
  if (form.password == "") {
    const element = document.getElementById("passwordId");
    if (element) {
      element.style.marginTop = "-10px";
    }
  } else {
    const element = document.getElementById("passwordId");
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
              <VNodeRenderer :nodes="themeConfig.app.logo" />
            </div>
          </template>
        </VCardItem>

        <VCardText class="pt-1">
          <h4 class="text-h4 mb-1">
            Welcome to
            <span class="text-capitalize">{{ themeConfig.app.title }}</span
            >! 👋🏻
          </h4>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <VCardText>
          <div v-if="remainingSecondsForLockedAcc > 0">
            <h4 class="font-medium text-lg text-center">
              Sorry, Your Account is temporarily locked
            </h4>
            <p class="text-base text-center mt-2">
              You have entered your password wrong more than 3 times. You will
              have to wait for {{ remainingSecondsForLockedAcc }} seconds to
              continue.
            </p>
          </div>
          <VForm ref="refForm" @submit.prevent="onSubmit" v-else>
            <VRow class="gap-2">
              <VCol class="py-0" cols="12">
                <div id="business_id" v-if="!isAdmin">
                  <AppTextField
                    @keyup="removeError('business_id')"
                    v-model="form.business_id"
                    label="Business ID"
                    type="text"
                    placeholder="e.g. 123456"
                    :rules="[requiredValidator]"
                  />
                </div>
              </VCol>

              <VCol class="py-0" cols="12">
                <div id="username">
                  <AppTextField
                    @keyup="removeError('username')"
                    v-model="form.username"
                    label="Email/UserName"
                    type="email"
                    placeholder="e.g. example@email.com"
                    :rules="[requiredValidator]"
                  />
                </div>
                <div
                  class="v-input__details"
                  :class="!errors ? '!hidden' : '!block'"
                >
                  <div class="v-messages" role="alert" aria-live="polite">
                    <div class="v-messages__message text-danger">
                      {{ errors }}
                    </div>
                  </div>
                </div>
              </VCol>

              <VCol class="py-0" cols="12">
                <AppTextField
                  @keydown="checkCapsLock"
                  @keyup="checkValue"
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :rules="[requiredValidator]"
                  :hasCapsLock="capsLockActive"
                  currentId="passwordId"
                />
                <div
                  class="d-flex align-center justify-space-between flex-wrap mt-2 mb-4"
                >
                  <VCheckbox v-model="isRememberMe" label="Remember me" />
                  <RouterLink
                    class="text-base"
                    :class="isAdmin ? 'text-black' : 'text-primary'"
                    :to="
                      isAdmin
                        ? { name: 'admin-forget-password' }
                        : { name: 'forget-password' }
                    "
                  >
                    Forgot Password?
                  </RouterLink>
                </div>

                <VBtn
                  block
                  :color="isAdmin ? 'black' : 'primary'"
                  :class="{
                    'text-white': isAdmin,
                  }"
                  type="submit"
                >
                  {{ !isLoading ? "Login" : "" }}
                  <LoadingIcon
                    icon="tail-spin"
                    color="white"
                    class="block w-4 h-4"
                    v-if="isLoading"
                  />
                </VBtn>
              </VCol>
              <RouterLink
                v-if="devMode"
                class="text-base text-center"
                :class="isAdmin ? 'text-black' : 'text-primary'"
                :to="!isAdmin ? { name: 'admin-login' } : { name: 'login' }"
              >
                <span>{{
                  isAdmin ? "Login To Merchant" : "Login To Admin"
                }}</span>
              </RouterLink>
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
