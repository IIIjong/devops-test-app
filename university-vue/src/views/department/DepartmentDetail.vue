<template>
    <main>
        <!-- 
        <h2>학과 상세 보기</h2>

        <p>{{ currentRoute.fullPath }}</p>
        <p>{{ currentRoute.path }}</p>
        <p>{{ currentRoute.params }}</p>
        <p>{{ currentRoute.params.no }}</p>
        <p>{{ currentRoute.query }}</p>
        <p>{{ currentRoute.query.name }}</p>
        <p>{{ parseInt(currentRoute.query.age) }}</p>

        <button @click="(e) => router.push('/')">홈으로</button>
        <button @click="(e) => router.push({name: 'home'})">홈으로</button>
        <button @click="(e) => router.replace({name: 'home'})">홈으로</button>
        <button @click="(e) => router.back()">뒤로가기</button>
        <button @click="(e) => router.go(-1)">뒤로가기</button>
        <button @click="(e) => router.forward()">앞으로가기</button>
        <button @click="(e) => router.go(1)">앞으로가기</button> 
        -->
        <DepartmentForm
            :form-type="FORM_TYPE.EDIT"
            :init-form-data="departmentStore.departments[0]"
            @form-submit="formSubmit"
            @delete-click="deleteClick"/>
    </main>
</template>

<script setup>
    import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
    import DepartmentForm from '@/components/forms/DepartmentForm.vue';
    import { FORM_TYPE } from '@/constants/formType';
    import { onMounted } from 'vue';
    import { useDepartmentStore } from '@/stores/departmentStore';

    const router = useRouter();
    const currentRoute = useRoute();
    const departmentStore = useDepartmentStore();

    const formSubmit = async (formData) => {
        try {
            const result = await departmentStore.editDepartment(formData);

            if (result.code === 200) {
                alert('정상적으로 수정되었습니다.');
            }
        } catch (error) {
            const {status, message} = error.response.data;

            if (status === 'DEPARTMENT_NOT_FOUND') {
                alert(message);

                router.push({name: 'departments'});
            } else if(status === 'BAD_REQUEST') {
                alert('학과 정보를 모두 입력해 주세요.')
            } else if (status === 'REFRESH_TOKEN_INVALID') {
                router.push({name: 'login'});
            } else if (status === 'INTERNAL_SERVER_ERROR') {
                alert('에러가 발생했습니다.');
            }
        }
    };

    const deleteClick = async (no) => {
        try {
            if (confirm('정말로 삭제하시겠습니까?')) {
                const result = await departmentStore.deleteDepartment(no);

                if (result.code === 200) {
                    alert('정상적으로 삭제되었습니다.');

                    router.push({name: 'departments'})
                }
            }
        } catch (error) {
            const {status, message} = error.response.data;

            if (status === 'DEPARTMENT_NOT_FOUND') {
                alert(message);

                router.push({name: 'departments'});
            } else if (status === 'REFRESH_TOKEN_INVALID') {
                router.push({name: 'login'});
            } else if (status === 'FORBIDDEN') {
                alert('권한이 없는 사용자입니다.');
            } else if (status === 'INTERNAL_SERVER_ERROR') {
                alert('에러가 발생했습니다.');
            }
        }
    };

    onMounted(async () => {
        try {
            await departmentStore.fetchDepartment(currentRoute.params.no);
        } catch (error) {
            const {status, message} = error.response.data;

            if (status === 'DEPARTMENT_NOT_FOUND') {
                alert(message);

                router.push({name: 'departments'});
            } else if (status === 'REFRESH_TOKEN_INVALID') {
                router.push({name: 'login'});
            } else if (status === 'INTERNAL_SERVER_ERROR') {
                alert('에러가 발생했습니다.');
            }
        }
    });

    // 현재 라우트를 떠나기 전에 호출된다.
    onBeforeRouteLeave(() => {
        departmentStore.clearState();
    });
</script>