<template>
    <div class="chat">
        <md-button class="md-icon-button" @click="goBack()">
              <md-icon>arrow_back</md-icon>
        </md-button>
        <div class="chatArea">
            <ul class="messages">
                <li class="log"
                    v-for="(message, index) in messages"
                    v-bind:key="index">
                    <div style="margin-bottom: 3px">
                    <span style="font-size: 12px; margin-right: 5px; color: #888"> {{ message.date }} </span>
                    <b>{{ message.user }}:</b> {{ message.message }}
                    </div>

                </li>
            </ul>
        </div>
        <div class="toSend">
            <md-field>
                <md-textarea v-model="toSend" md-autogrow></md-textarea>
            </md-field>

            <md-button class="md-primary" @click="sendMessage">Enviar</md-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  
    name: "Chat",
    props: ["receiver", "isTopic"],
    data() {
        return {
            toSend: "",
            isConnected: false,
        };
    },
    computed: {
    ...mapGetters(['username', 'messages']),
    },
    methods: {
      sendMessage: function () {
        console.log(this.to);
        if (this.toSend !== ''){
          const data = {
            "isTopic": this.isTopic,
            "sentTo": this.receiver, 
            "sentBy": this.username, 
            "message": this.toSend
          }
          console.log(data);
          this.$socket.emit("sendMessage", data)
          if (!this.isTopic) this.$store.commit("insertInFriendConversation", data)

          this.toSend = ''
        }        
      },
      goBack: function() {
        this.$router.push({name: 'home', params: {"wasAt": this.isTopic}})
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(230, 230, 230);
}

.toSend {
    display: flex;
    gap: 4px;
    bottom: 0;
    align-items: center;
    position: absolute;
    width: 100%;
}

.messages {
    height: 100%;
    margin: 0;
    overflow-y: scroll;
    padding: 20px;
    width: 100%;
}

.input-message {
    margin: 0;
    resize: none;
    width: 100%;
}

.chatArea {
    padding-bottom: 60px;
    height: 100vh;
    width: 100%;
}

.log {
    margin: 5px;
    text-align: start;
}

ul {
    list-style: none;
    overflow-wrap: break-word;
}
</style>
