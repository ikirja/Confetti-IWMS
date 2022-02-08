import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/ecommerce/product',
    name: 'Product',
    component: () => import('@/views/ecommerce/Product.vue')
  },
  {
    path: '/ecommerce/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ecommerce/ProductDetail.vue')
  },
  {
    path: '/ecommerce/order',
    name: 'Order',
    component: () => import('@/views/ecommerce/order/Order.vue')
  },
  {
    path: '/ecommerce/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/ecommerce/order/OrderDetail.vue')
  },
  {
    path: '/ecommerce/order/order-status',
    name: 'OrderStatus',
    component: () => import('@/views/ecommerce/order/OrderStatus.vue')
  },
  {
    path: '/ecommerce/warehouse',
    name: 'Warehouse',
    component: () => import('@/views/ecommerce/Warehouse.vue')
  },
  {
    path: '/ecommerce/customer',
    name: 'Customer',
    component: () => import('@/views/ecommerce/Customer.vue')
  },
  {
    path: '/manage/registry',
    name: 'Registry',
    component: () => import('@/views/manage/registry/Registry.vue')
  },
  {
    path: '/manage/registry/ozon',
    name: 'RegistryOzon',
    component: () => import('@/views/manage/registry/RegistryOzon.vue')
  },
  {
    path: '/admin/marketplace/ozon',
    name: 'MarketplaceOzon',
    component: () => import('@/views/admin/marketplace/MarketplaceOzon.vue')
  },
  {
    path: '/admin/user',
    name: 'User',
    component: () => import('@/views/admin/User.vue')
  },
  {
    path: '/admin/log',
    name: 'Log',
    component: () => import('@/views/admin/Log.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
