<script setup lang="ts">
    import { RouterLink } from 'vue-router';
</script>

<template>
    <div>
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
</style>