<template>
  <transition name="slide-fade">
    <div v-if="show" 
         class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px] max-w-md">
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-green-600 text-xl"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-green-900">Success!</p>
          <p class="text-xs text-green-700">{{ message }}</p>
        </div>
        <button 
          @click="close" 
          class="flex-shrink-0 text-green-600 hover:text-green-800"
          aria-label="Close notification"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { watch } from 'vue'

export default {
  name: 'SuccessNotification',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    autoCloseDelay: {
      type: Number,
      default: 5000
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const close = () => {
      emit('close')
    }

    watch(() => props.show, (newVal) => {
      if (newVal && props.autoClose) {
        setTimeout(() => {
          close()
        }, props.autoCloseDelay)
      }
    })

    return {
      close
    }
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}
</style>

