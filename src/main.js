import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from "vue-socket.io";
import VueMaterial from "vue-material"
import VueRouter from 'vue-router'
import Manager from './components/Manager'
import Chat from './components/Chat'
import store from './store'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
const ipc = window.require('electron').ipcRenderer


Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'http://localhost:4113', //options object is Optional
  })
);


const routes = [
  { name: 'home', path: '/', component: Manager, props: true},
  { name: 'chat', path: '/chat', component: Chat, props: true},
]

const router = new VueRouter({
  routes // short for `routes: routes`
})


new Vue({
  router,
  store,
  render: h => h(App),

}).$mount('#app')


ipc.on('updateMessages', (event, data) => {
  console.log(data)
  if(!data.isTopic) {

    if(!store.state.friends.includes(data.sentBy)) {
      store.commit("initFriends", data.sentBy)
    }

    store.commit("insertInFriendConversation", data)
  } else {

    if(!store.state.topics.includes(data.sentTo)) {
      store.commit("initTopics", data.sentTo)
    }

    store.commit("insertInTopicConversation", data)
  }  
})