<template>
  <div class="box">
    <h2 class="title is-3 has-text-centered">Alterar Senha</h2>

    <div class="field">
      <div class="control has-icons-left has-icons-right">
        <input
          class="input"
          v-model="password"
          type="password"
          placeholder="Digite sua nova senha"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
        <span class="icon is-small is-right icones">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <div class="control has-icons-left has-icons-right">
        <input
          class="input"
          v-model="passwordConfirm"
          type="password"
          placeholder="Confirme sua nova senha"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
        <span class="icon is-small is-right icones">
          <i :class="showPasswordConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <button @click="resetPassword" class="button is-success is-fullwidth">Alterar</button>
    </div>

    <p v-if="message" :class="classMessage">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      password: "",
      passwordConfirm: "",
      loading: false,
      tokenValid: false,
      message: "",
      classMessage: ""
    };
  },
  created() {
    const token = this.$route.query.token;
    
    if (!token) return router.push('recovery')

    this.validateToken(token);
  },
  methods: {
    async validateToken(token) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/validate-recovery`, {
          token: token,
        });

        console.log(response.data)
        this.tokenValid = true;

      } catch {
        router.push('recovery')
      }
    },

    async resetPassword() {
      if (this.password !== this.passwordConfirm) {
        this.message = "As senhas não coincidem!";
        this.classMessage = "has-text-danger";
        return;
      }

      this.loading = true;

      try {
        const token = this.$route.query.token;
        const response = await axios.put(`${process.env.VUE_APP_IP_BACK}/recovery-password`, {
          token,
          newPassword: this.password,
          newPasswordConfirm: this.passwordConfirm
        });

          this.message = response.data.message;
          this.classMessage = "has-text-success";
          this.$router.push("/login");
      } catch (error) {
        this.message = error.response.data.message;
        this.classMessage = "has-text-danger";
      } 
    }
  },
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

.icones {
  cursor: pointer;
}

.resendConfirm {
  color: #42b983;
  cursor: pointer;
  text-decoration: underline;
}
</style>
