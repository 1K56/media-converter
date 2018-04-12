import { mount } from 'vue-test-utils'
import expect from 'expect'
import UploadComponent from '../../src/components/UploadComponent'
import Vue from 'vue'

describe('UploadComponent', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(UploadComponent)
  })

  it('should return one error if the file size is too large', () => {
    let file = {
      size: 8225937,
      type: 'video/webm'
    }

    wrapper.vm.validateFile(file)
    expect(wrapper.vm.errors.length).toBe(1)
  })

  it('should return one error if the file type is not mp4 or webm', () => {
    let file = {
      size: 4194304,
      type: 'not mp4 or webm'
    }
    
    wrapper.vm.validateFile(file)
    expect(wrapper.vm.errors.length).toBe(1)
  })

  it('shouldn\'t return errors for a file that\'s a webm and has =< 4Mb size', () => {
    let file = {
      size: 4194304,
      type: 'video/webm'
    }
    wrapper.vm.validateFile(file)
    expect(wrapper.vm.errors.length).toBe(0)
  })

  it('should return two errors if both file size is too large and the file type is not mp4 or webm', () => {
    let file = {
      size: 1943139304,
      type: 'not mp4 or webm'
    }

    wrapper.vm.validateFile(file)
    expect(wrapper.vm.errors.length).toBe(2)
  })

  it('shouldn\'t return errors for a file that\'s an mp4 and has =< 4Mb size', () => {
    let file = {
      size: 4194304,
      type: 'video/mp4'
    }
    wrapper.vm.validateFile(file)
    expect(wrapper.vm.errors.length).toBe(0)
  })

  it('should create DOM elements for errors and display them', () => {
    let file = {
      size: 1943139304,
      type: 'not mp4 or webm'
    }
    wrapper.vm.validateFile(file)
    wrapper.vm.uploadState = 'ERROR'
    Vue.nextTick(() => {
      expect(wrapper.findAll('.upload-error-message').length).toBe(2)
    })
  })


  it('should set draggedOver variable to true if user hovers a file over upload container ', () => {
    wrapper.find('.upload-container').trigger('dragenter')
    expect(wrapper.vm.draggedOver).toBe(true)
  })

  it('should set draggedOver variable to false if user hovers a file over upload container and then hovers out', () => {
    wrapper.find('.upload-container').trigger('dragenter')
    wrapper.find('.upload-container').trigger('dragleave')
    expect(wrapper.vm.draggedOver).toBe(false)
  })

  it('should have a dragged-over class when dragenter event is fired', () => {
    let container = wrapper.find('.upload-container')
    container.trigger('dragenter')
    expect(container.classes()).toContain('dragged-over')
  })

  it('should not have dragged-over class when drop event is fired', () => {
    let container = wrapper.find('.upload-container')
    let file = {
      size: 1943139304,
      type: 'not mp4 or webm'
    }
    
    container.trigger('drop', {
      dataTransfer: {
        files: [file]
      }
    })
    expect(container.classes()).not.toContain('dragged-over')
  })

  it('should set uploadState to UPLOADING when drop event is fired', (done) => {
    let container = wrapper.find('.upload-container')
    let file = new Blob(['content'], {type: 'video/webm'})
    wrapper.vm.processBeforeUpload(file)
    .then(() => {
      done()
    })
    .catch(() => {
      done()
    })
    expect(wrapper.vm.uploadState).toBe('UPLOADING')
  })

  it('should set uploadState to SUCCESSFUL if server returns success message', () => {
    let res = {
      data: {
        status: 'success',
        path: 'random/path/somewhere'
      }
    }
    wrapper.vm.onFileUploaded(res)
    expect(wrapper.vm.uploadState).toBe('SUCCESSFUL')
  })

  it('should set uploadState to ERROR if server returns error message', () => {
    let res = {
      data: {
        status: 'error',
        path: 'random/path/somewhere'
      }
    }
    wrapper.vm.onFileUploaded(res)
    expect(wrapper.vm.uploadState).toBe('ERROR')
  })

  it('should show uploading status message container when uploadState is INITIAL', () => {
    wrapper.vm.uploadState = 'INITIAL'
    Vue.nextTick(() => {
      expect(wrapper.find('.upload-initial').exists()).toBe(true)
    })
  })

  it('should show uploading status message container when uploadState is UPLOADING', () => {
    wrapper.vm.uploadState = 'UPLOADING'
    Vue.nextTick(() => {
      expect(wrapper.find('.upload-uploading').exists()).toBe(true)
    })
  })

  it('should show success status message container when uploadState is SUCCESSFUL', () => {
    wrapper.vm.uploadState = 'SUCCESSFUL'
    Vue.nextTick(() => {
      expect(wrapper.find('.upload-successful').exists()).toBe(true)
    })
  })

  it('should show error status message container when uploadState is ERROR', () => {
    wrapper.vm.uploadState = 'ERROR'
    Vue.nextTick(() => {
      expect(wrapper.find('.upload-error').exists()).toBe(true)
    })
  })
})