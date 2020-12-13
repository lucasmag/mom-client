<template>
      <md-list>
          <md-list-item v-for="chat in chatList" :key="chat"
          @click="enterChat(chat)"
          >
            <span class="md-list-item-text">{{ chat }}</span>
          </md-list-item>
      </md-list>
</template>

<script>

export default {
  
    name: "Chat",
    props: ["isTopic"],
    computed: {
      chatList: function() {
        return this.isTopic ? this.$store.state.topics : this.$store.state.friends
      }
    },

    methods: {
      enterChat: function(receiver) {
        const payload = {"isTopic": this.isTopic, "receiver": receiver}
        this.$store.commit("prepareMessages", payload)
        this.$router.push({name: 'chat', params: { 'receiver': receiver, "isTopic": this.isTopic }});
      },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
