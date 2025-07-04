import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/user/LoginView.vue'
import RegisterView from '../views/user/RegisterView.vue'
import RecoveryView from '../views/user/RecoveryView.vue'
import TokenVerify from '../views/tokenViews/TokenVerify.vue'
import RecoveryPassword from '../views/user/RecoveryPassword.vue'
import HomeView from '../views/HomeView.vue'
import NewQuestion from '../views/question/NewQuestion.vue'
import axios from 'axios'

async function verifyAuthenticate(to, from, next){
  try {
    const token = localStorage.getItem('token')
    const req = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/validate-authenticate`,{},req)
    
    console.log(response)
    next()
  }
  catch(err) {
    next('login')
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/recovery',
    name: 'recovery',
    component: RecoveryView
  },
  {
    path: '/confirm-email',
    name: 'confirm-email',
    component: TokenVerify,
  },  {
    path: '/recovery-password',
    name: 'recovery-password',
    component: RecoveryPassword,
  },  {
    path: '/new-question',
    name: 'newquestion',
    component: NewQuestion,
    beforeEnter: verifyAuthenticate
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
