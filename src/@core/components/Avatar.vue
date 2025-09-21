<template>
    <div v-bind:style="{ backgroundColor: getRandomColor() }" :class="`border-style ${isProfile ? 'profile-picture' : 'avatar-icon'} ${isCard ? 'card-style' : ''}`">
      <span :class="`white--text ${isProfile ? 'text-size' : ''}`">{{ getInitials(initials) }}</span>
    </div>
  </template>

  <script>

  export default {
    name: "Avatar",
    props: {
      initials: {type: String, default: ''},
      isProfile: {type: Boolean, default: false},
      isCard: {type: Boolean, default: false},
    },
    data: function () {
      return {
        colors: [
          "#F44336",
          "#E91E63",
          "#9C27B0",
          "#673AB7",
          "#3F51B5",
          "#2196F3",
          "#03A9F4",
          "#00BCD4",
          "#009688",
          "#4CAF50",
          "#8BC34A",
          "#FF9800",
          "#FF5722"
        ],
      };
    },
    methods: {
      getInitials(data) {
        if (data != null) {
          let chr;
          const d = data.toUpperCase();
          chr = d.split(" ");
          if (chr.length >= 2) {
            return chr[0][0] + chr[1][0];
          } else {
            return d[0] + d[1];
          }
        }
        return "";
      },
      getRandomColor() {
        let randomIndex = Math.floor(Math.random() * this.colors.length);
        return this.colors[randomIndex];
      },
    },
  };
  </script>

  <style scoped>
  .card-style {
    border-radius: 8px 0px 0px 8px !important;
    box-shadow: 4px 6px 10px 0px rgb(0 0 0 / 5%) !important;
    width: 57px !important;
    height: 57px !important;
  }
  .avatar-icon {
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 2.4;
    color: #ffffff;
    font-weight: bold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center
  }

  /* .profile-picture {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 3.4;
    color: #ffffff;
    font-weight: bold;
  } */

  .profile-picture {
    border-radius: 50%;
    object-fit: cover;
    padding: 30px;
    font-size: 30px;
    color: #ffffff;
    font-weight: bold;
  }
  </style>
