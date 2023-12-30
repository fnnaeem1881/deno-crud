<template>
  <h1>Driver id {{ user.id }}</h1>
  <h1>Driver Name {{ user.name }}</h1>
  <h1>Driver Mobile {{ user.mobile }}</h1>
</template>

<script lang="ts">
export default {
  props: {
    loggedIn: Boolean,
    base_url: String,
    user: Object,
  },
};
</script>

<style>
</style>