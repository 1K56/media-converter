<template>
  <div 
    :class="{'dragged-over' : draggedOver}"
    class="upload-container" 
    @drop.prevent.stop="onFileDrop"
    @dragover.prevent.stop
    @dragenter.prevent.stop="draggedOver = true"
    @dragleave.prevent.stop="draggedOver = false">
    <transition name="fade">
      <div 
        v-if="uploadState === 'INITIAL'" 
        key="initial"
        class="upload-initial text-white bg-primary"> 
        <form 
          action="" 
          method="POST" 
          enctype="multipart/form-data">
          <input 
            id="media-file-input" 
            type="file" 
            name="media"
            @change="onFileSelected">
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <h2>Drag your file here to upload or <label class="upload-label" for="media-file-input">click here</label></h2>
        </form>
      </div>
      <div 
        v-else-if="uploadState === 'UPLOADING'" 
        key="uploading"
        class="upload-uploading text-white bg-info">
        <div class="rp">
          <progress-component 
            :progress-total="uploadTotal"
            :progress-loaded="uploadLoaded"
            class="upload-progress"/>
        </div>
      </div>
      <div 
        v-else-if="uploadState === 'SUCCESSFUL'" 
        key="successful"
        class="upload-successful text-white bg-success">
        <h2>Upload successful!</h2>
      </div>
      <div 
        v-else-if="uploadState === 'ERROR'" 
        key="error"
        class="upload-error text-white bg-danger">
        <ul>
          <li 
            v-for="(error, index) in errors" 
            :key="index"
            class="upload-error-message">
            {{ error }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios'
  import ProgressComponent from './ProgressComponent'

  const UPLOADING = 'UPLOADING'
  const INITIAL = 'INITIAL'
  const SUCCESSFUL = 'SUCCESSFUL'
  const ERROR = 'ERROR'

  export default {
    components: {
      ProgressComponent
    },
    data() {
      return {
        errors: null,
        uploadState: INITIAL,
        draggedOver: false,
        uploadLoaded: 0,
        uploadTotal: 0,
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
      onFileSelected(e) {
        let selectedFile = e.target.files[0]
        this.processBeforeUpload(selectedFile)
      },
      onFileDrop(e) {
        let droppedFile = e.dataTransfer.files[0]
        this.processBeforeUpload(droppedFile)
      },
      processBeforeUpload(file) {
        this.draggedOver = false

        if(this.uploadState === UPLOADING) {
          this.source.cancel('upload cancelled by user')
        }

        this.CancelToken = axios.CancelToken
        this.source = this.CancelToken.source()

        this.validateFile(file)

        if(this.errors.length > 0) {
          this.uploadState = ERROR
          return;
        }

        let formData = new FormData()
        formData.append('media', file)

        return this.upload(formData)
          .then(this.onFileUploaded)
          .catch((error) => {
            throw new Error(error)
          })
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
  .upload-component-row {
    margin-top: 50px;
  }

  .upload-container {
    margin: 0 auto;
    height: 250px;
    overflow: hidden;
    position: relative;
    transition: transform 0.2s;
  }

  .upload-container > div {
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;
  }

  .upload-container > div h2 {
    line-height: 250px;
  }

  .upload-initial {
  }

  .upload-uploading {
  }

  .upload-successful {
  }

  .upload-error ul {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    padding: 0;
    width: 70%;
    text-align: center;
    list-style: none;
    font-size: 20px;
  }

  .upload-error ul li:first-child {
    padding-bottom: 10px;
    border-bottom: 2px solid #ff8989;
  }

  .upload-error ul li:last-child {
    padding-top: 10px;
  }

  .dragged-over {
  }

  #media-file-input {
    display: none;
  }

  .upload-label {
    text-decoration: underline;
  }

  .upload-progress {
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    position: absolute;
    height: 10px;
    width: 60%;
  }

  .upload-progress > .progress-bar{
    background: #333;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.7s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  
</style> 
