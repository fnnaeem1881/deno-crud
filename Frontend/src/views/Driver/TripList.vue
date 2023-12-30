<template>
<div>
   <!-- Breadscrumb Section -->
   <div class="breadcrumb-bar">
        <div class="container">
            <div class="row align-items-center text-center">
                <div class="col-md-12 col-12">
                    <h2 class="breadcrumb-title">Trip List</h2>
                    <nav aria-label="breadcrumb" class="page-breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><router-link :to="{ name: 'Home' }">Home</router-link></li>
                            <li class="breadcrumb-item active" aria-current="page">Trip list</li>
                        </ol>
                    </nav>							
                </div>
            </div>
        </div>
    </div>
    <!-- /Breadscrumb Section -->
    <div class="trip-list-wrapper mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="table-responsive">
                        <table id="example" class="display nowrap table" style="width:100%">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Car Name</th>
                                    <th scope="col">Pickup location </th>
                                    <th scope="col">Destination</th>
                                    <th scope="col">Booking Time</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody id="TripListShow">
                                 <tr v-for="(item, index) in trips" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <th >{{ item.car_name }}</th>
                                    <th >{{ item.pick_up_location }}</th>
                                    <th >{{ item.destination }}</th>
                                    <td><p class="text-success m-0"><b> </b> {{ DateTimeFormat(item.created_at) }}</p> </td>
                                    <td>
                                        <button type="button" @click="TripDetails(item.id)" class="btn btn-info text-white">Bid Now</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import axios from "axios";
import Pusher from 'pusher-js';
import moment from 'moment';

export default {
    name: "Driver-Trip-List",
    data() {
        return {
            trips:[],
        };
    },
    mounted(){
        setTimeout(() => {
            if (this.loggedIn ==false) {
                this.$router.push("/");
            }
        }, 100);
        this.GetTrips();
        Pusher.logToConsole = true;
            var pusher = new Pusher('1ee622cf7ae9168aca28', {
            cluster: 'ap2'
        });
        var channel = pusher.subscribe('trips-channel');
        channel.bind('trips-event', (data) => {
            console.log('Puhsher Work',data);
            this.GetTrips();
        });
    },
    props: {
        loggedIn: Boolean,
        base_url: String,
    },
    methods:{
        GetTrips() {
            const access_token = sessionStorage.getItem('access_token');
            axios.get(`${this.base_url}/trips`, 
              {
                  headers: {
                      Authorization: `Bearer ${access_token}`,
                  },
              }
              )
              .then((response) => {
                this.trips=response.data.trips;
                  console.log('trips',response);
                
              })
              .catch((error) => {
                  console.error("Error refreshing access token", error);
              }); 
        },
        TripDetails(trip_id){
            this.$router.push({ name: 'TripDetails', params: { trip_id: trip_id } });
        },
        DateTimeFormat(data){
            if (data) {
                return moment(String(data)).format('LLL');
            }
        }
        
    }
}
</script>

<style>

</style>