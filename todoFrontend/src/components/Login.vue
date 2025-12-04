<script setup lang="ts">
import RegisterNow from './RegisterNow.vue';

</script>

<template>
    <h2>Login</h2>
    <form>
        <label for="username">Username:</label>
        <input id="username" type="text" required></input>
        <label for="password">Password:</label>
        <input id="password" type="password" required></input>
        <button>Submit</button>
    </form>
    <RegisterNow></RegisterNow>
</template>

<style scoped>
</style>