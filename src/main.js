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
  { name: 'home', path: '/', component: Manager },
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
  if(store.state.friends.includes(data["user"])) {
    store.commit("insertInConversation", data)
  }

  else {
    store.commit("addFriend", data["user"])
    const payload = {"queue": data["queue"] }
    store.commit("initConversations", payload)
    store.commit("insertInConversation", data)
  }
})