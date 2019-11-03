<template>
  <div id="app">
    <swipe-left></swipe-left>
  </div>
</template>

<script>
import swipeLeft from './swipeleft.vue'
export default {
  name: 'app',
  components: {
    swipeLeft
  }
}
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;

}
</style>
