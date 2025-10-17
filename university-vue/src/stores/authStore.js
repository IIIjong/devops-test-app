import { reactive } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@/api';

export const useAuthStore = defineStore('auth', () => {
    // 사용자 정보 저장
    const tokenInfo = reactive({
        accessToken: '',
        type: '',
        username: '',
        roles: [],
        issuedAt: 0,
        expiresAt: 0
    });

    // 로그인 처리
    const login = async (formData) => {
        const response = await apiClient.post(
            '/api/v1/auth/login',
            formData,
            {
                _skipInterceptor: true,
                // 브라우저가 서버로 요청을 보낼 때 쿠키, 인증 헤더 등을 함께 포함하도록 허용하는 설정이다.
                withCredentials: true
            }
        );

        if (response.status === 200) {
            // tokenInfo 속성을 response.data.items[0]의 속성으로 변경한다.
            Object.assign(tokenInfo, response.data.items[0]);
        }

        return response.data;
    };

    // 액세스 토큰 재발급
    const refreshAccessToken = async () => {
        const response = await apiClient.post(
            '/api/v1/auth/refresh',
            null,
            {
                _skipInterceptor: true,
                withCredentials: true
            }
        );

        if (response.status === 200) {
            Object.assign(tokenInfo, response.data.items[0]);
        }
    };

    // 로그아웃 처리
    const logout = async () => {
        const response = await apiClient.post(
            '/api/v1/auth/logout',
            null,
            {
                withCredentials: true
            }
        );

        if(response.status === 204) {
            performLogout();
        }

        return response;
    };

    // 공통 로그아웃 처리 함수
    const performLogout = () => {
        // 사용자 정보 초기화
        tokenInfo.accessToken = '';
        tokenInfo.type = '';
        tokenInfo.username = '';
        tokenInfo.roles = [];
        tokenInfo.issuedAt = 0;
        tokenInfo.expiresAt = 0;
    }

    return { tokenInfo, login, refreshAccessToken, logout, performLogout };
});
