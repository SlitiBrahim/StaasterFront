<template>
    <transition name="fade">
      <v-alert
        v-if="alertVisible"
        :type="type"
        class="mt-3 alert-position"
      >
        <slot></slot>
      </v-alert>
    </transition>
  </template>
  
  <script>
  export default {
    props: {
      type: {
        type: String,
        default: 'success',
      },
    },
    data() {
      return {
        alertVisible: true,
      };
    },
    mounted() {
      setTimeout(() => {
        this.alertVisible = false;
      }, 2000); // hide after 2 seconds
    },
  };
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .alert-position {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 2000;
  }
  </style>
  