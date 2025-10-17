<template>
    <main>
        <select class="form-select w-auto" v-model="listLimit">
            <option value="5">5개</option>
            <option value="10">10개</option>
            <option value="20">20개</option>
        </select>

        <DepartmentTable
            :departments="departmentStore.departments"
            @item-click="itemClick"
            @delete-click="deleteClick"/>

        <Pagination
            :current-page="currentPage"
            :page-numbers="pageNumbers"
            @change-page="changePage"/>
    </main>
</template>

<script setup>
    import { onMounted, watch } from 'vue';
    import DepartmentTable from '@/components/tables/DepartmentTable.vue';
    import Pagination from '@/components/common/Pagination.vue';
    import { useDepartmentStore } from '@/stores/departmentStore';
    import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
    import { usePagination } from '@/composables/usePagination';
    
    const departmentStore = useDepartmentStore();
    const currentRoute = useRoute();
    const router = useRouter();
    const { currentPage, listLimit, totalPages, pageNumbers, setCurrentPage, setTotalCount } = usePagination();

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            // router.push({name: 'departments', query: {page}});
            setCurrentPage(page);
        }
    };

    const itemClick = (no) => {
        router.push({ name: 'departments/no', params: {no} });
    };

    const deleteClick = async (no) => {
        try {
            if (confirm('정말로 삭제하시겠습니까?')) {
                const result = await departmentStore.deleteDepartment(no);

                if (result.code === 200) {
                    alert('정상적으로 삭제되었습니다.');

                    await departmentStore.fetchDepartments(currentPage.value, listLimit.value);
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
            // 현재 페이지(값을 정수로 변환하고 실패하면 1을 기본값으로 사용)
            setCurrentPage(parseInt(currentRoute.query.page) || 1);

            const result = await departmentStore.fetchDepartments(currentPage.value, listLimit.value);

            setTotalCount(result.totalCount);
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

    // listLimit 바뀌면 API 다시 호출하여 목록을 조회한다.
    watch(listLimit, async (newLimit) => {
        try {
            setCurrentPage(1);

            const result = await departmentStore.fetchDepartments(
                currentPage.value,
                newLimit
            );

            setTotalCount(result.totalCount);
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

    // 라우트가 변경될 때 특정 로직을 실행하는 훅(Hook)이다.
    // onBeforeRouteUpdate(async (to, from) => {
    //     try {
    //         setCurrentPage(parseInt(to.query.page) || 1);

    //         await departmentStore.fetchDepartments(currentPage.value, listLimit.value);
    //     } catch (error) {
    //         const {status, message} = error.response.data;

    //         if (status === 'DEPARTMENT_NOT_FOUND') {
    //             alert(message);

    //             router.push({name: 'departments'});
    //         } else if (status === 'REFRESH_TOKEN_INVALID') {
    //             router.push({name: 'login'});
    //         } else if (status === 'INTERNAL_SERVER_ERROR') {
    //             alert('에러가 발생했습니다.');
    //         }
    //     }
    // });

    // 쿼리스트링 사용하지 않고 페이지를 변경
    watch(currentPage, async (newPage) => {
        try {
            setCurrentPage(newPage);

            const result = await departmentStore.fetchDepartments(
                currentPage.value,
                listLimit.value
            );

            setTotalCount(result.totalCount);
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
        // if (window.confirm('정말 이 페이지를 떠나시겠습니까? 변경사항이 저장되지 않을 수 있습니다!')) {
        //     return true;
        // } else {
        //     return false;
        // }
        
        departmentStore.clearState();
    });
</script>

<style lang="scss" scoped>

</style>