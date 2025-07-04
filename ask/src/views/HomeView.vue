<template>
  <div class="home">
    <NavbarView />

    <div class="container">
      
      <div v-for="(question, index) in questions" :key="index" class="card">
        <div class="card-header">
          <img src="../assets/user.jpg" alt="" class="avatar">
          <div class="divHeader">
            <span><strong>{{ question.name }}</strong></span>
            <span class="date">{{ new Date(question.created).toLocaleString() }}</span>
          </div>
        </div>
        <div class="card-content">
          <h2 class="sub-title">{{ question.title }}</h2>
          <p class="responses-count">10 respostas</p>
        </div>
        <footer class="card-footer">
          <button class="card-footer-item">
            <i class="fa fa-comment"></i> Responder
          </button>
          <button class="card-footer-item">
            <i class="fa fa-eye"></i> Visualizar
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>

<script>
import NavbarView from '@/components/NavbarView.vue'
import axios from 'axios'

export default {
  name: 'HomeView',
  components: {
    NavbarView
  },
  data() {
    return {
      questions: ''
    }
  },
  created() {
    this.getQuestions()
  },
  methods: {
    async getQuestions() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_IP_BACK}/`)

        console.log(response.data)
        this.questions = response.data.questions

      }
      catch(err) {
        console.log(err.response.data)
      }
    },
  }
}
</script>

<style scoped>
.divHeader{
  text-align: left;
}

.container {
  margin-top: 250px;
}
.card {
  width: 800px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  margin-top: 20px;
}

.card-header {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f9f9f9;
}

.card-header img.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.card-header div {
  display: flex;
  flex-direction: column;
}

.card-header .date {
  font-size: 12px;
  color: #777;
  margin-top: 5px;
}

.card-content {
  padding: 20px;
}

.card-content .sub-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #4a4a4a;
}

.responses-count {
  font-size: 14px;
  color: #42b983;
  font-weight: 600;
}

.card-footer {
  padding: 15px;
  display: flex;
  justify-content: flex-start;
  border-top: 1px solid #f0f0f0;
  background-color: #f9f9f9;
}

.card-footer-item {
  padding: 12px 18px;
  margin-right: 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 14px;
}

.card-footer-item i {
  margin-right: 8px;
}

.card-footer-item:hover {
  background-color: #358c6d;
  transform: scale(1.05);
}

.card-footer-item:focus {
  outline: none;
}

.card-footer-item:active {
  background-color: #2c7555;
}
</style>
