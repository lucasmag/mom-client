import Vue from 'vue'
import Vuex from 'vuex'
Vue.config.productionTip = false

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      created: false, 
      username: "",
      friendsConversations: {},
      topicsConversations: {},
      friends: [],
      topics: [],
      messages: []
    },
    mutations: {
      created: state => state.created = true,
      username: (state, uname) => state.username = uname,
      initFriends: function(state, friend) {
        state.friends.push(friend)
        state.friendsConversations[friend] = []
      },
      initTopics: function(state, topic) {
        state.topics.push(topic)
        state.topicsConversations[topic] = []
      },
      insertInTopicConversation: function(state, payload) {
        state.topicsConversations[payload.sentTo].push(
          {"message": payload.message, "user": payload.sentBy}
        )
      },
      insertInFriendConversation: function(state, payload) {
        if(payload.sentBy === state.username) {
          state.friendsConversations[payload.sentTo].push(
            {"message": payload.message, "user": payload.sentBy}
          )
        } else {
          state.friendsConversations[payload.sentBy].push(
            {"message": payload.message, "user": payload.sentBy}
          )
        }
      },
      prepareMessages: function (state, payload){
        if (!payload.isTopic) {
          state.messages = state.friendsConversations[payload.receiver]
        } else {
          state.messages = state.topicsConversations[payload.receiver]
        }
      },
    },
    getters: {
      created: state => state.created,
      username: state => state.username,
      friendsConversations: state => state.friendsConversations,
      messages: state => state.messages,
    }
})