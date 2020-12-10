<template>
    <md-dialog :md-active.sync="showDialog" class="dialog">
      <md-dialog-title style="text-align: center">{{ this.title }}</md-dialog-title>

      <md-field>
          <label>{{ hits.header }}</label>
          <md-input v-model="input"></md-input>
      </md-field>

      <md-dialog-actions>
          <md-button class="md-primary" @click="showDialog = false"
              >Cancelar</md-button
          >
          <md-button class="md-primary" @click="send(username)"
              >Criar</md-button
          >
      </md-dialog-actions>
  </md-dialog>
</template>

<script>
const ipc = window.require('electron').ipcRenderer


export default {
    name: "Chat",
    props: ["showDialog", "title", "header"],
    data() {
        return {
            messages: [],
            toSend: "",
            isConnected: false,
        };
    },
    methods: {
        send: function () {
            if (this.toSend !== ''){
                const data = { "sender": this.username, "receiver": this.receiver, "message": this.toSend }

                this.$socket.emit("sendMessage", data)

                this.toSend = ''
            }            
        },

    },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
