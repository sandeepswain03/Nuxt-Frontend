<template>
  <nav class="bottom-navigation">
    <nuxt-link
      to="/"
      class="nav-item"
      :class="{ active: isActive('/') }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      <span class="nav-label">{{ $t('bottomNav.home') }}</span>
    </nuxt-link>
    
    <nuxt-link
      to="/user/orders"
      class="nav-item"
      :class="{ active: isActive('/user/orders') }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        <path d="M9 14l2 2 4-4"></path>
      </svg>
      <span class="nav-label">{{ $t('bottomNav.orders') }}</span>
    </nuxt-link>
    
    <nuxt-link
      to="/user/wishlists"
      class="nav-item"
      :class="{ active: isActive('/user/wishlists') }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
      </svg>
      <span class="nav-label">{{ $t('bottomNav.wishList') }}</span>
    </nuxt-link>
    
    <nuxt-link
      to="/user/compared"
      class="nav-item"
      :class="{ active: isActive('/user/compared') }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
      <span class="nav-label">{{ $t('bottomNav.comparedList') }}</span>
    </nuxt-link>
    
    <nuxt-link
      to="/user/vouchers"
      class="nav-item"
      :class="{ active: isActive('/user/vouchers') }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
      <span class="nav-label">{{ $t('bottomNav.vouchers') }}</span>
    </nuxt-link>
  </nav>
</template>

<script setup>
  const route = useRoute();
  
  const isActive = (path) => {
    if (path === '/') {
      return route.path === '/' || route.path === '' || route.name === 'index';
    }
    return route.path.startsWith(path);
  };
</script>

