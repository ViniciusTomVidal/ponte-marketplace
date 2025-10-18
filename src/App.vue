<template>
  <div id="app" class="min-h-screen">
    <router-view />
    <GlobalLoading />
  </div>
</template>

<script>
import GlobalLoading from '@/components/GlobalLoading.vue';

export default {
  name: 'App',
  components: {
    GlobalLoading
  }
}
</script>
