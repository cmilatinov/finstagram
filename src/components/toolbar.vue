export
<template>
  <b-navbar type="light" variant="light" sticky>
    <b-navbar-brand>
      <router-link to="/">FINSTAGRAM</router-link>
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-form>
        <b-form-input placeholder="Search"></b-form-input>
        <b-button typer="submit">Search</b-button>
      </b-nav-form>
      <b-nav-item>
        <router-link to="/post">POST</router-link>
      </b-nav-item>
      <b-nav-item>
        <router-link to="/profile">PROFILE</router-link>
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: "component-test",
  data() {
    return {};
  }
};
</script>
