<template>
  <div v-if="show" class="fixed inset-0 z-[9999] overflow-y-auto">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="handleCancel"></div>

    <!-- Modal container -->
    <div class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
      <!-- Modal panel -->
      <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl w-full max-w-lg pointer-events-auto">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <i class="fas fa-file-alt text-blue-600 text-xl"></i>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
                Saved Draft Found
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  We found a saved draft. Do you want to continue where you left off?
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="handleContinue"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Continue
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DraftModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['continue', 'cancel'],
  methods: {
    handleContinue() {
      this.$emit('continue')
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
/* Modal styles */
</style>
