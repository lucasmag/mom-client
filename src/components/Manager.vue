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

            <md-button class="md-icon-button" @click="showAddTopic = true">
              <md-icon>add_comment</md-icon>
            </md-button>
          </div>
        </div>

        <div v-if="created" class="md-toolbar-row">
          <md-tabs class="md-primary" v-bind:md-active-tab="selectedTab">
            <md-tab id="0" md-label="Conversas" @click="isTopic = false"></md-tab>
            <md-tab id="1" md-label="Tópicos" @click="isTopic = true"></md-tab>
          </md-tabs>
        </div>
      </md-app-toolbar>
      <md-app-content v-if="created">
        
       <ChatList :isTopic="isTopic"></ChatList>

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
          <md-button class="md-primary" @click="clearUserCreationData"
              >Cancelar</md-button
          >
          <md-button class="md-primary" @click="verifyUser(username)"
              >Criar</md-button
          >
      </md-dialog-actions>
  </md-dialog>

  <md-dialog :md-active.sync="showConfirmAddUser" class="dialog">
      <md-dialog-title style="text-align: center">Já existe uma fila com este nome.<br>
      Deseja vincular o novo usuário à esta fila?</md-dialog-title>

      <md-field>
          <label>Nome do usuário</label>
          <md-input v-model="username"></md-input>
      </md-field>

      <md-dialog-actions>
          <md-button class="md-primary" @click="clearUserCreationData"
              >Cancelar</md-button
          >
          <md-button class="md-primary md-raised" @click="createUser(username)"
              >Sim</md-button
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
          <md-button class="md-primary" @click="addFriend(receiver)"
              >Adicionar</md-button
          >
      </md-dialog-actions>
  </md-dialog>

    <md-dialog :md-active.sync="showAddTopic" class="dialog">
      <md-dialog-title style="text-align: center">Conectar em topico</md-dialog-title>

      <md-field>
          <label>Nome do topico</label>
          <md-input v-model="receiver"></md-input>
      </md-field>

      <md-dialog-actions>
          <md-button class="md-primary" @click="showAddTopic = false"
              >Cancelar</md-button
          >
          <md-button class="md-primary" @click="addTopic(receiver)"
              >Adicionar</md-button
          >
      </md-dialog-actions>
  </md-dialog>

  </div>
    
</template>

<script>
const ipc = window.require('electron').ipcRenderer
import { mapGetters } from 'vuex'
import ChatList from './ChatList'

export default {
  name: 'Manager',
  components: {
    ChatList,
  },
  props: {
    wasAt: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      receiver: "",
      showAddUser: false,
      showAddConversation: false,
      showAddTopic: false,
      topicName: "",
      isTopic: this.wasAt,
      showConfirmAddUser: false
    }
  },
  computed: {
    ...mapGetters(['created']),

     username: {
        get () { return this.$store.state.username },
        set (username) { this.$store.commit("username", username) }
    },
    selectedTab: function () {
      return this.isTopic ? "1" : "0"
    }
  },
  methods: {
      createUser: function (queue) {
        this.userExists = false
        ipc.send('consume-messages', queue)

        this.username = queue
        this.$store.commit("created")

        this.showConfirmAddUser = false
        this.showAddUser = false
      },
      verifyUser(queue) {
        this.$socket.emit("userExists", queue, (exists) => {
          if(exists) {
            this.showConfirmAddUser = true
            this.showAddUser = false
          } else {
            this.createUser(queue)
          }
        })
      },
      addFriend: function (friend) {
        if(!this.$store.state.friends.includes(friend)) {
          this.$store.commit("initFriends", friend)

          this.showAddConversation = false
        }
      },
      addTopic: function(topic) {
        if(!this.$store.state.topics.includes(topic)) {
          this.$store.commit("initTopics", topic)

          const data = {"queue": this.$store.state.username, "topic": topic}
          ipc.send("consume-topic", data)

          this.showAddTopic = false
        }
      },
      clearUserCreationData() {
        this.showConfirmAddUser = false
        this.showAddUser = false
        this.username = ''
      }
  },
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

  .warning {
      color: rgb(185, 73, 73);
      font-style: oblique;
  }



</style>
