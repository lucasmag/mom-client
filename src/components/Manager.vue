<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">

            <span class="md-title">{{ this.username ? this.username : "Usuário"}}</span>
          </div>

          <div v-if="created" class="md-toolbar-section-end">
            <md-button class="md-icon-button" @click="showAddConversation = true">
              <md-icon>person_add</md-icon>
            </md-button>
          </div>
        </div>

        <div v-if="created" class="md-toolbar-row">
          <md-tabs class="md-primary">
            <md-tab md-label="Conversas"></md-tab>
            <md-tab md-label="Tópicos"></md-tab>
          </md-tabs>
        </div>
      </md-app-toolbar>
      <md-app-content v-if="created">
        <md-list>
          <md-list-item v-for="user in friends" :key="user"
          @click="enterChat(user)"
          >
            <span class="md-list-item-text">{{ user }}</span>
          </md-list-item>
        </md-list>

      </md-app-content>
    </md-app>

    <div v-if="!created">
      <md-button class="md-primary" @click="showAddUser = true">Criar novo usuário</md-button>
    </div>

  <md-dialog :md-active.sync="showAddUser" class="dialog">
      <md-dialog-title style="text-align: center">Novo usuário</md-dialog-title>

      <md-field>
          <label>Nome do usuário</label>
          <md-input v-model="username"></md-input>
      </md-field>

      <md-dialog-actions>
          <md-button class="md-primary" @click="showAddUser = false"
              >Cancelar</md-button
          >
          <md-button class="md-primary" @click="createUser(username)"
              >Criar</md-button
          >
      </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="showAddConversation" class="dialog">
      <md-dialog-title style="text-align: center">Novo amigo</md-dialog-title>

      <md-field>
          <label>Nome do amigo</label>
          <md-input v-model="receiver"></md-input>
      </md-field>

      <md-dialog-actions>
          <md-button class="md-primary" @click="showAddConversation = false"
              >Cancelar</md-button
          >
          <md-button class="md-primary" @click="addConversation(receiver)"
              >Adicionar</md-button
          >
      </md-dialog-actions>
  </md-dialog>

    </div>
    
    <!-- <div class="row">
      <md-field>
        <label>Nova fila</label>
        <md-input v-model="queueName"></md-input>
      </md-field>

      <md-button class="md-primary" @click="createQueue(queueName)">Criar nova fila</md-button>
    </div>
    
    <div class="row">
      <md-field>
        <label>Novo tópico</label>
        <md-input v-model="topicName"></md-input>
      </md-field>

      <md-button class="md-primary" @click="createTopic(topicName)">Criar novo tópico</md-button>
    </div>

    <div class="row">
      <md-field>
        <label>Novo usuário</label>
        <md-input v-model="username"></md-input>
      </md-field>

      <md-button class="md-primary" @click="createUser(username)">Criar usuário</md-button>
    </div>

    <md-list>
      <md-list-item v-for="queue in queueList" :key="queue">
        <span class="md-list-item-text">{{ queue }}</span>
      </md-list-item>
    </md-list> -->

</template>

<script>
const ipc = window.require('electron').ipcRenderer
import { mapGetters } from 'vuex'

export default {
  name: 'Manager',
  data() {
    return {
      receiver: "",
      showAddUser: false,
      showAddConversation: false
    }
  },
  computed: {
    ...mapGetters(['created', 'friends']),

     username: {
        get () { return this.$store.state.username },
        set (username) { this.$store.commit("username", username) }
    }
  },
  methods: {
      createUser: function (queue) {
        ipc.send('consume-messages', queue)

        this.$store.commit("username", queue)
        this.$store.commit("created")

        this.showAddUser = false
      },
      addConversation: function (receiver) {
        this.$store.commit("addFriend", receiver)
        this.$store.commit("initConversations", {"queue": receiver})

        this.showAddConversation = false
      },
      enterChat: function(receiver) {
        console.log(receiver);
        this.$store.commit("prepareMessages", receiver)
        this.$router.push({name: 'chat', params: { 'receiver': receiver }});
      }

  },
  created() {
    ipc.on('updateMessages', (event, data) => {
      console.log(data)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import url("https://fonts.googleapis.com/css?family=Material+Icons");
  .row {
    display: flex;
    flex-direction: row;
  }
  .page-container {
    height: 100vh;
  }
  .md-app {
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 400px;
    max-width: calc(100vw - 125px);
  }

  .md-dialog /deep/.md-dialog-container {
    max-width: 768px;
    padding: 30px
}


</style>
