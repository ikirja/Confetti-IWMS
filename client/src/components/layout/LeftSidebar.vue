<template>
  <div class="leftside-menu">
    <!-- LOGO -->
    <a href="/" class="logo text-center logo-light">
      <span class="logo-lg">
        <!-- <img src="assets/images/logo.png" alt="" height="16" /> -->
        Confetti
      </span>
      <span class="logo-sm">
        <!-- <img src="assets/images/logo_sm.png" alt="" height="16" /> -->
        Confetti
      </span>
    </a>

    <!-- LOGO -->
    <a href="/" class="logo text-center logo-dark">
      <span class="logo-lg">
        <!-- <img src="assets/images/logo-dark.png" alt="" height="16" /> -->
        Confetti
      </span>
      <span class="logo-sm">
        <!-- <img src="assets/images/logo_sm_dark.png" alt="" height="16" /> -->
        Confetti
      </span>
    </a>

    <div class="h-100" id="leftside-menu-container" data-simplebar>
      <!--- Sidemenu -->
      <ul class="side-nav">
        <li class="side-nav-title side-nav-item">Навигация</li>
        <!-- <li class="side-nav-title side-nav-item">Navigation</li> -->

        <li class="side-nav-item">
          <a
            data-bs-toggle="collapse"
            href="#sidebarDashboards"
            aria-expanded="false"
            aria-controls="sidebarDashboards"
            class="side-nav-link"
          >
            <i class="uil-home-alt"></i>
            <!-- <span class="badge bg-success float-end">4</span> -->
            <span class="menu-arrow"></span>
            <span> Дашборды </span>
          </a>
          <div class="collapse" id="sidebarDashboards">
            <ul class="side-nav-second-level">
              <li>
                <a href="#">Аналитика</a>
              </li>
              <li>
                <a href="#">CRM</a>
              </li>
              <li>
                <a href="#">Коммерция</a>
              </li>
            </ul>
          </div>
        </li>

        <li class="side-nav-title side-nav-item mt-3">Магазин</li>

        <router-link
          to="/ecommerce/product"
          v-slot="{ href, isActive }"
          custom
        >
          <li class="side-nav-item" :class="{ 'menuitem-active': isActive }">
            <a :href="href" class="side-nav-link">
              <i class="uil-box"></i>
              <span> Товары </span>
            </a>
          </li>
        </router-link>

        <li class="side-nav-item">
          <a
            data-bs-toggle="collapse"
            href="#sidebarOrders"
            aria-expanded="false"
            aria-controls="sidebarOrders"
            class="side-nav-link"
          >
            <i class="uil-layer-group"></i>
            <span> Заказы </span>
            <span class="menu-arrow"></span>
          </a>
          <div class="collapse" id="sidebarOrders">
            <ul class="side-nav-second-level">
              <router-link
                to="/ecommerce/order"
                v-slot="{ href, isActive }"
                custom
              >
                <li :class="{ 'menuitem-active': isActive }">
                  <a :href="href">Все заказы</a>
                </li>
              </router-link>
              <router-link
                to="/ecommerce/order/order-status"
                v-slot="{ href, isActive }"
                custom
              >
                <li :class="{ 'menuitem-active': isActive }">
                  <a :href="href">Статусы заказов</a>
                </li>
              </router-link>
            </ul>
          </div>
        </li>

        <router-link
          to="/ecommerce/warehouse"
          v-slot="{ href, isActive }"
          custom
        >
          <li class="side-nav-item" :class="{ 'menuitem-active': isActive }">
            <a :href="href" class="side-nav-link">
              <i class="uil-truck-loading"></i>
              <span> Склады </span>
            </a>
          </li>
        </router-link>

        <router-link
          to="/ecommerce/customer"
          v-slot="{ href, isActive }"
          custom
        >
          <li class="side-nav-item" :class="{ 'menuitem-active': isActive }">
            <a :href="href" class="side-nav-link">
              <i class="uil-postcard"></i>
              <span> Клиенты </span>
            </a>
          </li>
        </router-link>

        <li class="side-nav-title side-nav-item mt-3">Справочники</li>

        <li class="side-nav-item">
          <a
            data-bs-toggle="collapse"
            href="#sidebarRegistry"
            aria-expanded="false"
            aria-controls="sidebarRegistry"
            class="side-nav-link"
          >
            <i class="uil-file-info-alt"></i>
            <span> Регистр сведений </span>
            <span class="menu-arrow"></span>
          </a>
          <div class="collapse" id="sidebarRegistry">
            <ul class="side-nav-second-level">
              <router-link
                to="/manage/registry"
                v-slot="{ href, isActive }"
                custom
              >
                <li :class="{ 'menuitem-active': isActive }">
                  <a :href="href">Все сведения</a>
                </li>
              </router-link>
              <router-link
                to="/manage/registry/ozon"
                v-slot="{ href, isActive }"
                custom
              >
                <li :class="{ 'menuitem-active': isActive }">
                  <a :href="href">Ozon</a>
                </li>
              </router-link>
            </ul>
          </div>

          <router-link
            to="/manage/pricing"
            v-slot="{ href, isActive }"
            custom
          >
            <li class="side-nav-item" :class="{ 'menuitem-active': isActive }">
              <a :href="href" class="side-nav-link">
                <i class="uil-pricetag-alt"></i>
                <span> Ценообразование </span>
              </a>
            </li>
          </router-link>
        </li>

        <li class="side-nav-title side-nav-item mt-3">Найстройки</li>

        <li class="side-nav-item">
          <a
            data-bs-toggle="collapse"
            href="#sidebarAdminMarketplace"
            aria-expanded="false"
            aria-controls="sidebarAdminMarketplace"
            class="side-nav-link"
          >
            <i class="uil-store-alt"></i>
            <span> Маркетплейсы </span>
            <span class="menu-arrow"></span>
          </a>
          <div class="collapse" id="sidebarAdminMarketplace">
            <ul class="side-nav-second-level">
              <router-link
                to="/admin/marketplace/ozon"
                v-slot="{ href, isActive }"
                custom
              >
                <li :class="{ 'menuitem-active': isActive }">
                  <a :href="href">Ozon</a>
                </li>
              </router-link>
            </ul>
          </div>
        </li>

        <router-link
          to="/admin/user"
          v-slot="{ href, isActive }"
          custom
        >
          <li class="side-nav-item" :class="{ 'menuitem-active': isActive }">
            <a :href="href" class="side-nav-link">
              <i class="uil-users-alt"></i>
              <span> Пользователи </span>
            </a>
          </li>
        </router-link>

        <router-link
          to="/admin/log"
          v-slot="{ href, isActive }"
          custom
        >
          <li class="side-nav-item" :class="{ 'menuitem-active': isActive }">
            <a :href="href" class="side-nav-link">
              <i class="uil-list-ul"></i>
              <span> Журнал событий </span>
            </a>
          </li>
        </router-link>
      </ul>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<style scoped>
.side-nav {
  text-align: left;
}
</style>