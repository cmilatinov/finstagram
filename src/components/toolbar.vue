export
<template>
  <b-navbar type="light" variant="light" sticky>
    <b-navbar-brand><router-link to="/">FINSTAGRAM</router-link></b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item><router-link to="/post">FIT</router-link></b-nav-item>
      <b-nav-item><router-link to="/profile">PROFILE</router-link></b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default{
  name: 'component-test',
  data (){
    return{}
  }
}</script>