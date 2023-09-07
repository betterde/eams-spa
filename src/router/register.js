function registration() {
  return [
    {
      path: '/',
      name: 'dashboard',
      meta: {
        rules: ['student', 'teacher'],
        requiresAuth: true
      },
      component: () => import('../views/rules/teacher/Dashboard.vue')
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
            rules: ['user', 'customer']
          },
          component: () => import('../views/rules/teacher/school/Detail.vue')
        }
      ]
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        requiresAuth: true,
        rules: ['user', 'customer']
      },
      component: () => import('../views/rules/teacher/Profile.vue')
    }
  ];
}

export default () => {
  return registration();
}
