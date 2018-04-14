<template>
  <div class="container">
    <upload-component @mediaUploaded="onMediaUploaded" />
    <div class="row justify-content-md-center">
      <playback-component :media-source="mediaSource" />
    </div>
  </div>
</template>

<script>
import UploadComponent from './components/UploadComponent'
import PlaybackComponent from './components/PlaybackComponent'

export default {
  components: {
    UploadComponent,
    PlaybackComponent
  },
  data() {
    return {
      mediaSource: null
    }
  },
  methods: {
    onMediaUploaded(path) {
      this.mediaSource = path
    }
  }
}
</script>
