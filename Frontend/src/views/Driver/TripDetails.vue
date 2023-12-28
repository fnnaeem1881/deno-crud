<template>
    <div>
       <!-- Breadscrumb Section -->
       <div class="breadcrumb-bar">
            <div class="container">
                <div class="row align-items-center text-center">
                    <div class="col-md-12 col-12">
                        <h2 class="breadcrumb-title">Trip Details</h2>
                        <nav aria-label="breadcrumb" class="page-breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link :to="{ name: 'Home' }">Home</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">Show Bid</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- /Breadscrumb Section -->
        <div class="page-title-wrapper mt-5">
            <div class="container">
                <div class="row bg-body-tertiary">
                    <div class="col-md-12">
                        <div class="trip-basic-information table-responsive">
                            <table class="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td><b>Car Name: </b> {{trips.car_name}}</td>
                                        <td>
                                            <b>Booking Date: </b>
                                            <span id="formattedDate">{{trips.created_at}}</span>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td><b>Pick up location: </b> {{trips.pick_up_location}}</td>
                                        <td><b>Destination: </b> {{trips.destination}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="chat-wrapper mt-3">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 mx-auto">
                        <div class="card mb-4">
                            <div class="card-header text-center">
                                <span>Trip Bid</span>
                            </div>
                            <div class="card-body chat-care">
                                <ul class="TripBidings">

                                </ul>
                            </div>
                            <div class="card-footer">

                                <div v-if="trips.driver_id == null" class="input-group">
                                    <input id="btn-input" name="amount" type="number" class="form-control input-sm"
                                        placeholder="Type your message here..." />
                                    <span class="input-group-btn">
                                        <button class="btn btn-primary" id="btn-chat">
                                            Send
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    </template>
    
    <script lang="ts">
    import axios from "axios";
    
    export default {
        name: "Trip-Details",
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
            this.TripDetails();
        },
        props: {
            loggedIn: Boolean,
            base_url: String,
        },
        methods:{
            TripDetails() {
                const access_token = sessionStorage.getItem('access_token');
                axios.get(`${this.base_url}/trips/${this.$route.params.trip_id}`, 
                  {
                      headers: {
                          Authorization: `Bearer ${access_token}`,
                      },
                  }
                  )
                  .then((response) => {
                    this.trips=response.data[0];
                      console.log('trips',response);
                    
                  })
                  .catch((error) => {
                      console.error("Error refreshing access token", error);
                  }); 
            }
        }
    }
    </script>
    
    <style>
    
    </style>