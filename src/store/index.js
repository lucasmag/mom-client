import Vue from 'vue'
import Vuex from 'vuex'
Vue.config.productionTip = false

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      created: false, 
      username: "",
      conversations: {},
      friends: [],
      messages: []
    },
    mutations: {
      created: state => state.created = true,
      username: (state, uname) => state.username = uname,
      addFriend: (state, user) => state.friends.push(user),
      initConversations: function(state, payload) {
        state.conversations[payload.queue] = []
      },
      insertInConversation: function(state, payload) {
        console.log(payload);
        state.conversations[payload.queue].push(
          {"message": payload.message, "user": payload.user}
        )
        console.log(state);
      },
      prepareMessages: (state, queue) => state.messages = state.conversations[queue]

    },
    getters: {
      created: state => state.created,
      username: state => state.username,
      conversations: state => state.conversations,
      messages: state => state.messages,
      friends: state => state.friends
    }
})