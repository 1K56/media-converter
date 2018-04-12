<template>
  <div class="progress">
    <div 
      :style="{ width: (100*(progressLoaded / progressTotal)) + '%'}"
      class="progress-bar" 
      role="progressbar" 
      aria-valuenow="0" 
      aria-valuemin="0" 
      aria-valuemax="100"/>
  </div>
</template>

<script>
export default {
  props: {
    progressLoaded: {
      required: true,
      type: Number,
      default: 0
    },
    progressTotal: {
      required: true,
      type: Number,
      default: 0
    } 
  },
}
</script>

<style scoped>

</style>

