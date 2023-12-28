

<template>
  <div class="main-wrapper">
    <BannerSection></BannerSection>
    <ServicesSection></ServicesSection>
    <AppDownloadSection></AppDownloadSection>
    <ContactSection></ContactSection>
  </div>
</template>
<script lang="ts">
import BannerSection from '../views/Homepage/BannerSection.vue'
import ServicesSection from '../views/Homepage/ServicesSection.vue'
import AppDownloadSection from '../views/Homepage/AppDownloadSection.vue'
import ContactSection from '../views/Homepage/ContactSection.vue'

export default {
  name: "HomePage",
  components:{
    BannerSection,
    ServicesSection,
    AppDownloadSection,
    ContactSection,
  },
  props: {
    loggedIn: Boolean,
    base_url: String,
  },
  mounted() {
  },
};
</script>
<style scoped>

</style>
