<template>
  <div class="box">
    <h2 class="title is-3 has-text-centered">Login</h2>

    <div class="field">
      <div class="control has-icons-left">
        <input class="input" v-model="email" type="email" placeholder="Digite seu e-mail">
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <div class="control has-icons-left has-icons-right">
        <input class="input" v-model="password" type="password" placeholder="Digite sua senha">
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fas fa-eye"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <button class="button is-success is-fullwidth" @click="login">Entrar</button>
    </div>

    <div class="field is-grouped is-grouped-centered">
      <a href="/register" class="button is-text">
        <span class="icon is-small">
          <i class="fas fa-user-plus"></i>
        </span>
        <span>Registrar-se</span>
      </a>
      
      <a href="/recovery" class="button is-text">
        <span class="icon is-small">
          <i class="fas fa-question-circle"></i>
        </span>
        <span>Esqueceu a senha?</span>
      </a>
    </div>

    <p v-if="message" :class="classMessage">{{ message }}</p>
    <p >
      <span class="resendConfirm" @click="resendConfirmEmail"
      v-if="message == 'Usúrio aguardando confirmação de e-mail'">
        Reenviar e-mail
      </span>
    </p>
  </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      message: '',
      classMessage: '',
      authenticate: false
    };
  },
  created() {
    const token = localStorage.getItem('token');
    this.VerifyAuthenticate(token);
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/login`, {
          email: this.email,
          password: this.password
        });

        this.classMessage = 'has-text-success'
        console.log(response.data.message)
        this.password = ''
        this.email = ''
        this.message = ''

        router.push('/')
        localStorage.setItem('token', response.data.token);
      } catch (error) {
        this.message = error.response.data.message
        this.classMessage = 'has-text-danger'
        this.password = ''
      }
    },
    async resendConfirmEmail(){
      try {
        const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/reconfirm-email`, {
          email: this.email
        });

        this.email = ''
        this.classMessage = 'has-text-success'
        this.message = response.data.message

        this.email= ''
        this.password = ''
      } catch (error) {
        this.message = error.response.data.message
        this.classMessage = 'has-text-danger'
      }
    },

    async VerifyAuthenticate(token) {
      try {
        let req = {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }

        const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/validate-authenticate`,{},req);

        console.log(response.data)
        router.push('/')
      } catch {
        this.authenticate = false
      }
    }
  }  
};
</script>

<style scoped>
.input:focus {
border-color: #42b983;
box-shadow: 0 0 0 0.125em rgba(66, 185, 131, 0.25); 
outline: none;
}

.input:focus + .icon {
color: #42b983 !important; 
}

.input {
border-color: #dcdcdc;
transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.control.has-icons-right .input {
padding-right: 2.5rem;
}

.title {
color: #4a4a4a;
margin-bottom: 20px;
}

.button {
font-weight: bold;
border-radius: 50px;
}

.button.is-success {
background-color: #42b983;
color: white;
margin-top: 20px !important;
}

.button.is-text {
color: #42b983;
font-size: 0.9rem;
text-decoration: none;
}

.field.is-grouped .button {
margin: 0 10px;
}

.icon {
color: #42b983;
}

.button.is-success:hover {
background-color: #358c6d;
color: white;
}

.button.is-text:hover {
text-decoration: none;
color: #358c6d;
}

.resendConfirm{
  color: #42b983;
  cursor: pointer;
  text-decoration: underline;
}
</style>
