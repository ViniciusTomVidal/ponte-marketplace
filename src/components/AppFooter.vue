<template>
  <footer class="bg-ponte-blue">
    <!-- Partners Carousel Section -->
    <div class="bg-white py-12 border-b-2" style="border-bottom-color: rgb(166, 133, 66);">
      <div class="max-w-7xl mx-[132px] px-[20px]">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="w-[23%] pr-[40px]">
            <p class="w-full text-[13px] font-medium">
              Turning possibilities into financial realities. Let's build your future together!
            </p>
          </div>
          
          <div class="flex-1 w-full md:w-auto overflow-hidden">
            <swiper
              :modules="modules"
              :slides-per-view="slidesPerView"
              :space-between="30"
              :autoplay="{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }"
              :loop="true"
              :speed="300"
              class="partners-swiper"
            >
              <swiper-slide v-for="(logo, index) in partnerLogos" :key="index">
                <div class="flex items-center justify-center h-12">
                  <img 
                    :src="logo.src" 
                    :alt="logo.alt" 
                    class="h-auto w-auto object-contain hover:opacity-70 transition-opacity"
                  />
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-[80px] pb-[25px]">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 px-[20px]">
          <div class="flex flex-col">
            <img width="244" height="165"
              src="https://ponte.finance/wp-content/uploads/2024/06/web-app-manifest-512x512-1-300x300-1.png"
              class="w-[65%] mx-auto" alt="Ponte Finance Logo" />
          </div>

          <div class="flex flex-col">
            <a href="https://ponte.finance/terms-of-use-ponte-finance-plc/"
              class="text-[13px] font-medium text-white hover:underline mb-4">
              Terms of Use
            </a>
            <a href="https://ponte.finance/privacy-policy-ponte-finance-plc/"
              class="text-[13px] font-medium text-white hover:underline">
              Privacy Policy
            </a>
          </div>

          <div class="flex flex-col">
            <a href="https://ponte.finance/" class="text-[13px] font-medium text-white hover:underline mb-4">
              Home
            </a>
            <a href="https://ponte.finance/contact/" class="text-[13px] font-medium text-white hover:underline">
              Contact
            </a>
          </div>

          <div class="flex flex-col">
            <a href="https://ponte.finance/dashboard/" class="text-[13px] font-medium text-white hover:underline mb-4">
              Investor Area
            </a>
            <a href="https://ponte.finance/investments/"
              class="text-[13px] font-medium text-white hover:underline mb-4">
              Why invest in Equity
            </a>
            <a href="https://ponte.finance/investment-solicitation-letter-2/"
              class="text-[13px] font-medium text-white hover:underline mb-4">
              invest in ponte
            </a>
            <a href="https://ponte.finance/understanding-ponte-finances-bridge-loan-business/"
              class="text-[13px] font-medium text-white hover:underline">
              Ponte Loan Solutions
            </a>
          </div>

          <div class="flex flex-col">
            <p class="text-[13px] font-medium text-white mb-4">
              225 Clapham Road London SW9 9BE
            </p>
            <a href="mailto:admin@ponte.finance" class="text-[13px] font-medium text-white hover:underline mb-4">
              admin@ponte.finance
            </a>
            <!-- Social Media Links -->
            <div class="flex items-center gap-4 mb-4">
              <a 
                href="https://www.facebook.com/people/Pontefinance/61573143484708/#" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-white hover:text-[#A68542] transition-colors"
                aria-label="Facebook"
              >
                <i class="fab fa-facebook-f text-xl"></i>
              </a>
              <a 
                href="https://www.linkedin.com/company/ponte-finance-plc/?originalSubdomain=uk" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-white hover:text-[#A68542] transition-colors"
                aria-label="LinkedIn"
              >
                <i class="fab fa-linkedin-in text-xl"></i>
              </a>
            </div>
            <img width="960" height="638" src="https://ponte.finance/wp-content/uploads/2024/06/QR-codes-1024x681.png"
              class="max-w-full h-auto hidden md:block" alt="QR Codes" />
          </div>
        </div>
      </div>
    </div>
    <div class="pt-[70px] pb-[15px] flex flex-col items-center justify-center gap-[20px]">
      <p class="text-[16px] font-medium text-white">Ponte Finance promotes sustainability as a core value. <a
          href="https://ponte.finance/investing-responsibly-with-100-loan/"
          class="text-[16px] font-medium text-[#A68542] hover:underline">Click here to learn more</a>
      </p>
      <img width="300" height="100" src="https://ponte.finance/wp-content/uploads/2024/06/Ponte-Sustainable-Loan-Commitment2.png" class="aspect-[300/100]" alt="Ponte Sustainable Loan Commitment" />
      
      <div class="w-full max-w-7xl px-[20px]">
        <div class="flex flex-col items-center">
          <div class="w-full mb-4">
            <div class="border-t border-gray-400"></div>
          </div>
          <div class="py-[10px]">
            <p class="text-[13px] text-center text-[#A68542]">Copyright © 2025 By Ponte Finance. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default {
  name: 'AppFooter',
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    const modules = [Autoplay]
    const slidesPerView = ref(4)
    
    const partnerLogos = ref([
      {
        src: 'https://ponte.finance/wp-content/uploads/2025/09/22.jpg',
        alt: 'Partner Logo 1'
      },
      {
        src: 'https://ponte.finance/wp-content/uploads/2025/09/21.jpg',
        alt: 'Partner Logo 2'
      },
      {
        src: 'https://ponte.finance/wp-content/uploads/2025/09/19.jpg',
        alt: 'Partner Logo 3'
      },
      {
        src: 'https://ponte.finance/wp-content/uploads/2025/09/18.jpg',
        alt: 'Partner Logo 4'
      },
      {
        src: 'https://ponte.finance/wp-content/uploads/2025/10/iden-new.png',
        alt: 'iDenfy'
      },
      {
        src: 'https://ponte.finance/wp-content/uploads/2025/10/iden-new1.png',
        alt: 'Partner Logo 6'
      }
    ])

    const updateSlidesPerView = () => {
      if (window.innerWidth < 768) {
        slidesPerView.value = 2
      } else {
        slidesPerView.value = 3
      }
    }

    onMounted(() => {
      updateSlidesPerView()
      window.addEventListener('resize', updateSlidesPerView)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateSlidesPerView)
    })

    return {
      partnerLogos,
      modules,
      slidesPerView
    }
  }
}
</script>
