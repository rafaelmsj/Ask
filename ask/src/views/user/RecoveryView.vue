<template>

    <div class="box">
      
      <h2 class="title is-3 has-text-centered">Recuper senha</h2>

      <div class="field">
        <div class="control has-icons-left">
          <input v-model="email" class="input" type="email" placeholder="Digite seu e-mail">
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <button @click="recovery" class="button is-success is-fullwidth">Enviar e-mail</button>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <a href="/login">
          <button class="button is-text">
            <span class="icon is-small">
              <i class="fas fa-user-plus"></i>
            </span>
            <span>Fazer Login</span>
          </button>
        </a>

      </div>
      <p v-if="message" :class="classMessage">{{ message }}</p>

    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      message: '',
      classMessage: ''
    };
  },
  methods: {
    async recovery() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/recovery-password`, {
          email: this.email
        });

        this.email = ''
        this.classMessage = 'has-text-success'
        this.message = response.data.message
      } catch (error) {
        this.message = error.response.data.message
        this.classMessage = 'has-text-danger'
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
</style>
