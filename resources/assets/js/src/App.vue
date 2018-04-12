<template>
  <div class="container">
    <upload-component @mediaUploaded="onMediaUploaded" />
    <div class="row">
      <video 
        :src="mediaSource"
        autoplay
        loop
        muted />
    </div>
  </div>
</template>

<script>
import UploadComponent from './components/UploadComponent'
export default {
  components: {
    UploadComponent 
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
