import axios from "axios";
import { router } from "./1.router";
import apiFun from "../api/apiFun";
import { useUserStore } from "../stores/user";
import { Toast } from "../plugins/swal";
import Cookies from "js-cookie";

const apiUrl: string = import.meta.env.VITE_API_BASE_URL;

const refreshToken = async () => {
  const refresh_token = Cookies.get("refresh_token");
  try {
    const res = await axios.post(`${apiUrl}/oauth/token`, {
      refresh_token,
      client_id: import.meta.env.VITE_API_CLIENT_ID,
      client_secret: import.meta.env.VITE_API_CLIENT_SECRET,
      grant_type: "refresh_token",
    });

    useUserStore().setToken(res.data, true);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export default function (app: any) {
  const appAxios = axios.create({
    baseURL: apiUrl,
    headers: {
      Accept: "application/json",
    },
  });

  const userStore = useUserStore();
  const token = userStore.getToken;
  const isEmulation = userStore.getIsEmulation;
  const tenant_id = userStore.getTenant?.id;

  // Add the token to the axios headers
  appAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  appAxios.defaults.headers.common["X-Tenant"] = !isEmulation
    ? null
    : tenant_id;
  appAxios.defaults.headers.common["X-Emulation"] =
    isEmulation != 0 && tenant_id ? true : null;

  // Add token and tenant when they change
  watch(
    () => useUserStore().getTenant?.id,
    (newTenant) => {
      appAxios.defaults.headers.common["X-Tenant"] = newTenant;
    }
  );

  watch(
    () => useUserStore().getToken,
    (newToken) => {
      appAxios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    }
  );

  watch(
    () => useUserStore().getIsEmulation,
    (value) => {
      appAxios.defaults.headers.common["X-Emulation"] = value;
    }
  );

  appAxios.interceptors.response.use(
    (response) => {
      removeErrors();
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        const isRememberMe = Cookies.get("is_remember_me");
        if (isRememberMe === "true") {
          refreshToken();
          return;
        }

        userStore.logOut();

        const loginRoute = userStore.getIsAdmin ? "/admin/login" : "/login";

        router.push(loginRoute);
      } else if (error?.response?.status === 422) {
        // Validation Errors from Request
        const fields = error?.response?.data?.errors;
        const keys = Object.keys(fields);

        if (!keys.length) {
          throw error;
        }

        removeErrors();
        keys.forEach((key) => {
          const realKey = key.includes("images") ? "images" : key;
          const element = document.getElementById(`${realKey}`);

          if (element) {
            const errorElement = element.querySelector(".error");
            if (!errorElement) {
              const field = element.querySelector(`.v-field__outline`);

              if (field)
                field.setAttribute(
                  "style",
                  `
                  color: red;
                  `
                );
              const div = document.createElement("div");
              div.className = "text-sm text-danger mt-1 error";
              div.innerText = fields[key].join(",");
              element?.appendChild(div);
            }
          }
        });
      } else {
        const errorStatus = error?.response?.status;
        const defaultErrorMsg = "Error, Please try again later!";
        const showResponseMsg =
          errorStatus !== 400 && errorStatus !== 429 && errorStatus !== 500;

        let errMsg = defaultErrorMsg;

        if (errorStatus === 403) {
          errMsg = "You don`t have the right Permissions";
        } else if (showResponseMsg) {
          errMsg =
            error?.response?.data?.message ||
            error?.response?.message ||
            error?.message ||
            defaultErrorMsg;
        }

        Toast.fire({
          icon: "error",
          padding: "10px",
          background: "#fff",
          html: `<span class="text-sm">${errMsg}</span>`,
        });
      }

      throw error;
    }
  );

  const instances = {
    appAxios: appAxios,
  };
  app.provide("api", { ...apiFun(instances) });
}
