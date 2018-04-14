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
        <div class="media-playback-progress">
          <div 
            ref="clickableArea"
            class="progress-clickable-area"
            @mousedown="startSeeking">
            <div class="rp">
              <progress-component
                id="media-progress"
                :progress-loaded="mediaCurrentPosition"
                :progress-total="mediaLength"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressComponent from './ProgressComponent'

export default {
  components: {
    ProgressComponent
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
      seeking: false
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
    let clickableArea = this.$refs.clickableArea

    window.addEventListener('resize', () => {
      this.setContainerDimensions()
    })

    window.addEventListener('mouseup', () => {
      if(this.seeking){
        this.stopSeeking()
      }
    })

    document.body.addEventListener('mousemove', (e) => {
      if(!this.seeking) {
        return
      }

      let elPosX = clickableArea.getBoundingClientRect().left
      let mousePosX = e.pageX 

      var relativeMousePosX = mousePosX - elPosX

      if (relativeMousePosX > clickableArea.clientWidth) {
        relativeMousePosX = clickableArea.clientWidth
      }
      
      if (relativeMousePosX < 0) {
        relativeMousePosX = 0
      }

      this.seek({offsetX: relativeMousePosX})
    })
  },
  destroyed() {
    window.removeEventListener('resize')
    window.removeEventListener('mouseup')
    document.body.removeEventListener('mousemove')
  },
  methods: {
    startSeeking(e) {
      if(!this.mediaSource) {
        return
      }
      this.seeking = true
      this.$refs.media.pause()
      this.seek(e)
    },
    stopSeeking() {
      this.seeking = false
      this.$refs.media.play()
    },
    seek(e) {
      if (!this.seeking) {
        return
      }
      this.mediaCurrentPosition = this.mediaLength * (e.offsetX/this.$refs.clickableArea.clientWidth)
      this.$refs.media.currentTime = this.mediaCurrentPosition
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

  .media-playback-progress {
    width: calc(100% - 40px);
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

  #media-progress .progress-bar {
    transition: width 0.1s !important;
  }
</style>

