<template>
  <div id="app" class="min-h-screen">
    <router-view />
    <GlobalLoading />
    <RouteLoading />
  </div>
</template>

<script>
import GlobalLoading from '@/components/GlobalLoading.vue';
import RouteLoading from '@/components/RouteLoading.vue';

export default {
  name: 'App',
  components: {
    GlobalLoading,
    RouteLoading
  }
}
</script>
