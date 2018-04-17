<template>
  <div class="playback-container">
    <tabs-component 
      :external-active-tab-id="activeTabId"
      @tabChange="onTabChange"/>
    <upload-component 
      v-visible="activeTabId === 1"
      @mediaUploaded="onMediaUploaded"/>
    <div 
      v-visible="activeTabId === 2"
      ref="mediaContainer"
      class="video-container">
      <div class="video-overlay" />
      <video 
        ref="media"
        :src="ms"
        :style="{maxWidth: maxVideoWidth, maxHeight: maxVideoHeight}"
        autoplay
        @loadedmetadata="onMetaDataLoaded"
        @loadstart="setContainerDimensions"
        @timeupdate="updateMediaProgress"/>
    </div>
    <div class="controls">
      <div class="toggle-playback">
        <i>a</i>
      </div>
      <seekable-progress-component
        id="media-progress"
        :progress-loaded="mediaCurrentPosition"
        :progress-total="mediaLength"
        class="media-playback-progress"
        @user-seek="onUserSeek"
        @user-start-seek="onUserStartSeek"
        @user-stop-seek="onUserStopSeek"/>
      <seekable-progress-component
        id="volume-control"
        :progress-loaded="mediaVolume"
        :progress-total="1"
        @user-seek="onUserChangedVolume"/>
    </div>
  </div>
</template>

<script>
import UploadComponent from './UploadComponent'
import SeekableProgressComponent from './SeekableProgressComponent'
import TabsComponent from './TabsComponent'

export default {
  components: {
    SeekableProgressComponent,
    UploadComponent,
    TabsComponent
  },
  props: {
    mediaSource: {
      default: '',
      type: String,
      required: false 
    }
  },
  data() {
    return {
      showUpload: true,
      mediaWidth: 0,
      mediaHeight: 0,
      containerHeight: 500,
      containerWidth: 0,
      mediaLength: 0,
      mediaCurrentPosition: 0,
      mediaVolume: 0,
      mediaEl: null,
      ms: null,
      activeTabId: 1
    }
  },
  computed: {
    maxVideoWidth() {
      return (this.containerWidth + 'px')
    },
    maxVideoHeight() {
      return (this.containerHeight + 'px')
    }
  },
  watch: {
    mediaSource() {
    }
  },
  mounted() {
    this.mediaEl = this.$refs.media
    window.addEventListener('resize', () => {
      this.setContainerDimensions()
    })
  },
  destroyed() {
    window.removeEventListener('resize')
  },
  methods: {
    onUserStartSeek() {
      this.mediaEl.pause()
    },
    onUserStopSeek() {
      this.mediaEl.play()
    },
    onUserSeek(pos){
      this.mediaCurrentPosition = this.mediaEl.currentTime = this.mediaLength * pos
    },
    setContainerDimensions() {
      let mediaContainerEl = this.$refs.mediaContainer
      this.containerWidth = mediaContainerEl.clientWidth
      this.containerHeight = mediaContainerEl.clientHeight
    },
    updateMediaProgress(e) {
      this.mediaCurrentPosition = e.target.currentTime
    },
    onMetaDataLoaded(e) {
      this.mediaLength = e.target.duration
      this.mediaVolume = e.target.volume
    },
    onUserChangedVolume(pos) {
      this.mediaVolume = this.mediaEl.volume = pos
    },
    onMediaUploaded(path) {
      this.ms = path
      this.activeTabId = 2
      this.showUpload = false
    },
    onTabChange(tabId) {
      this.activeTabId = tabId
    }
  }
}
</script>

<style>
  .playback-container {
    background: #000;
    position: relative;
    z-index: 1;
    margin-top: 80px;
  }

  .tabs {
    transform: translateY(-100%);
    position: absolute;
  }

  .playback-container .upload-container {
    position: absolute;
    width: 100%;
    height: calc(100% - 40px);
    z-index: 2;
  }

  .video-container { 
    height: 500px;
    position: relative;
  }

  .video-container > video { 
    margin: 0 auto;
    width: 100%;
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .controls {
    height: 40px;
    width: 100%;
    background: #eee;
  }

  .controls > * {
    float: left;
  }

  .toggle-playback {
    width: 40px;
    height: 40px;
    position: relative;
  }

  #volume-control {
    width: 100px;
  }

  .media-playback-progress {
    width: calc(100% - 140px);
    height: 100%;
    position: relative;
  }

  .progress-clickable-area {
    height: 12px;
    width: 90%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .progress-clickable-area .progress {
    background: #BBB;
    width: 100%;
    height: 6px;
    border-radius: 0;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  #media-progress .progress-bar, 
  #volume-control .progress-bar {
    transition: width 0.1s !important;
  }
</style>

