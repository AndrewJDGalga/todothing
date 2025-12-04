<script setup lang="ts">
import RegisterNow from './RegisterNow.vue';

</script>

<template>
    <div>
        <h2>Login</h2>
        <form>
            <label for="username">Username:</label>
            <input id="username" type="text" required></input>
            <label for="password">Password:</label>
            <input id="password" type="password" required></input>
            <button>Submit</button>
        </form>
        <RegisterNow></RegisterNow>
    </div>
</template>

<style scoped>
    div, form {
        width: fit-content;
        margin: 0 auto;
    }
    h2{
        text-align: center;
    }
    form {
        margin: 16px auto;
        display: flex;
        flex-direction: column;
    }
</style>