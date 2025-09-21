import { cookieRef } from "@layouts/stores/config";
import { themeConfig } from "@themeConfig";

export const resolveVuetifyTheme = (): "light" | "dark" => {
  const cookieColorScheme = cookieRef<"light" | "dark">(
    "color-scheme",
    usePreferredDark().value ? "dark" : "light"
  );
  const storedTheme = cookieRef("theme", themeConfig.app.theme).value;

  return storedTheme as "light" | "dark";
};
