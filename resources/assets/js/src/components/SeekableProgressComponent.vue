<template>
  <div class="seekable-progress rp">
    <div 
      ref="clickableArea"
      class="progress-clickable-area"
      @mousedown="startSeeking">
      <div class="rp">
        <progress-component
          :progress-loaded="progressLoaded"
          :progress-total="progressTotal"/>
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
  data() {
    return {
      seeking: false
    }
  },
  mounted() {
    let clickableArea = this.$refs.clickableArea

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
    window.removeEventListener('mouseup')
    document.body.removeEventListener('mousemove')
  },
  methods: {
    startSeeking(e) {
      this.seeking = true
      this.$emit('user-start-seek')
      this.seek(e)
    },
    stopSeeking() {
      this.seeking = false
      this.$emit('user-stop-seek')
    },
    seek(e) {
      if (!this.seeking) {
        return
      }

      this.$emit('user-seek', (e.offsetX/this.$refs.clickableArea.clientWidth))
    },
  }
}
</script>