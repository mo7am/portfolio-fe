import { defineStore } from "pinia";
import type { InventoryMenuItem as TapeMenuItem } from "@/types/inventory";
import { tapeMenuItems } from "./data";

export const useTapeMenu = defineStore("tapesMenu", {
  state: () => {
    return {
      items: tapeMenuItems,
      activeItem: tapeMenuItems[0],
      search: "",
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
    setActiveItem(item: TapeMenuItem) {
      this.activeItem = item as any;
    },

    setActiveItemFromTitle(title: string) {
      this.search = "";
      const targetItem = this.items.find((item) => item.title === title);
      if (targetItem) this.activeItem = targetItem;
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
      this.setActiveItem(tapeMenuItems[0]);
    },
  },
  getters: {
    getItems(): TapeMenuItem[] {
      return this.items;
    },

    getActiveItem(): TapeMenuItem {
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
  },
});
