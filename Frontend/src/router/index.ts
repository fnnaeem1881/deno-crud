import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import Driver from '../views/Driver/driver.vue'
import DriverTripList from '../views/Driver/Triplist.vue'
import TripDetails from '../views/Driver/TripDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomePage,
      name:'Home',
      
    },
    {
      path: '/driver',
      name: 'driver',
      component: Driver,
    },
    {
      path: '/driver/trip-list', 
      name: 'driver-trip-list',
      component: DriverTripList,
    },
    {
      path: "/trip-details/:trip_id",
      name: "TripDetails",
      component: TripDetails
    },
  ],
})

export default router
