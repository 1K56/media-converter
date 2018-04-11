<template>
  <div>
    <h1>hello</h1>
    <video 
      :src="mediaSource"
      autoplay 
      loop />
    <upload-component @mediaUploaded="onMediaUploaded" />
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
