<template>
  <div class="relative" ref="sortDropdown">
    <button 
      @click="toggleSort"
      :class="[
        'px-4 py-2 text-sm border rounded-lg transition-colors flex items-center',
        showSortMenu ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
      ]"
    >
      <i class="fas fa-sort mr-2"></i>
      Sort
      <i :class="['ml-2', showSortMenu ? 'fas fa-chevron-up' : 'fas fa-chevron-down']"></i>
    </button>

    <transition name="fade">
      <div 
        v-if="showSortMenu"
        class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      >
        <div class="py-1">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="selectSort(option.value)"
            :class="[
              'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between',
              currentSort === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            ]"
          >
            <span>{{ option.label }}</span>
            <i v-if="currentSort === option.value" class="fas fa-check text-blue-600"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'PropertySort',
  props: {
    modelValue: {
      type: String,
      default: 'date_desc'
    }
  },
  emits: ['update:modelValue', 'sort'],
  setup(props, { emit }) {
    const showSortMenu = ref(false)
    const sortDropdown = ref(null)
    const currentSort = ref(props.modelValue)

    const sortOptions = [
      { value: 'date_desc', label: 'Newest First' },
      { value: 'date_asc', label: 'Oldest First' },
      { value: 'title_asc', label: 'Title (A-Z)' },
      { value: 'title_desc', label: 'Title (Z-A)' },
      { value: 'value_desc', label: 'Highest Value' },
      { value: 'value_asc', label: 'Lowest Value' }
    ]

    const toggleSort = () => {
      showSortMenu.value = !showSortMenu.value
    }

    const selectSort = (sortValue) => {
      currentSort.value = sortValue
      emit('update:modelValue', sortValue)
      emit('sort', sortValue)
      showSortMenu.value = false
    }

    const handleClickOutside = (event) => {
      if (sortDropdown.value && !sortDropdown.value.contains(event.target)) {
        showSortMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      showSortMenu,
      sortDropdown,
      currentSort,
      sortOptions,
      toggleSort,
      selectSort
    }
  }
}
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.2s ease;
}

.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

