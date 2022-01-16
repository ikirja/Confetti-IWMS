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
    path: '/ecommerce/order',
    name: 'Order',
    component: () => import('@/views/ecommerce/order/Order.vue')
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
