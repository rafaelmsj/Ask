<template>

  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  width: 400px;
  padding: 30px;
}

@media (max-width: 768px) {
  .box {
    width: 90%;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .box {
    width: 95%;
    padding: 15px;
  }
}


</style>
