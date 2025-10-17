import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/api";

export const useDepartmentStore = defineStore('department', () => {
    const departments = ref([]);

    // axios 사용법
    // const fetchDepartments = () => {
    //     apiClient.get('/api/v1/department-service/departments?page=1&numOfRows=10')
    //         // 비동기 통신이 성공적으로 완료되었을 때 호출되는 콜백 함수를 지정한다. 
    //         .then((response) => {
    //             console.log(response);
    //         })
    //         // 비동기 통신이 실패했을 때 호출되는 콜백 함수를 지정한다.
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // };

    // async / await 사용
    //  - 자바스크립트에서 비동기 작업을 효과적으로 처리할 수 있다.
    //  - 직접 axios를 사용할 때와 비교해 콜백 함수, 예외 처리가 간결해진다.
    //  - async는 비동기 작업을 포함하는 함수의 앞부분에 작성한다.
    //  - await는 async 함수 내에서만 작성할 수 있고 비동기 작업의 완료를 기다린다.
    const fetchDepartments = async (page, numOfRows) => {
        const response = 
            await apiClient.get(`/api/v1/department-service/departments?page=${page}&numOfRows=${numOfRows}`);

        departments.value = response.data.items;

        return response.data;
    };

    const addDepartment = async (department) => {
        const response = await apiClient.post('/api/v1/department-service/departments', department);

        return response.data;
    };

    const fetchDepartment = async(departmentNo) => {
        const response = await apiClient.get(`/api/v1/department-service/departments/${departmentNo}`);

        departments.value = response.data.items;

        return response.data;
    };

    const editDepartment = async (department) => {
        const departmentNo = departments.value[0].no;
        const response = await apiClient.put(`/api/v1/department-service/departments/${departmentNo}`, department);

        return response.data;
    };

    const deleteDepartment = async (departmentNo) => {
        const response = await apiClient.delete(`/api/v1/department-service/departments/${departmentNo}`);

        return response.data;
    };

    const clearState = () => {
        departments.value = [];
    };

    return { departments, fetchDepartments, addDepartment, fetchDepartment, editDepartment, deleteDepartment, clearState };
});