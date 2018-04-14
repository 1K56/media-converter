<template>
  <div class="playback-col col-md-8">
    <div class="playback-container">
      <div 
        ref="mediaContainer"
        class="video-container">
        <div class="video-overlay">
          <span />
        </div>
        <video 
          ref="media"
          :src="mediaSource"
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
  </div>
</template>

<script>
import ProgressComponent from './ProgressComponent'
import SeekableProgressComponent from './SeekableProgressComponent'

export default {
  components: {
    ProgressComponent,
    SeekableProgressComponent
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
      mediaWidth: 0,
      mediaHeight: 0,
      containerHeight: 500,
      containerWidth: 0,
      mediaLength: 0,
      mediaCurrentPosition: 0,
      mediaVolume: 0
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
    window.addEventListener('resize', () => {
      this.setContainerDimensions()
    })
  },
  destroyed() {
    window.removeEventListener('resize')
  },
  methods: {
    onUserStartSeek() {
      this.$refs.media.pause()
    },
    onUserStopSeek() {
      this.$refs.media.play()
    },
    onUserSeek(pos){
      this.mediaCurrentPosition = this.$refs.media.currentTime = this.mediaLength * pos
    },
    setContainerDimensions() {
      this.containerWidth = this.$refs.mediaContainer.clientWidth
      this.containerHeight = this.$refs.mediaContainer.clientHeight
    },
    updateMediaProgress(e) {
      this.mediaCurrentPosition = e.target.currentTime
    },
    onMetaDataLoaded(e) {
      this.mediaLength = e.target.duration
      this.mediaVolume = e.target.volume
    },
    onUserChangedVolume(pos) {
      this.mediaVolume = this.$refs.media.volume = pos
    }
  },
}
</script>

<style>
  .playback-container {
    background: #000;
  }

  .video-container { 
    height: 500px;
    position: relative;
  }

  .video-container > video { 
    margin: 0 auto;
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

