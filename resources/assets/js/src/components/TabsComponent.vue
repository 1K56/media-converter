<template>
  <div class="tabs">
    <ul 
      class="nav nav-tabs"
      @click.prevent="setTab">
      <li 
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-item">
        <a 
          :class="{'active' : tab.id === activeTabId}"
          :data-id="tab.id"
          class="nav-link"
          href="#">{{ tab.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    externalActiveTabId: {
      required: false,
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      tabs: [
        {
          id: 1,
          name: 'Upload'
        },
        {
          id: 2,
          name: 'Playback'
        },
        {
          id: 3,
          name: 'Library'
        }
      ],
      activeTabId: 1
    }
  },
  watch: {
    externalActiveTabId() {
      this.activeTabId = this.externalActiveTabId
    }
  },
  methods: {
    setTab(e) {
      let tabId = e.target.getAttribute('data-id')
      this.activeTabId = parseInt(tabId)
      this.$emit('tabChange', this.activeTabId)
    }
  }
}
</script>

