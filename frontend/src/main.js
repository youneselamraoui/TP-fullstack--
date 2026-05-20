import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";   // ← chemin exact vers src/router/index.js ou src/router.js

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");