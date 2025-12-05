<script setup lang="ts">
    import {ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '../store/authState';

    const router = useRouter();
    const authState = useAuthStore();

    const form = ref({
        username: '',
        password: '',
        passwordConfirm: ''
    });

    const isFormValid = computed(()=>{
        return form.value.username.trim() && form.value.password.length > 8 &&  form.value.password === form.value.passwordConfirm;
    });
</script>

<template>
    <form @submit.prevent>

    </form>
</template>