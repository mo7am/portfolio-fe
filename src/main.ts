import { Options } from "./@core/types";
import { createApp } from "vue";

import App from "@/App.vue";
import { registerPlugins } from "@core/utils/plugins";
import Avatar from "@core/components/Avatar.vue";
// import router from "./router";
import print from "vue3-print-nb";

import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

// Styles
import "@core/scss/template/index.scss";
import "@styles/styles.scss";
import { useUserStore } from "@/stores/user";

// Create vue app
const app = createApp(App);

app.component("avatar", Avatar);
app.use(print);

// Register plugins
registerPlugins(app);

const globalOptions = {
  mode: "auto",
};

app.use(VueTelInput, globalOptions);

// Mount vue app
app.mount("#app");

app.directive("can", (el, binding, vnode) => {
  const userStore = useUserStore();
  const permissions = userStore.getPermissions;
  if (permissions.includes(binding.value)) {
    return (vnode.el.hidden = false);
  } else {
    return (vnode.el.hidden = true);
  }
});

app.directive("not-can", (el, binding, vnode) => {
  const userStore = useUserStore();
  const permissions = userStore.getPermissions;
  if (!permissions.includes(binding.value)) {
    return (vnode.el.hidden = false);
  } else {
    return (vnode.el.hidden = true);
  }
});
