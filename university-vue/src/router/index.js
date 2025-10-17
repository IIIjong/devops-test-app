// import Home from '@/views/Home.vue'
// import Departments from '@/views/department/Departments.vue'
// import DepartmentDetail from '@/views/department/DepartmentDetail.vue'
// import AddDepartment from '@/views/department/AddDepartment.vue'
// import NotFount from '@/views/common/NotFound.vue'
// import BaseLayout from '@/layout/BaseLayout.vue'
// import AuthLayout from '@/layout/AuthLayout.vue'
// import Login from '@/views/auth/Login.vue'
import { useAuthStore } from '@/stores/authStore';
import { createRouter, createWebHistory } from 'vue-router'

// 지연 로딩(Lazy Loading) 적용
// 지연 로딩은 컴포넌트가 이용되는 시점에 컴포넌트 및 관련된 모듈을 웹 서버로부터 로딩하는 방법이다.
const Home = () => import('@/views/Home.vue');
const Departments = () => import('@/views/department/Departments.vue');
const DepartmentDetail = () => import('@/views/department/DepartmentDetail.vue');
const AddDepartment = () => import('@/views/department/AddDepartment.vue');
const NotFount = () => import('@/views/common/NotFound.vue');
const BaseLayout = () => import('@/layout/BaseLayout.vue');
const AuthLayout = () => import('@/layout/AuthLayout.vue');
const Login = () => import('@/views/auth/Login.vue');

// router 객체를 생성하기 위해서는 vue-router에서 제공하는 createRouter 함수를 사용한다.
const router = createRouter({
  // 라우터가 사용할 라우팅 모드 지정 (HTML 5 모드)
  history: createWebHistory(import.meta.env.BASE_URL),
  // 요청 경로에 따라 랜더링할 컴포넌트를 배열로 지정한다.
  // 명명된 라우트
  // routes: [
  //   { name: 'home', path: '/', component: Home },
  //   { name: 'departments', path: '/departments', component: Departments },
  //   // 동적 라우트는 일정한 패턴의 URI 경로를 하나의 라우트에 연결하는 방법이다.
  //   { name: 'departments/no', path: '/departments/:no', component: DepartmentDetail },
  //   { name: 'departments/add', path: '/departments/add', component: AddDepartment },
  //   // 404 라우트
  //   { name: 'notfound', path: '/:paths(.*)*', component: NotFount },
  // ], 

  // 중첩된 라우트
  // router-view에 의해서 랜더링된 컴포넌트가 다시 router-view를 이용해서 자식 라우트에 매칭된 컴포넌트를 랜더링한다.
  routes: [
    {
      name: 'main',
      path: '/',
      component: BaseLayout,
      children: [
        {
          name: 'home',
          path: '',
          component: Home
        },
        {
          name: 'departments',
          path: 'departments',
          component: Departments
        },
        {
          name: 'departments/no',
          path: 'departments/:no',
          component: DepartmentDetail
        },
        {
          name: 'departments/add',
          path: 'departments/add',
          component: AddDepartment
        }
      ]
    },
    {
      name: 'auth',
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          name: 'login',
          path: 'login',
          component: Login
        }
      ]
    },
    { 
      name: 'notfound', 
      path: '/:paths(.*)*', 
      component: NotFount 
    }
  ]
})

// 내비게이션 가드(Navigation Guard)
//  - 라우팅이 일어날 때 프로그래밍 방식으로 내비게이션을 안전하게 보호하는 기능을 수행한다.
//  - beforeEach에 전달하는 인자 중 to는 이동하려는 경로를 나타내고 from은 이동 전 현재 경로 정보이다.
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  try {
    if(authStore.tokenInfo.accessToken === '') {
      await authStore.refreshAccessToken();
    }

    if(to.name === 'login' && authStore.tokenInfo.accessToken) {
      return { name: 'home' };
    }
  } catch (error) {
    if(to.name !== 'login') {
      return {name: 'login'};
    }
  }
});

export default router
