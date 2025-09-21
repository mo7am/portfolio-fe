import { defineStore } from "pinia";
import type { InventoryMenuItem } from "@/types/inventory";
import { inventoryMenuItems } from "./data";

export const useInventoryMenu = defineStore("ineventoryMenuStore", {
  state: () => {
    return {
      items: inventoryMenuItems,
      activeItem: inventoryMenuItems[0],
      search: "",
      discountType: "",
      isPopupVisible: false,
      isOperatorPopupVisible: false,
      isSearchPopupVisible: false,
      isDeletePopupVisible: false,
      idToEdit: 0,
      idToClone: 0,
      isGetData: false,
      isDeleteRecord: false,
      isDeleting: false,
    };
  },
  actions: {
    setActiveItem(item: InventoryMenuItem) {
      this.activeItem = item;
    },

    setActiveItemFromTitle(title: string) {
      this.search = "";
      const targetItem = this.items.find((item) => item.title === title);
      if (targetItem) this.activeItem = targetItem;
    },

    setDiscountType(type: string) {
      this.discountType = type;
    },

    setSearchValue(value: string) {
      this.search = value;
    },

    setIsPopupVisible(value: boolean) {
      this.isPopupVisible = value;
    },

    setIsOperatorPopupVisible(value: boolean) {
      this.isOperatorPopupVisible = value;
    },

    setIsSearchPopupVisible(value: boolean) {
      this.isSearchPopupVisible = value;
    },

    setIsDeletePopupVisible(value: boolean) {
      this.isDeletePopupVisible = value;
    },

    setIsGetData() {
      this.isGetData = !this.isGetData;
    },

    setIDToEdit(value: number) {
      this.idToEdit = value;
    },

    setIDToClone(value: number) {
      this.idToClone = value;
    },

    setIsDeleteRecord() {
      this.isDeleteRecord = !this.isDeleteRecord;
    },

    setIsDeleting(value: boolean) {
      this.isDeleting = value;
    },

    resetStore() {
      this.setSearchValue("");
      this.setIsPopupVisible(false);
      this.setIsDeletePopupVisible(false);
      this.setActiveItem(inventoryMenuItems[0]);
    },
  },
  getters: {
    getItems(): InventoryMenuItem[] {
      return this.items;
    },

    getActiveItem(): InventoryMenuItem {
      return this.activeItem;
    },

    getSearchValue(): string {
      return this.search;
    },

    getIsPopupVisible(): boolean {
      return this.isPopupVisible;
    },

    getIsOperatorPopupVisible(): boolean {
      return this.isOperatorPopupVisible;
    },

    getIsSearchPopupVisible(): boolean {
      return this.isSearchPopupVisible;
    },

    getIsDeletePopupVisible(): boolean {
      return this.isDeletePopupVisible;
    },

    getIsGetData(): boolean {
      return this.isGetData;
    },

    getIDToEdit(): number {
      return this.idToEdit;
    },

    getIDToClone(): number {
      return this.idToClone;
    },

    getIsDeleteRecord(): boolean {
      return this.isDeleteRecord;
    },

    getIsDeleting(): boolean {
      return this.isDeleting;
    },

    getDiscountType(): string {
      return this.discountType;
    },
  },
});
