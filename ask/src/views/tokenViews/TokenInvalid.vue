<template>
    <div class="box">
      <h2 class="title is-3 has-text-centered">Token inválido</h2>
  
      <div class="has-text-centered iconverify">
        <span class="icon is-large has-text-success">
          <i class="fas fa-times-circle"></i>
        </span>
      </div>
  
      <div class="field is-grouped is-grouped-centered"> 
        <a href="/register">    
          <button class="button is-text">
            <span class="icon is-small">
              <i class="fas fa-user-plus"></i>
            </span>
            <span>Registre-se</span>
          </button>  
        </a>       
      </div>
    </div>
  </template>
  
  <style scoped>
.title {
  color: #4a4a4a;
  margin-bottom: 30px;
}

.button {
  font-weight: bold;
  border-radius: 50px;
  margin-top: 20px;
}

.button.is-text {
  color: #42b983;
  font-size: 0.9rem;
  text-decoration: none;
}

.field.is-grouped .button {
  margin: 0 20px;
}

.icon {
  color: #42b983;
}

.button.is-text:hover {
  text-decoration: none;
  color: #358c6d;
}

.icon.is-large {
  font-size: 10rem;
}

.has-text-success {
  color: #e74949 !important;
}

.iconverify {
  margin-bottom: 40px;
  margin-top: 70px;
}
</style>
