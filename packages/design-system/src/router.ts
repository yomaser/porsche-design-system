import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/:category/:page',
      name: 'page',
      component: () => import('./views/Page.vue'),
    },
    {
      path: '/components/:category/:story',
      name: 'story',
      component: () => import('./views/Story.vue'),
    },
    {
      path: '/license',
      name: 'license',
      component: () => import('./views/License.vue'),
    },
    {
      path: '*',
      name: 'not-found',
      component: () => import('./views/NotFound.vue'),
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
