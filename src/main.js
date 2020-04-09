import Vue from 'vue';
import App from './app.vue';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer';

import store from './store';
import router from './router';

import global from './mixins/global';

Vue.config.productionTip = true;

// Font Awesome
library.add(fas);
Vue.component('icon', FontAwesomeIcon);

// Bootstrap-Vue
Vue.use(BootstrapVue);

// SWAL
Vue.use(VueSweetalert2);

// Global mixin
Vue.mixin(global);

// V-Viewer
Vue.use(Viewer);

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
