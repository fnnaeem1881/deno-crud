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
                                <ul class="chat">
                                    <li v-for="(item, index) in bids" :key="index" class="agent clearfix user-6">
                                        <span class="chat-img left clearfix mx-2"><img src="/assets/image/customer_image/avatar-02.jpg" alt="Agent" class="img-circle" /></span>
                                        <div class="chat-body clearfix">
                                            <div class="header clearfix">
                                                <strong class="primary-font">driver</strong><small class="right text-muted"><span class="glyphicon glyphicon-time"></span>{{DateTimeFormat(item.created_at)  }} ago</small>
                                            </div>
                                            <p>Amount: {{ item.amount }}</p>
                                        </div>
                                    </li>
                                </ul>

                            </div>
                            <div class="card-footer">

                                <div v-if="trips.driver_id == null" class="input-group">
                                    <input id="btn-input" v-model="form.amount" type="number" class="form-control input-sm"
                                        placeholder="Type your message here..." />
                                    <span class="input-group-btn">
                                        <button @click="BidStore()" :disabled="BidStoreButton" class="btn btn-primary" id="btn-chat">
                                            Submit
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
    import moment from 'moment';

    export default {
        name: "Trip-Details",
        data() {
            return {
                trips:[],
                bids:[],
                trip_id:null,
                BidStoreButton:true,
                form:{
                    amount:'',
                }
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
                      this.trip_id=response.data[0].id;
                      this.BidGet();
                      this.BidStoreButton=false
                  })
                  .catch((error) => {
                      console.error("Error refreshing access token", error);
                  }); 
            },
            BidGet() {
                const access_token = sessionStorage.getItem('access_token');
                axios.get(`${this.base_url}/bid/${this.trip_id}`, 
                  {
                      headers: {
                          Authorization: `Bearer ${access_token}`,
                      },
                  }
                  )
                  .then((response) => {
                    this.bids=response.data;
                      console.log('bids',response);
                    
                  })
                  .catch((error) => {
                      console.error("Error refreshing access token", error);
                  }); 
            },
            BidStore() {
                this.BidStoreButton=true;
                const access_token = sessionStorage.getItem('access_token');
                if (this.form.amount === '') {
                    alert('Amount is Required');
                }else if (this.trip_id === null) {
                    alert('Somthing went wrong');
                }else {
                    axios.post(`${this.base_url}/bid`,
                        {
                            amount: this.form.amount,
                            trip_id: this.trip_id,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                        }
                    )
                    .then((response) => {
                        console.log(response);
                        this.BidGet();
                        this.form.amount='';
                        this.BidStoreButton=false
                    })
                    .catch((error) => {
                        console.log(error.response.data);
                        alert(error.response.data.message);
                        console.error(error);
                    });
                }
            },
            DateTimeFormat(data){
                if (data) {
                    return moment(String(data)).fromNow(true);
                }
            }
        }
    }
    </script>
    
    <style>
    
    </style>