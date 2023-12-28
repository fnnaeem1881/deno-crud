<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./views/layout/Header.vue";
import Footer from "./views/layout/footer.vue";
import axios from "axios";

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      loggedIn: false,
      base_url:'http://127.0.0.1:8000',
      user: [],
    };
  },
  mounted() {
    this.CheckToken();
  },
  methods:{
    CheckToken(){
      if (this.isAccessTokenExpired()) {
              this.refreshAccessToken();
        } else if(this.isRefreshTokenExpired()){
              this.loggedIn=false;
          }else{
            this.GetUser();

          }
    },
    GetUser() {

          const access_token = sessionStorage.getItem('access_token');
          axios.get(`${this.base_url}/user`, 
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
            )
            .then((response) => {
                console.log(response);

                this.loggedIn=true;
                this.user=response.data.user;
                console.log("Access token refreshed successfully");
            })
            .catch((error) => {
                console.error("Error refreshing access token", error);
            });
      },
      isAccessTokenExpired() {
          const expiration = sessionStorage.getItem('access_token_expiration');
          return expiration && Date.now() > parseInt(expiration, 10);
      },
      isRefreshTokenExpired() {
          const expiration = sessionStorage.getItem('refresh_token_expiration');
          return expiration && Date.now() > parseInt(expiration, 10);
      },

      refreshAccessToken() {
          const refreshToken = sessionStorage.getItem('refresh_token');
          axios.post(`${this.base_url}/refresh-token`,{},
          {
              headers: {
                  Authorization: `Bearer ${refreshToken}`,
              },
          }
          )
          .then((response) => {
              const { access_token, refresh_token, accessTokenExpiresIn, refreshTokenExpiresIn } = response.data;

              const accessTokenExpiration = Date.now() + accessTokenExpiresIn * 1000;
              const refreshTokenExpiration = Date.now() + refreshTokenExpiresIn * 1000;
              sessionStorage.setItem('access_token', access_token);
              sessionStorage.setItem('refresh_token', refresh_token);
              sessionStorage.setItem('access_token_expiration', accessTokenExpiration.toString());
              sessionStorage.setItem('refresh_token_expiration', refreshTokenExpiration.toString());
              this.GetUser();
              console.log("Refresh token refreshed successfully");
          })
          .catch((error) => {
              console.error("Error refreshing access token", error);
          });
      },
      handleLogout() {
        this.loggedIn = false;
        this.user = [];
        this.$router.push('/');
      },
      
    }
};
</script>

<template>
  <Header :base_url="base_url" :loggedIn="loggedIn" :user="user" @login-success="CheckToken" @logout="handleLogout"></Header>
  <router-view :base_url="base_url" :loggedIn="loggedIn" :user="user"></router-view>
  <Footer :base_url="base_url" :loggedIn="loggedIn" :user="user"></Footer>
</template>

<style scoped>
</style>
