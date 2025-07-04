<template>
    <div>
        
        <TokenExpired v-if="(message == 'jwt expired')" @resend-email="resendConfirmEmail"/>
        <TokenConfirmFinish v-else-if="(message == 'Sua conta já foi confirmada! Você pode acessar o serviço a qualquer momento.'
          || message === 'Essa conta já foi confirmada.'
        )"/>
        <TokenConfirm v-else-if="success"/>
        <TokenInvalid v-else />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import TokenInvalid from './TokenInvalid.vue';
  import TokenExpired from './TokenExpired.vue';
  import TokenConfirm from './TokenConfirm.vue'; 
  import TokenConfirmFinish from './TokenConfirmFinish.vue'; 
  
  
  export default {
  components: {
    TokenInvalid,
    TokenConfirm,
    TokenConfirmFinish,
    TokenExpired
  },
    data() {
      return {
        loading: true,
        error: false,
        success: false,
        message: '',
        email: ''
      };
    },
    created() {
      const token = this.$route.query.token;

        this.validarToken(token);

    },
    methods: {
      async validarToken(token) {
        try {
          const response = await axios.put(`${process.env.VUE_APP_IP_BACK}/confirm-email`, {
            token: token,
          });
  
          console.log(response.data.message)
          this.success = true
        } catch (error) {
            this.message = error.response.data.message
            this.error = true

            if(this.message == 'jwt expired') this.email = error.response.data.user.email

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
    }  

    },
  };
  </script>
  
  <style scoped>
  .validar {
    text-align: center;
    padding: 20px;
  }
  
  .has-text-danger {
    color: red;
  }
  
  .conteudo {
    margin-top: 20px;
  }
  </style>
  