<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="playback-col col-md-10">
        <playback-component/>
      </div>
    </div>
  </div>
</template>

<script>
import PlaybackComponent from './components/PlaybackComponent'

export default {
  components: {
    PlaybackComponent
  },
}
</script>
