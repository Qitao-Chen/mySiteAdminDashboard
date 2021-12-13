import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Dashboard',
        icon: 'dashboard'
      }
    }]
  },

  {
    path: '/banner',
    component: Layout,
    redirect: "/banner",
    children: [{
      path: 'banner',
      name: 'Banner',
      component: () => import('@/views/banner/index'),
      meta: {
        title: '1st Page Management',
        icon: 'el-icon-s-home'
      }
    }]
  },

  {
    path: '/blog',
    component: Layout,
    redirect: '/blogList',
    name: 'Blog',
    meta: {
      title: 'Blog Manage',
      icon: 'el-icon-document'
    },
    children: [{
        path: 'blogList',
        name: 'BlogList',
        component: () => import('@/views/blogList/index'),
        meta: {
          title: 'Blog List',
          icon: 'el-icon-s-order'
        }
      },
      {
        path: 'blogType',
        name: 'BlogType',
        component: () => import('@/views/blogType/index'),
        meta: {
          title: 'Blog Type',
          icon: 'el-icon-menu'
        }
      },
      {
        path: 'addBlog',
        name: 'AddBlog',
        component: () => import('@/views/addBlog/index'),
        meta: {
          title: 'Add Blog',
          icon: 'el-icon-document-add'
        }
      }
    ]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/projectList',
    name: 'Project',
    meta: {
      title: 'Project Manage',
      icon: 'el-icon-suitcase'
    },
    children: [{
        path: 'projectList',
        name: 'projectList',
        component: () => import('@/views/projectList/index'),
        meta: {
          title: 'Project List',
          icon: 'el-icon-notebook-1'
        }
      },
      {
        path: 'addProject',
        name: 'addProject',
        component: () => import('@/views/addProject/index'),
        meta: {
          title: 'Add Project',
          icon: 'el-icon-link'
        }
      }
    ]
  },

  {
    path: '/comment',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Comment',
      component: () => import('@/views/commentManagement/index'),
      meta: {
        title: 'Comment Management',
        icon: 'el-icon-chat-line-round'
      }
    }]
  },

  {
    path: '/message',
    component: Layout,
    children: [{
      path: 'index',
      name: 'message',
      component: () => import('@/views/message/index'),
      meta: {
        title: 'Message Board',
        icon: 'el-icon-message'
      }
    }]
  },

  {
    path: '/about',
    component: Layout,
    children: [{
      path: 'index',
      name: 'about',
      component: () => import('@/views/about/index'),
      meta: {
        title: 'About Me',
        icon: 'el-icon-user-solid'
      }
    }]
  },

  {
    path: '/setting',
    component: Layout,
    children: [{
      path: 'index',
      name: 'setting',
      component: () => import('@/views/setting/index'),
      meta: {
        title: 'Setting',
        icon: 'el-icon-setting'
      }
    }]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
      meta: {
        title: 'External Link',
        icon: 'link'
      }
    }]
  },


  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
