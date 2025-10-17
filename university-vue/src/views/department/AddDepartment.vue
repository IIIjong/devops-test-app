<template>
    <main>
        <DepartmentForm
            :form-type="FORM_TYPE.ADD"
            :init-form-data="initFormData"
            @form-submit="formSubmit"/>
    </main>
</template>

<script setup>
    import { ref } from 'vue';
    import { FORM_TYPE } from '@/constants/formType';
    import DepartmentForm from '@/components/forms/DepartmentForm.vue';
    import { useDepartmentStore } from '@/stores/departmentStore';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const initFormData = ref({
        name: '',
        category: '',
        openYn: 'N',
        capacity: 30
    });

    const departmentStore = useDepartmentStore();

    const formSubmit = async (formData) => {
        try {
            const result = await departmentStore.addDepartment(formData);

            if (result.code === 201) {
                alert('정상적으로 등록되었습니다.');

                router.push({name: 'departments/no', params: {no: result.items[0].no}});
            }
        } catch (error) {
            const {status, message} = error.response.data;

            if(status === 'BAD_REQUEST') {
                alert('학과 정보를 모두 입력해 주세요.')
            } else if (status === 'REFRESH_TOKEN_INVALID') {
                router.push({name: 'login'});
            } else if (status === 'INTERNAL_SERVER_ERROR') {
                alert('에러가 발생했습니다.');
            }
        }
    };
</script>