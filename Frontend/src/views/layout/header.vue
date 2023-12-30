
<template>
  <header class="header-wrapper">
    <div class="container">
        <div class="col-md-12">
            <nav class="navbar">
                <div class="container-fluid">
                    <a class="navbar-brand m-0" href="/">
                        <img src="https://garibook.com/dashboard/new-ui/assets/image/icon/logo.png" alt="Logo" width="200" class="d-inline-block align-text-top" />
                    </a>
                    <div class="d-flex">
                        <div v-if="loggedIn==true" class="dropdown user-dropdown">
                            <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <img class="user-image"
                                    src="#">
                            </a>

                            <ul class="dropdown-menu  dropdown-menu-end fade">
                                <li>
                                    <router-link class="dropdown-item" :to="{ name: 'driver' }">Dashboard</router-link>
                                    <router-link class="dropdown-item" :to="{ name: 'driver-trip-list' }">Trips</router-link>
                                </li>
                                <li>
                                    
                                    <a href="#" @click="logout()" class="dropdown-item"><b>Logout</b></a>
                                </li>
                            </ul>
                        </div>
                        <div v-else class="auth-header-wrap d-flex gap-2">
                            <button type="button" class="btn-theme-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                                Sign In
                            </button>
                            <!-- <button type="button" class="btn-theme-secondary" data-bs-toggle="modal" data-bs-target="#registerModal">
                                Register
                            </button> -->
                        </div>
                        <!-- login Modal -->
                        <div class="modal fade theme-tab-model" id="loginModal" tabindex="-1"  aria-labelledby="loginModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header p-0 border-0">
                                        <nav class="auth-tab-header w-100">
                                            <div class="nav nav-tabs w-100 bg-light" role="tablist">
                                                <button class="nav-link driver active w-100 py-3" id="nav-driverLogin-tab" data-bs-toggle="tab" data-bs-target="#nav-driverLogin" type="button" role="tab" aria-controls="nav-home" aria-selected="true" >
                                                    Sign in
                                                </button>
                                                <!-- <button
                                                    class="nav-link customer w-50 py-3"
                                                    id="nav-customerLogin-tab"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#nav-customerLogin"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="nav-profile"
                                                    aria-selected="false"
                                                >
                                                    Customer Sign in
                                                </button> -->
                                            </div>
                                        </nav>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="login-form-wrapper">
                                            <div class="tab-content">
                                                <div class="tab-pane fade show active" id="nav-driverLogin" role="tabpanel" aria-labelledby="nav-driverLogin-tab" tabindex="0">
                                                    <!-- <form method="POST" action="#" id="driverLoginForm"> -->
                                                        <div class="mb-3">
                                                            <label for="usermail" class="form-label">Phone Number</label>
                                                            <input type="number" placeholder="Phone Number" class="form-control" v-model="form.mobile" id="usermail" />
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="userPassword" class="form-label">Password</label>
                                                            <input type="password" placeholder="password" class="form-control"  v-model="form.password" id="userPassword" />
                                                        </div>
                                                        <button @click="login()" class="btn-theme-primary w-100">
                                                            Login
                                                        </button>
                                                    <!-- </form> -->

                                                </div>
                                                <div class="tab-pane fade" id="nav-customerLogin" role="tabpanel" aria-labelledby="nav-customerLogin-tab" tabindex="0">
                                                    <form method="post" action="/customer-login" id="customerLoginForm">
                                                        <div class="mb-3">
                                                            <label for="usermail" class="form-label">Email address</label>
                                                            <input type="email" class="form-control" name="email" id="email" aria-describedby="emailHelp" />
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="userPassword" class="form-label">Password</label>
                                                            <input type="password" class="form-control" name="password" id="userPassword" />
                                                        </div>
                                                        <button type="submit" class="btn-theme-secondary w-100">
                                                            Login
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Register Modal -->
                        <div class="modal fade theme-tab-model" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header p-0 border-0">
                                        <nav class="auth-tab-header w-100">
                                            <div class="nav nav-tabs w-100" role="tablist">
                                                <button class="nav-link driver active w-50 py-3" id="nav-driverResister-tab" data-bs-toggle="tab" data-bs-target="#nav-driverResister" type="button" role="tab" aria-controls="nav-home" aria-selected="true"> Driver Register</button>
                                                <button class="nav-link customer w-50 py-3" id="nav-customerResister-tab" data-bs-toggle="tab" data-bs-target="#nav-customerResister" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"> Customer Register </button>
                                            </div>
                                        </nav>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="error_div mt-3">
                                            <!-- {% if error_customer %}
                                                <div class="alert alert-danger" role="alert">
                                                    {{ error_customer }}
                                                </div>
                                                {% elif success_customer %}
                                                <div class="alert alert-success" role="alert">
                                                    {{ success_customer }}
                                                </div>
                                                {% endif %} -->
                                        </div>
                                        <div class="register-form-wrapper">
                                            <div class="tab-content">
                                                <div class="tab-pane fade show active" id="nav-driverResister" role="tabpanel" aria-labelledby="nav-driverResister-tab" tabindex="0">
                                                    <form action="/driver/register/submit" method="post" enctype="multipart/form-data">
                                                        <div class="form-floating mb-3">
                                                            <input type="text" class="form-control" name="name" id="name" placeholder="Driver Name ... " />
                                                            <label for="name">Name</label>
                                                        </div>
                                                        <div class="form-floating mb-3">
                                                            <input type="email" class="form-control" name="email" id="email" placeholder="name@example.com" />
                                                            <label for="name">Email Address</label>
                                                        </div>
                                                        <div class="form-floating mb-3">
                                                            <input type="password" class="form-control" name="password" id="password" placeholder="*********" />
                                                            <label for="password">Password</label>
                                                        </div>
                                                        <div class="form-floating mb-3">
                                                            <input type="password" class="form-control" name="confirm_password" id="confirm_password" placeholder="*********" />
                                                            <label for="confirm_password">Confirm Password</label>
                                                        </div>
                                                        <div class="form-group mb-3">
                                                            <input type="file" class="form-control" name="image" id="image" />
                                                        </div>
                                                        <input type="submit" class="btn btn-primary" value="Driver Register" />
                                                    </form>
                                                </div>
                                                <div class="tab-pane fade" id="nav-customerResister" role="tabpanel" aria-labelledby="nav-customerResister-tab" tabindex="0">
                                                    <form action="/customer/register/submit" method="post" enctype="multipart/form-data">
                                                        <div class="form-floating mb-3">
                                                            <input type="text" class="form-control" name="name" id="name" placeholder="Driver Name ... " />
                                                            <label for="name">Name</label>
                                                        </div>
                                                        <div class="form-floating mb-3">
                                                            <input type="email" class="form-control" name="email" id="email" placeholder="name@example.com" />
                                                            <label for="name">Email Address</label>
                                                        </div>
                                                        <div class="form-floating mb-3">
                                                            <input type="password" class="form-control" name="password" id="password" placeholder="*********" />
                                                            <label for="password">Password</label>
                                                        </div>
                                                        <div class="form-floating mb-3">
                                                            <input type="password" class="form-control" name="confirm_password" id="confirm_password" placeholder="*********" />
                                                            <label for="confirm_password">Confirm Password</label>
                                                        </div>
                                                        <div class="form-group mb-3">
                                                            <input type="file" class="form-control" name="image" id="image" placeholder="name@example.com" />
                                                        </div>
                                                        <input type="submit" class="btn btn-success" value="Customer Register" />
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </nav>
        </div>
    </div>
</header>

</template>

<script lang="ts">
import axios from "axios";

export default {
  name: "header",
  data() {
    return {
      form:{
        mobile:'',
        password:'',
      }
    };
  },
  props: {
    loggedIn:Boolean,
    base_url: String,
    user: Object ,
  },
  mounted() {
  },
  methods: {
    login() {
        if (this.form.mobile === '') {
            alert('Phone Number is Required');
        } else if (this.form.password === '') {
            alert('Password is Required');
        } else {
            axios.post(`${this.base_url}/login`,
                {
                    mobile: this.form.mobile,
                    password: this.form.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                const { access_token, refresh_token, userId, name, accessTokenExpiresIn, refreshTokenExpiresIn } = response.data;

                const accessTokenExpiration = Date.now() + accessTokenExpiresIn * 1000;
                const refreshTokenExpiration = Date.now() + refreshTokenExpiresIn * 1000;
                sessionStorage.setItem('access_token', access_token);
                sessionStorage.setItem('refresh_token', refresh_token);
                sessionStorage.setItem('access_token_expiration', accessTokenExpiration.toString());
                sessionStorage.setItem('refresh_token_expiration', refreshTokenExpiration.toString());
                console.log("Tokens and user information set in session storage");
                $('#loginModal').modal('hide');

                this.$emit("login-success");

            })
            .catch((error) => {
                console.log(error.response.data);
                alert(error.response.data.message);
                console.error(error);
            });
        }
    },
    logout() {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token_expiration');
      sessionStorage.removeItem('refresh_token_expiration');

      this.$emit('logout'); 
    },

  },
};
</script>
<style scoped>
</style>
