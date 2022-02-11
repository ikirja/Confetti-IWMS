<template>
  <div class="navbar-custom">
    <ul class="list-unstyled topbar-menu float-end mb-0">
      <!-- <li class="dropdown notification-list d-lg-none">
        <a
          class="nav-link dropdown-toggle arrow-none"
          data-bs-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="false"
          aria-expanded="false"
        >
          <i class="dripicons-search noti-icon"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-animated dropdown-lg p-0">
          <form class="p-3">
            <input
              type="text"
              class="form-control"
              placeholder="Найти..."
              aria-label="Recipient's username"
            />
          </form>
        </div>
      </li> -->
      <!-- <li class="dropdown notification-list topbar-dropdown">
        <a
          class="nav-link dropdown-toggle arrow-none"
          data-bs-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="false"
          aria-expanded="false"
        >
          <img
            src="/assets/images/flags/russia.jpg"
            alt="user-image"
            class="me-0 me-sm-1"
            height="12"
          />
          <span class="align-middle d-none d-sm-inline-block">Русский</span>
          <i
            class="mdi mdi-chevron-down d-none d-sm-inline-block align-middle"
          ></i>
        </a>
        <div
          class="
            dropdown-menu dropdown-menu-end dropdown-menu-animated
            topbar-dropdown-menu
          "
        >

          <a href="javascript:void(0);" class="dropdown-item notify-item">
            <img
              src="/assets/images/flags/germany.jpg"
              alt="user-image"
              class="me-1"
              height="12"
            />
            <span class="align-middle">German</span>
          </a>


          <a href="javascript:void(0);" class="dropdown-item notify-item">
            <img
              src="/assets/images/flags/italy.jpg"
              alt="user-image"
              class="me-1"
              height="12"
            />
            <span class="align-middle">Italian</span>
          </a>


          <a href="javascript:void(0);" class="dropdown-item notify-item">
            <img
              src="/assets/images/flags/spain.jpg"
              alt="user-image"
              class="me-1"
              height="12"
            />
            <span class="align-middle">Spanish</span>
          </a>


          <a href="javascript:void(0);" class="dropdown-item notify-item">
            <img
              src="/assets/images/flags/us.jpg"
              alt="user-image"
              class="me-1"
              height="12"
            />
            <span class="align-middle">English</span>
          </a>
        </div>
      </li> -->

      <li class="dropdown notification-list">
        <a
          class="nav-link dropdown-toggle nav-user arrow-none me-0"
          data-bs-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="false"
          aria-expanded="false"
        >
          <span class="account-user-avatar">
            <img
              src="/assets/images/users/avatar-1.jpg"
              alt="user-image"
              class="rounded-circle"
            />
          </span>
          <span>
            <span class="account-user-name">{{ user.firstName + ' ' + user.lastName }}</span>
            <span class="account-position" v-if="user.isAdmin">Администратор</span>
          </span>
        </a>
        <div
          class="
            dropdown-menu dropdown-menu-end dropdown-menu-animated
            topbar-dropdown-menu
            profile-dropdown
          "
        >

          <div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">Добро пожаловать!</h6>
          </div>


          <a href="javascript:void(0);" class="dropdown-item notify-item">
            <i class="mdi mdi-account-circle me-1"></i>
            <span>Мой профиль</span>
          </a>


          <a href="#" @click.prevent="logout" class="dropdown-item notify-item">
            <i class="mdi mdi-logout me-1"></i>
            <span>Выйти</span>
          </a>
        </div>
      </li>
    </ul>
    <button class="button-menu-mobile open-left">
      <i class="mdi mdi-menu"></i>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import jwtDecode from 'jwt-decode';

export default {
  setup() {
    const store = useStore();
    const user = computed(() => jwtDecode(store.state.token));

    function logout() {
      store.dispatch('logout');
    }

    return {
      user,
      logout
    }
  },
}
</script>