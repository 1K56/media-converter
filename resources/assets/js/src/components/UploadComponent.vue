<template>
  <div 
    :class="{'dragged-over' : draggedOver}"
    class="upload-container" 
    @drop.prevent.stop="onFileDrop"
    @dragover.prevent.stop
    @dragenter.prevent.stop="draggedOver = true"
    @dragleave.prevent.stop="draggedOver = false">
    <div 
      v-if="uploadState === 'INITIAL'" 
      class="upload-initial"> 
      <h1>Drag your file here to upload</h1>
    </div>
    <div 
      v-if="uploadState === 'UPLOADING'" 
      class="upload-uploading">
      <h1>uploading</h1>
    </div>
    <div 
      v-if="uploadState === 'SUCCESSFUL'" 
      class="upload-successful">
      <h1>Upload successful</h1>
    </div>
    <div 
      v-if="uploadState === 'ERROR'" 
      class="upload-error">
      <h1 
        v-for="(error, index) in errors" 
        :key="index">
        {{ error }}
      </h1>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  const UPLOADING = 'UPLOADING'
  const INITIAL = 'INITIAL'
  const SUCCESSFUL = 'SUCCESSFUL'
  const ERROR = 'ERROR'

  export default {
    data() {
      return {
        errors: null,
        uploadState: INITIAL,
        draggedOver: false,
        uploadLoaded: null,
        uploadTotal: null,
        allowedFileTypes: [
          'video/webm',
          'video/mp4'
        ],
        maxFileSize: 4194304,
        CancelToken: null,
        source: null
      }
    },
    methods: {
      onFileDrop(e) {
        this.draggedOver = false

        if(this.uploadState === UPLOADING) {
          this.source.cancel('upload cancelled by user')
        }

        this.CancelToken = axios.CancelToken
        this.source = this.CancelToken.source()

        let droppedFile = e.dataTransfer.files[0]

        this.validateFile(droppedFile)

        if(this.errors.length > 0) {
          this.uploadState = ERROR
          return;
        }

        let formData = new FormData()
        formData.append('media', droppedFile)
        this.upload(formData, this.CancelToken.source())
          .then(this.onFileUploaded)
      },
      upload(formData) {
        this.uploadState = UPLOADING
        let self = this
        return axios.post('/upload', formData, {
          onUploadProgress: (e) => {
            this.uploadLoaded = e.loaded
            this.uploadTotal = e.total
          },
          cancelToken: self.source.token
        }) 
      },
      onFileUploaded(res) {
        if(res.data.status === 'success') {
          this.uploadState = SUCCESSFUL
          this.$emit('mediaUploaded', res.data.path)
          setTimeout(() => { 
            this.uploadState = INITIAL
          }, 5000)
        } else {
          this.uploadState = ERROR
        }
      },
      validateFile(file) {
        this.errors = []
        
        if(!this.validateFileType(file)) {
          this.errors.push('File type doesn\'t match allowed file types (webm, mp4)')
        }

        if(!this.validateFileSize(file)) {
          this.errors.push('The file is too large, max allowed file size is 4Mb')
        }
      },
      validateFileType(file) {
        for (let i = 0; i < this.allowedFileTypes.length; i++) {
          if(file.type === this.allowedFileTypes[i]){
            return true;
          }
        }

        return false
      },
      validateFileSize(file) {
        if(file.size > this.maxFileSize) {
          return false
        }

        return true
      }
    }
  }
</script>

<style>
  .upload-container {
    margin: 0 auto;
    width: 400px;
    height: 200px;
    overflow: hidden;
  }

  .upload-container > div {
    width: 100%;
    height: 100%;
  }

  .upload-initial {
    background: blue;
  }

  .upload-uploading {
    background: cyan;
  }

  .upload-successful {
    background: green;
  }

  .upload-error {
    background: red;
  }

  .dragged-over {
    transform: scale(1.1, 1.1);
  }
</style> 
