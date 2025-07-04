<template>
  <div>
    <nav class="navbar">
      <a href="/" class="logo">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
      </a>

      <div class="search">
        <div class="input-container">
          <input type="text" v-model="searchQuery" placeholder="Qual a sua pergunta?" class="input" />
          <span @click="handleSearch" class="search-icon">
            <i class="fa fa-search"></i>
          </span>
        </div>
      </div>

      <div class="buttons">
        <a href="/login" v-if="(!authenticate)">
          <button class="button btns">Entrar</button>
        </a>

        <a href="/register" v-if="(!authenticate)">
          <button class="button btns">Cadastre-se</button>
        </a>

        <div class="">
          <a href="/new-question" class="button question">Faça uma pergunta</a>
        </div>

        <div v-if="authenticate" class="accountConfig">
          <span>
            <i class="icon fa fa-user"></i>
            <strong class="has-text-white">Olá, {{ name }}</strong>
            <i @click="toggleAccountDropdown"
              :class="{ 'fa fa-chevron-down': !isAccountDropdownVisible, 'fa fa-chevron-up': isAccountDropdownVisible }"></i>
          </span>

          <div v-if="isAccountDropdownVisible" class="account-dropdown">
            <a href="#">Minhas perguntas</a>
            <a href="#">Configurações</a>
            <a @click ="descructSession">Sair</a>
          </div>
        </div>

        <div class="dropdown">
          <div class="dropdown-trigger">
            <button @click="toggleDropdown" aria-haspopup="true" aria-controls="dropdown-menu3">
              <span class="icon is-small">
                <i class="fas fa-bars" aria-hidden="true"></i>
              </span>
            </button>
          </div>

        </div>

        <div v-if="isDropdownVisible" class="dropdown-menu" id="dropdown-menu3" role="menu">
          <div class="dropdown-content">
            <a href="/new-question" class="drop-item"> Faça uma pergunta </a>
            <hr />
            <a v-if="(!authenticate)" href="/login" class="drop-item"> Entrar </a>
            <a v-if="(!authenticate)" href="/register" class="drop-item"> Cadastre-se </a>
            <div class="options-user" v-if="(authenticate)">
              <div class="nameUser">
                <i class="fa fa-user"></i>
                <span> Olá, {{ name }}</span>
              </div>
              <span>
                <a href="#" class="drop-item">Minhas perguntas</a>
                <a href="#" class="drop-item">Configurações</a>
                <a @click ="descructSession" class="drop-item">Sair</a>
              </span>

            </div>
          </div>
        </div>
      </div>
    </nav>

  </div>

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: "",
      isDropdownVisible: false,
      authenticate: false,
      isAccountDropdownVisible: false,
      name: ''
    };
  },
  created() {
    const token = localStorage.getItem('token');
    this.VerifyAuthenticate(token);
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        console.log("Buscando por:", this.searchQuery);
      }
    },

    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    toggleAccountDropdown() {
      this.isAccountDropdownVisible = !this.isAccountDropdownVisible;
    },

    descructSession() {
      this.authenticate = false
      localStorage.removeItem("token")
      window.location.reload()
    },

    async VerifyAuthenticate(token) {
      try {
        let req = {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }

        const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/validate-authenticate`, {}, req);

        console.log(response.data)
        this.authenticate = true
        this.name = response.data.user.name.split(' ')[0]
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
      } catch {
        this.authenticate = false
      }
    }
  },
};
</script>

<style scoped>
.navbar {
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  background-color: #333;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}


.logo-img {
  height: 50px;
  margin-right: 20px;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.input-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  font-size: 16px;
  border-radius: 40px;
  border: 1px solid #dcdcdc;
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 0.125em rgba(66, 185, 131, 0.25);
  outline: none;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #42b983;
  font-size: 18px;
}

.input:focus+.search-icon {
  color: #42b983 !important;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-left: 20px;
  gap: 10px;
}

.button {
  font-weight: bold;
  border-radius: 40px;
  padding: 10px 20px;
}

.btns {
  color: #fff;
  border: none;
  background-color: transparent;
}

.question {
  color: #42b983;
  background-color: transparent;
  border: 2px solid #42b983;
}

.question:hover,
.btns:hover {
  background-color: #42b983;
  color: white;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #1b1b1b;
  color: white;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: block;
}

.dropdown {
  display: none;
}

.accountConfig span {
  display: block;
}

.accountConfig {
  position: relative;
}

.account-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #1b1b1b;
  color: white;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: none;
}

.account-dropdown a {
  color: white;
  text-decoration: none;
  padding: 5px 0;
  display: block;
}

.account-dropdown a:hover,
.drop-item:hover {
  background-color: #42b983;
}

a.drop-item {
  display: block;
  color: #fff;
}

.accountConfig i.fa-chevron-down,
i.fa-chevron-up {
  margin-left: 10px;
  cursor: pointer;
}

.accountConfig .account-dropdown {
  display: block;
}

.options-user {
  display: block;
}

.nameUser {
  margin-bottom: 5px;
  font-size: large;
  font-weight: bold;
}

@media (max-width: 768px) {
  .input-container {
    max-width: 100%;
  }

  .btns {
    display: none;
  }

  .logo-img {
    height: 40px;
  }

  .dropdown {
    display: block;
  }

  .accountConfig {
    display: none;
  }
}

@media (max-width: 480px) {
  .input {
    font-size: 14px;
    padding: 10px 35px 10px 12px;
  }

  .question,
  .btns {
    display: none;
  }

  .search-icon {
    font-size: 16px;
  }

  .dropdown {
    display: block;
  }

  .button {
    flex-direction: column !important;
  }
}
</style>
