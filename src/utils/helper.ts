import type { Router } from "vue-router";

/**
 * Check if sub-nav-link is active
 * @param {object} link sub-nav-link object
 */
export const isSubLinkActive = (path: string, router: Router) => {
  return router.currentRoute.value.fullPath.includes(path);
};

export const isImageUrl = (url: string) => {
  if (!url) {
    return false;
  }
  const imageFormats = ["jpg", "jpeg", "png", "gif", "bmp"];

  const lowercasedUrl = url.toLowerCase();
  return imageFormats.some((format) => lowercasedUrl.endsWith(`.${format}`));
};

export const removeError = (parentID: string) => {
  const parentEl = document.getElementById(parentID);
  if (parentEl) {
    const errorEl = parentEl.querySelector(".error");
    const errorBorder = parentEl.getElementsByClassName("v-field__outline")[0];
    if (errorEl) errorEl.parentElement?.removeChild(errorEl);
    if (errorBorder) errorBorder?.removeAttribute("style");
  }
};

export const removeErrors = () => {
  const errorsEl = document.querySelectorAll(".error");
  errorsEl.forEach((errorEl) => {
    errorEl.parentElement?.removeChild(errorEl);
  });
  const outlines = document.querySelectorAll(`.v-field__outline`);

  outlines.forEach((outline) => {
    const isColorRed = outline.getAttribute("style")?.includes("red");
    if (isColorRed) {
      outline.setAttribute(
        "style",
        `
        color: unset;
        `
      );
    }
  });
};

export const onOutsideClick = (
  e: any,
  closeFunction: Function,
  containerID: string = "popup-content"
) => {
  const closestContainer = e?.target?.closest(`#${containerID}`);

  if (!closestContainer) {
    closeFunction();
  }
};

export const setPageTitle = (title: string) => {
  const appName: string = import.meta.env.VITE_API_APP_NAME;
  document.title = appName + ` | ${title}`;
};

export const getSideMenuPageTitle = (fullPath: string) => {
  if (fullPath.includes("dashboard/settings")) {
    return "POS Settings";
  } else if (fullPath.includes("dashboard/inventory")) {
    return "Inventory";
  } else if (
    fullPath.includes("dashboard/locations") ||
    fullPath.includes("dashboard/operators") ||
    fullPath.includes("dashboard/roles")
  ) {
    return "Locations";
  } else if (fullPath.includes("dashboard/tapes")) {
    return "X/Z Tapes";
  }
};

export const isInt = (value: any) => {
  if (value >= 0 && value % 1 === 0) {
    return true;
  } else {
    return false;
  }
};

export const makeFLoat = (value: any, type: any) => {
  if (type == "percentage") {
    return value;
  } else {
    if (isInt(value)) {
      return value.toFixed(2);
    } else {
      return value;
    }
  }
};

export const capitalize = (text: any) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
