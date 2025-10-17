<template>
    <div>
        <form @submit.prevent="submitClick">
            <h1 class="h3 mb-3 fw-normal">로그인 페이지</h1>

            <div class="form-floating">
                <input type="text" class="form-control" id="floatingInput" placeholder="Username"
                    v-model="formData.username" required>
                <label for="floatingInput">Username</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                    v-model="formData.password" required>
                <label for="floatingPassword">Password</label>
            </div>
            <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
            <p class="mt-5 mb-3 text-body-secondary">&copy; 2024–2025</p>
        </form>
    </div>
</template>

<script setup>
    import { reactive, toRaw } from 'vue';

    const formData = reactive({
        username: '',
        password: ''
    });

    const emit = defineEmits(['form-submit']);

    const submitClick = () => {
        // toRaw() 반응성이 있는 객체를 자바스크립트 객체로 변환하는 함수이다.
        emit('form-submit', toRaw(formData));
    };
</script>

<style lang="scss" scoped>

</style>