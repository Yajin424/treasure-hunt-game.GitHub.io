<template>
  <transition name="scene-transition" mode="out-in">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'SceneTransition'
}
</script>

<style scoped>
.scene-transition-enter-active,
.scene-transition-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.scene-transition-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.scene-transition-leave-to {
  opacity: 0;
  transform: scale(1.2);
}

.scene-transition-enter-to,
.scene-transition-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>