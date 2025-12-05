<script setup lang="ts">
    import { RouterLink } from 'vue-router';
</script>

<template>
    <div>
        <p>Don't have an account?</p>
        <RouterLink to="/register">Register Now</RouterLink>
    </div>
</template>

<style scoped>
    div {
        width: fit-content;
        margin: 8px auto;
        display: flex;
        flex-direction: column;
    }
    p{
        margin: 0;
    }
    a {
        color: black;
        text-decoration: none;
        background-color: white;
        border: solid black 1px;
        border-radius: 4px;
        padding: 2px 4px;
    }
    a:hover {
        background-color: black;
        color: white;
    }
</style>