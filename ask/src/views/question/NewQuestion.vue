<template>
  <div class="box">
    <NavbarView />
    <h2 class="title is-3 has-text-centered">Criar pergunta</h2>

    <div class="field">
      <div class="control has-icons-left">
        <input
          class="input"
          v-model="title"
          type="text"
          placeholder="Título da pergunta"
          :maxlength="50"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-pencil-alt"></i>
        </span>
        <span class="counter">{{ title.length }}/50</span>
      </div>
    </div>

    <div class="field">
      <label class="label">Descrição</label>
      <Editor
        v-model="description"
        :api-key="tinymceApiKey"
        :init="editorConfig"
      />
    </div>

    <div class="field">
      <button @click="create" class="button is-success is-fullwidth">Perguntar</button>
    </div>

    <p v-if="message" :class="classMessage">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import NavbarView from '@/components/NavbarView.vue';
import Editor from '@tinymce/tinymce-vue';
import router from '@/router';

export default {
  data() {
    return {
      title: '',
      description: '',
      classMessage: '',
      message: '',
      tinymceApiKey: process.env.VUE_APP_TINYMCE_API_KEY,
      editorConfig: {
        height: 200,
        menubar: false,
        language: 'pt_BR',
        plugins: ['lists', 'link', 'image', 'charmap', 'searchreplace'],
        toolbar: 'adjusttext | undo redo | bold italic | alignleft aligncenter alignright | bullist numlist ',
        setup: (editor) => {
          editor.ui.registry.addButton('adjusttext', {
            text: 'Corrigir Texto',
            onAction: () => {
              this.correctText(this.description);
            },
            className: 'adjust-text-button',
          });
        },
      },
    };
  },
  components: {
    NavbarView,
    Editor,
  },
  methods: {
    async create() {
      try {

        const token = localStorage.getItem('token');
        let req = {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }

        const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/question`, {
          title: this.title,
          description: this.description,
        }, req);

        console.log(response);
        this.title = '';
        this.description = '';
        this.message = response.data.message;
        this.classMessage = 'has-text-success';
        router.push('/')
      } catch (error) {
        console.log(error)
        this.message = error.response.data.message;
        this.classMessage = 'has-text-danger';
      }
    },

    async correctText() {
      try {

        const token = localStorage.getItem('token');
        let req = {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }

        const response = await axios.post(`${process.env.VUE_APP_IP_BACK}/correct-text`,{
          text: this.description,
        }, req);

        this.description = response.data.text
      } catch (error) {
        this.description = error.response.data.text
      }
    },
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

.help {
  margin-top: 5px;
  font-size: 14px;
}

.tox-tinymce {
  transition: border-color 0.3s, box-shadow 0.3s;
}

.counter {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 12px;
  color: #aaa;
}

.adjust-text-button {
  background-color: #42b983 !important;
  color: white !important;
  border-radius: 30px !important;
  font-weight: bold !important;
  padding: 5px 15px !important;
  font-size: 14px !important;
  transition: background-color 0.3s !important;
}

.adjust-text-button:hover {
  background-color: #358a5f !important;
}

.input {
  margin-bottom: 10px;
}
</style>
