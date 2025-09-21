<script setup lang="ts">
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import miscMaskDark from "@images/pages/misc-mask-dark.png";
import miscMaskLight from "@images/pages/misc-mask-light.png";

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark);

definePage({
  meta: {
    layout: "blank",
    public: true,
  },
});
const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Permissions-Error";
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="400"
      title="Page Not Accessable ⚠️"
      description="You don't have the right permission."
    />

    <VBtn :to="{ name: 'dashboard' }" class="mb-12 mt-4"> Back to Home </VBtn>

    <VImg :src="authThemeMask" class="misc-footer-img d-none d-md-block" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
