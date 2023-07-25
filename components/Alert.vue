<template>
  <transition name="fade">
    <v-alert
      :type="type"
      class="mt-3 alert-position"
      max-width="400"
      v-model="alertVisible"
    >
      {{  msg }}
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
    msg: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      alertVisible: false
    };
  },
  watch: {
    msg(newValue) {
      if (newValue) {
        this.alertVisible = true;
        setTimeout(() => {
          this.alertVisible = false;
        }, 3000);
      }
    }
  }
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
