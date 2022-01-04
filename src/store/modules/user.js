import {
  loginApi,
  logout,
  getInfoApi
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  console.log('hio')
  return {
    user: null,
    loading: false,
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    //userInfo is the data submit by user at login page
    const {
      loginId: username,
      loginPwd: password,
      captcha,
      remember
    } = userInfo
    return new Promise((resolve, reject) => {
      console.log(username, password, captcha, remember)
      loginApi({
        loginId: username.trim(),
        loginPwd: password,
        captcha,
        remember,
      }).then(response => {
        console.log(response)
        const {
          data
        } = response
        if (data) {
          commit('SET_USER', data)
          resolve()
        } else {
          reject(response)
        }
      }).catch(error => {
        reject('---', error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfoApi().then(response => {

        if (typeof response === 'string') {
          //未登录，或者登录过期
          response = JSON.parse(response);
          if (response.code === 401) {
            reject(response.msg);
          }

        } else {
          //说明token有效，将用户信息放入仓库
          commit('SET_USER', response.data)
          resolve();
        }

      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter() //框架已经写好的重置路由功能，不用修改
      commit('RESET_STATE')
      resolve()
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
