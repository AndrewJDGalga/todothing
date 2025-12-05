import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useAuthStore = defineStore('authState', ()=>{
    const user = ref(null);
    const isLoading = ref(false);
    const err = ref('');

    const register = async (userData: { email: string; password: string; name: string}) => {
        isLoading.value = true;
        err.value = '';
        let successful = true;
        try{
            //TODO - replace
            await new Promise(r => setTimeout(() => {
                r
            }, 1000));
            user.value = { ...userData, successDate: Date.now() };
        }catch(e){
            //TODO - actual error
            err.value = 'Registration failed. Please try again.';
            successful = false;
        } finally {
            isLoading.value = false;
        }
        return successful;
    };

    const logout = () => {
        user.value = null;
    }

    return {
        user,
        isLoading,
        err,
        register,
        logout
    }
});