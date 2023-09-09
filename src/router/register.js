import student from "@/apis/modules/student";

function registration(guard) {
  if (guard === 'student') {
    return [
      {
        path: '/',
        name: 'dashboard',
        meta: {
          rules: ['student'],
          requiresAuth: true
        },
        component: () => import('../views/rules/common/Dashboard.vue')
      },
      {
        path: '/teacher',
        name: 'teacher',
        meta: {
          rules: ['student'],
          requiresAuth: true
        },
        component: () => import('../views/rules/student/Teacher.vue')
      },
      {
        path: '/chat',
        name: 'chat',
        meta: {
          requiresAuth: true,
          rules: ['student']
        },
        component: () => import('../views/rules/student/chat/Chat.vue'),
      }
    ];
  }

  return [
    {
      path: '/',
      name: 'dashboard',
      meta: {
        rules: ['teacher'],
        requiresAuth: true
      },
      component: () => import('../views/rules/common/Dashboard.vue')
    },
    {
      path: '/school',
      name: 'school',
      meta: {
        requiresAuth: true,
        rules: ['teacher']
      },
      component: () => import('../views/rules/teacher/school/Index.vue'),
      children: [
        {
          path: ':id/detail',
          name: 'serverDetail',
          meta: {
            requiresAuth: true,
            rules: ['teacher']
          },
          component: () => import('../views/rules/teacher/school/Detail.vue')
        }
      ]
    },
    {
      path: '/chat/:id',
      name: 'chat',
      meta: {
        requiresAuth: true,
        rules: ['teacher']
      },
      component: () => import('../views/rules/teacher/chat/Chat.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        requiresAuth: true,
        rules: ['teacher']
      },
      component: () => import('../views/rules/teacher/Profile.vue')
    }
  ];
}

export default (guard) => {
  return registration(guard);
}
