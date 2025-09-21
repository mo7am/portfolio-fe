import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useUserStore = defineStore("userStore", {
  state: () => {
    return {
      isEmulation:
        localStorage.getItem("isEmulation") &&
        localStorage.getItem("isEmulation") !== "undefined"
          ? localStorage.getItem("isEmulation")
          : 0,
      idToClone: 0,
      time:
        localStorage.getItem("time") &&
        localStorage.getItem("time") !== "undefined"
          ? localStorage.getItem("time")
          : 0,

      user:
        localStorage.getItem("user") &&
        localStorage.getItem("user") !== "undefined"
          ? JSON.parse(localStorage.getItem("user") || "")
          : {},

      tenant:
        localStorage.getItem("tenant") &&
        localStorage.getItem("tenant") !== "undefined"
          ? JSON.parse(localStorage.getItem("tenant") || "")
          : {},
      posSetting:
        localStorage.getItem("posSetting") &&
        localStorage.getItem("posSetting") !== "undefined"
          ? JSON.parse(localStorage.getItem("posSetting") || "")
          : {},
      token: Cookies.get("token") || Cookies.get("refresh_token") || "",
      permissions:
        localStorage.getItem("permissions") &&
        localStorage.getItem("permissions") !== "undefined"
          ? JSON.parse(localStorage.getItem("permissions") || "")
          : [],
    };
  },
  actions: {
    setIDToClone(value: number) {
      this.idToClone = value;
    },
    setIsEmulation(isEmulation: any) {
      localStorage.setItem("isEmulation", isEmulation);
      this.isEmulation = isEmulation;
    },
    setRemaining(time: any) {
      localStorage.setItem("time", time);
      this.time = time;
    },

    setUser(user: any) {
      localStorage.setItem("user", JSON.stringify(user));
      this.user = user;
    },

    setTenant(tenant: any) {
      this.tenant = tenant;
      localStorage.setItem("tenant", JSON.stringify(this.tenant));
    },

    setPosSettings(posSetting: any) {
      this.posSetting = posSetting;
      localStorage.setItem("posSetting", JSON.stringify(this.posSetting));
    },

    setToken(token: any, isRememberMe: boolean) {
      const accessToken = token.access_token;
      this.token = accessToken;

      if (isRememberMe) {
        const refreshToken = token.refresh_token;
        // Get the current date and time
        const currentDate = new Date();
        // Calculate the future date
        const tokenExpiryTime = new Date(
          currentDate.getTime() + token.expires_in * 1000
        );
        const refreshTokenExpiryTime = new Date(
          tokenExpiryTime.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        Cookies.set("token", token.access_token, { expires: tokenExpiryTime }); // Persistent cookie
        Cookies.set("refresh_token", refreshToken, {
          expires: refreshTokenExpiryTime,
        }); // Persistent cookie
        Cookies.set("is_remember_me", JSON.stringify(true));
      } else {
        Cookies.set("token", accessToken); // Session cookie
      }
    },

    setPermissions(permissions: any[]) {
      this.permissions = permissions;
      localStorage.setItem("permissions", JSON.stringify(this.permissions));
    },

    hasPermission(permissionKey: string) {
      // return true; //TODO remove it
      return !!this?.permissions?.includes(permissionKey);
    },

    logOut() {
      this.setUser({});
      this.setTenant({});
      this.token = "";
      Cookies.remove("token");
      Cookies.remove("refresh_token");
      Cookies.remove("is_remember_me");
    },
  },
  getters: {
    getIsEmulation(): any {
      if (localStorage.getItem("isEmulation") === null) {
        localStorage.setItem("isEmulation", "false");
      }
      return this.isEmulation;
    },
    getIDToClone(): number {
      return this.idToClone;
    },
    getRemaining(): any {
      if (localStorage.getItem("time") === null) {
        localStorage.setItem("time", "0");
      }
      return this.time;
    },

    getUser(): any {
      if (localStorage.getItem("user") === null) {
        localStorage.setItem("user", "{}");
      }
      return this.user;
    },

    getTenant(): any {
      if (localStorage.getItem("tenant") === null) {
        localStorage.setItem("tenant", "{}");
      }
      return this.tenant;
    },

    getPosSettings(): any {
      if (localStorage.getItem("posSetting") === null) {
        localStorage.setItem("posSetting", "{}");
      }
      return this.posSetting;
    },

    getToken(): string {
      return this.token || "";
    },

    getPermissions(): any {
      if (localStorage.getItem("permissions") === null) {
        localStorage.setItem("permissions", "{}");
      }
      return this.permissions;
    },

    getIsAdmin(): boolean {
      return this.user.type === "admin";
    },
  },
});
