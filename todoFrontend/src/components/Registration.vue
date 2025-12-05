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

    const resolveSubmit = async () => {
        //TODO - err message
        if(!isFormValid.value) return;
        const success = await authState.register({name: form.value.username, password: form.value.password});
        if(success){
            router.push('/');
        }
    }
</script>

<template>
    <form @submit.prevent>

    </form>
</template>