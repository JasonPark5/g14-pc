<template>
  <div class="none-layout-loading">
    <q-spinner-dots size="60px" color="primary" />
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'noneLayout'
})
</script>
<style scoped>
.none-layout-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
