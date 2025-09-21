interface KeyType {
  [key: string]: any;
}

var date = new Date();
var dd = String(date.getDate()).padStart(2, "0");
var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = date.getFullYear();

var hour = date.getHours() + 1;
var minute = date.getMinutes();

let today = yyyy + "-" + mm + "-" + dd;
let time = hour + ":" + minute;

export const OPTIONS_ARRAY_KEYS = [
  "selected_styles",
  "shippingData",
  "orderPayments",
];

export const DIRECTION_STYLES = ["Center", "Right", "Left"];

export const TEXT_STYLES = ["Bold", "Large", "Highlight"];

export const GROUPED_FIELDS = [
  "Items & Details",
  "Total and Partial",
  "Taxes, Payment tool, fees and discounts",
];

export const HIDDEN_FIELDS = ["Empty Line"];

export const ONLY_TEXT_FIELDS = ["Cart Comment", "Custom Header"];

export const FIELDS_WITH_NO_PARENT_CLASS = ["Delimiter", "Cash Discount"];

export const PAY_BY_FIELDS = ["Pay by", "Cash"];

export const SUGGESTED_TIPS_FIELDS = ["1:15.00%", "2:10.00%", "3:5.00%"];

export const TEMPLATE_CLASSES: KeyType = {
  "Empty Line": "my-2",
  Delimiter: "border-b border-dashed border-[1.5px]",
};

export const OPTIONS_CLASS_NAMES: KeyType = {
  Delimiter: {
    Bold: "!border-black",
    Highlight: "!border-white",
    Large: "!border-[2px]",
  },
  Bold: "font-bold text-black",
  Highlight: "!bg-black !text-white",
  Large: "text-lg",
  Center: "block w-full text-center",
  Right: "block w-full text-right",
  Left: "block w-full text-left",
};

export const SPACED_BETWEEN_FIELDS: KeyType = {
  "Reference ID": {
    first_value: "ReferenceID",
    second_value: "c77a4a8b",
  },
  "Date/Time": {
    value: "Date/Time",
    first_value: today,
    second_value: time,
  },
  "Order ID": {
    first_value: "OrderID",
    second_value: "MS-1",
  },
  Server: {
    first_value: "Server",
    second_value: "John D",
  },
  Type: {
    first_value: "Type",
    second_value: "kitchen-bar",
  },
  Cashier: {
    first_value: "Cashier",
    second_value: "John D",
  },
  Consumer: {
    first_value: "Consumer",
    second_value: "John D",
  },
  Phone: {
    first_value: "Phone",
    second_value: "+441234567",
  },
  Guests: {
    first_value: "Guests",
    second_value: "1,2",
  },
  POS: {
    first_value: "POS",
    second_value: "POS",
  },
  Table: {
    first_value: "Table",
    second_value: "Table 1,2",
  },
  // Items & Details Options
  Comment: {
    first_value: "Comment",
    second_value: "comment",
  },
  "Show subtotal": {
    first_value: "Subtotal",
    second_value: "$ 15.57",
  },
  "Show delivery fees": {
    first_value: "Delivery fees",
    second_value: "$ 15.57",
  },
  Discounts: {
    first_value: "Item Discount",
    second_value: "$ 15.57",
  },
  Total: {
    first_value: "Total",
    second_value: "$ 15.57",
  },
  "Highlight modifiers": {
    first_value: "Highlight Modifiers",
    second_value: "$ 15.57",
  },

  Subtotal: {
    first_value: "Subtotal",
    second_value: "$ 15.57",
  },
  Tip: {
    first_value: "Tip",
    second_value: "$ 00.00",
  },
  "Payment Tool": {
    first_value: "Cash",
    second_value: "$ 9.41",
  },
  "Cash Tendered": {
    first_value: "Cash Tendered",
    second_value: "$ 9.41",
  },
  Change: {
    first_value: "Change",
    second_value: "$ 00.00",
  },
  "Invoice Email": {
    first_value: "Invoice Email",
    second_value: "email@example.com",
  },
  "Cash Fee": {
    first_value: "Cash Fee",
    second_value: "$ 1.56",
  },
  "Cash discount": {
    first_value: "Cash discount",
    second_value: "$ 1.56",
  },
  Tax: {
    first_value: "Tax",
    second_value: "$ 1.56",
  },
  "Tax 1": {
    first_value: "Tax 1",
    second_value: "$ 1.56",
  },
  "Tax 2": {
    first_value: "Tax 2",
    second_value: "$ 1.56",
  },
  "Total AMT": {
    first_value: "Total AMT",
    second_value: "$ 1.56",
  },
  Name: {
    first_value: "Name",
    second_value: "John Doe",
  },
  City: {
    first_value: "City",
    second_value: "New York",
  },
  Address: {
    first_value: "Address",
    second_value: "MJ Street, 16",
  },
  Notes: {
    first_value: "Notes",
    second_value: "simple notes",
  },
  "Pay by": {
    first_value: "Pay by",
    second_value: "Cash",
  },
  Cash: {
    first_value: "Cash",
    second_value: "$ 58.65",
  },
  "1:15.00%": {
    first_value: "1:15.00%",
    second_value: "$ 8.65",
  },
  "2:10.00%": {
    first_value: "2:10.00%",
    second_value: "$ 6.50",
  },
  "3:5.00%": {
    first_value: "3:5.00%",
    second_value: "$ 1.75",
  },
  TPN: {
    first_value: "TPN",
    second_value: "V73N01",
  },
  // Taxes, Payment tool, fees and discounts
  "Payment total fees": {
    first_value: "Payment Total Fees",
    second_value: "$ 1.12",
  },
  "Payment tool discount": {
    first_value: "Payment Tool Disc",
    second_value: "$ 1.12",
  },
  "Finish time": {
    first_value: "Finish Time",
    second_value: "06/12/2021 1",
  },
};

export const OPTIONS_USED_CLASS_NAMES: KeyType = {
  Bold: "font-bold",
  Highlight: "bg-black text-white px-1",
  Large: "text-lg",
  Center: "block w-full text-center",
  Right: "block w-full text-right",
  Left: "block w-full text-left",
};
