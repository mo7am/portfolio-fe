<script lang="ts">
import type { PropType } from "vue";
import { HorizontalNav } from "@layouts/components";
import { useLayoutConfigStore } from "@layouts/stores/config";
import type { NavItems } from "@layouts/types";

export default defineComponent({
  props: {
    navItems: {
      type: Array as PropType<NavItems>,
      required: true,
    },
    horizontalNavAttrs: {
      type: Object as PropType<Record<string, null>>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const { width: windowWidth } = useWindowSize();
    const configStore = useLayoutConfigStore();

    const isOverlayNavActive = ref(false);
    const isLayoutOverlayVisible = ref(false);
    const toggleIsOverlayNavActive = useToggle(isOverlayNavActive);

    syncRef(isOverlayNavActive, isLayoutOverlayVisible);

    watch(windowWidth, () => {
      if (
        !configStore.isLessThanOverlayNavBreakpoint &&
        isLayoutOverlayVisible.value
      )
        isLayoutOverlayVisible.value = false;
    });

    return () => {
      const horizontalNavAttrs = toRef(props, "horizontalNavAttrs");

      const {
        wrapper: horizontalNavWrapper,
        wrapperProps: horizontalNavWrapperProps,
        ...additionalhorizontalNavAttrs
      } = horizontalNavAttrs.value;

      // 👉 horizontal nav
      const horizontalNav = h(
        HorizontalNav,
        {
          isOverlayNavActive: isOverlayNavActive.value,
          toggleIsOverlayNavActive,
          navItems: props.navItems,
          ...additionalhorizontalNavAttrs,
        },
        {
          "nav-header": () => slots["horizontal-nav-header"]?.(),
          "before-nav-items": () => slots["before-horizontal-nav-items"]?.(),
        }
      );

      // 👉 Navbar
      const navbar = h(
        "header",
        {
          class: [
            "layout-navbar",
            { "navbar-blur": configStore.isNavbarBlurEnabled },
          ],
        },
        [
          h(
            "div",
            slots.navbar?.({
              togglehorizontalOverlayNavActive: toggleIsOverlayNavActive,
            })
          ),
        ]
      );

      // 👉 Content area
      const main = h(
        "main",
        { class: "layout-page-content !pb-[140px] lg:!pb-0" },
        h("div", { class: "page-content-container" }, slots.default?.())
      );

      // 👉 Footer
      const footer = h("footer", { class: "layout-footer" }, [
        h("div", { class: "footer-content-container" }, slots.footer?.()),
      ]);

      // 👉 Overlay
      const layoutOverlay = h("div", {
        class: ["layout-overlay", { visible: isLayoutOverlayVisible.value }],
        onClick: () => {
          isLayoutOverlayVisible.value = !isLayoutOverlayVisible.value;
        },
      });

      return h(
        "div",
        { class: ["layout-wrapper", ...configStore._layoutClasses] },
        [
          horizontalNavWrapper
            ? h(horizontalNavWrapper, horizontalNavWrapperProps, {
                default: () => horizontalNav,
              })
            : horizontalNav,
          h("div", { class: "layout-content-wrapper-horizontal" }, [
            navbar,
            main,
            footer,
          ]),
          layoutOverlay,
        ]
      );
    };
  },
});
</script>
<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

.layout-wrapper.layout-nav-type-vertical {
  // TODO(v2): Check why we need height in vertical nav & min-height in horizontal nav
  block-size: 100%;

  .layout-content-wrapper-horizontal {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-block-size: 100dvh;
    transition: padding-inline-start 0.2s ease-in-out;
    will-change: padding-inline-start;

    @media screen and (min-width: 1280px) {
      padding-inline-start: 0px !important;
    }
  }
}
</style>
