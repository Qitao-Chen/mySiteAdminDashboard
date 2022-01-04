import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist



router.beforeEach(async (to, from, next) => {
  console.log('aaaaaaa')
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()

  //获取本地用户信息
  const hasGetUserInfo = store.getters.user;
  if (to.meta.auth) {
    console.log(hasGetUserInfo)
    //需要鉴权
    if (hasGetUserInfo) {
      //说明有用户信息，直接方行
      next()
      NProgress.done()
    } else {
      //没有用户信息，先看是否有token
      const hasToken = localStorage.getItem('adminToken')
      if (hasToken) {
        //有token,验证token的有效性
        try {
          await store.dispatch('user/getInfo'); //who am i
          next();
          NProgress.done();
        } catch (error) {
          await store.dispatch('user/resetToken');
          Message.error('login info expired,plz login again');
          console.log('跳转吗')
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      } else {
        //无token 需要重新登录
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    //无需鉴权
    if (to.path === '/login') {
      if (hasGetUserInfo) {
        //说明已经在登录状态下，自动跳转到首页
        next({
          path: '/'
        })
        NProgress.done()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    } else {
      next()
      NProgress.done()
    }
  }
  //element-admin 原本的鉴权流程
  // if (hasToken) {
  //   //has token
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({
  //       path: '/'
  //     })
  //     NProgress.done()
  //   } else {
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
