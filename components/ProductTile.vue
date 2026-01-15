<template>
  <div class="p-tile product-card-new">
    <div class="product-card-inner">
      <div class="product-image-section">
        <nuxt-link
          :to="productLink(product)"
          draggable="false"
          class="product-image-link"
          @click="goToProduct"
        >
          <ImageLazy
            v-if="isLazyImage"
            :lazy-src="getThumbImageURL(product.image)"
            :title="product.title"
            :alt="product.title"
            class="product-image"
          />
          <img
            v-else
            :src="getThumbImageURL(product.image)"
            :title="product.title"
            :alt="product.title"
            class="product-image"
            height="50"
            width="50"
          >
        </nuxt-link>
        
        <span
          v-if="badge"
          class="product-badge"
        >
          {{ badge }}
        </span>

        <button
          v-if="showWishlistBtn"
          aria-label="wishlist"
          class="wishlist-btn"
          :title="wishListed ? $t('detailRight.removeFromWishlist') : $t('detailRight.addToWishlist')"
          @click.prevent="wishListAction"
        >
          <spinner
            v-if="ajaxingWishlist"
            class="wishlist-spinner"
          />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            :class="['wishlist-icon', { 'wishlist-icon-filled': wishListed }]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>

      <div class="product-info-section">
        <nuxt-link
          :to="productLink(product)"
          class="product-title-link"
          @click="goToProduct"
        >
          <h5 class="product-title ellipsis" :class="`ellipsis-${titleEllipsis}`">
            {{ product.title }}
          </h5>
        </nuxt-link>

        <div class="product-price-section">
          <div class="price-wrapper">
            <span
              v-if="prevPrice"
              class="prev-price"
            >
              <price-format :price="prevPrice" />
            </span>
            <span class="current-price">
              <price-format :price="currentPricing" />
            </span>
          </div>
        </div>

        <div class="product-rating-section">
          <div class="rating-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="star-icon"
            >
              <path
                fill-rule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="rating-value">{{ product.rating || 0 }}</span>
            <span class="rating-count"> ({{ product.review_count || 0 }})</span>
          </div>
          <template v-if="soldCount">
            <div class="divider"></div>
            <div class="sold-count">
              {{ soldCount }} {{ $t('util.sold') }}
            </div>
          </template>
        </div>
      </div>

      <div class="product-actions-section">
        <button
          aria-label="add to cart"
          class="add-to-cart-btn"
          :title="$t('detailRight.addToCart')"
          @click.prevent="handleAddToCart"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 6.39167V5.58334C6.25 3.70834 7.75833 1.86667 9.63333 1.69167C11.8667 1.47501 13.75 3.23334 13.75 5.42501V6.57501" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.5001 18.3333H12.5001C15.8501 18.3333 16.4501 16.9916 16.6251 15.3583L17.2501 10.3583C17.4751 8.32496 16.8918 6.66663 13.3334 6.66663H6.66677C3.10843 6.66663 2.5251 8.32496 2.7501 10.3583L3.3751 15.3583C3.5501 16.9916 4.1501 18.3333 7.5001 18.3333Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.9128 10H12.9203" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.07884 10H7.08632" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
          class="buy-now-btn"
          @click.prevent="handleBuyNow"
        >
          {{ $t('detailRight.buyNow') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {useCompareHelper} from "~/composables/useCompareHelper";
  import {toRefs, ref, watch, computed} from "vue";
  import {usePriceHelper} from "~/composables/usePriceHelper";
  import {useUtils} from "~/composables/useUtils";
  import {useCartHelper} from "~/composables/useCartHelper";
  import {defineEmits} from "vue";
  import {storeToRefs} from "pinia";
  import {useDetailStore} from "../store/detail";
  import {useAuthStore} from "../store/auth";
  import {useCartStore} from "../store/cart";
  import {useUserStore} from "../store/user";
  import {useCommonStore} from "../store/common";

  const props = defineProps({
    product: {
      type: Object,
      default() {
        return null
      },
    },
    isLazyImage: {
      type: Boolean,
      default: true
    },
    compared: {
      type: Boolean,
      default: false
    },
    titleEllipsis: {
      type: Number,
      default: 2
    },
    productInventory: {
      type: Object,
      default: null
    }
  });

  const {product, isLazyImage, compared, titleEllipsis, productInventory} = toRefs(props);

  const emit = defineEmits(['removed', 'cart-error']);

  const {ajaxingCompare, addToCompare} = useCompareHelper({product, emit});

  defineExpose({ addToCompare });

  const { prevPrice, currentPricing, reducedPercent } = usePriceHelper({product});

  const {getThumbImageURL, productLink} = useUtils();

  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);

  const userStore = useUserStore();
  const {profile} = storeToRefs(userStore);

  const commonStore = useCommonStore();
  const {setting} = storeToRefs(commonStore);
  const {setToastError} = commonStore;

  const cartStore = useCartStore();
  const {buyNow} = cartStore;

  // Use cart helper for wishlist and cart functionality
  const getDefaultInventory = () => {
    if (productInventory?.value) {
      return productInventory.value;
    }
    // Try to get first available inventory
    if (product.value?.inventories?.length) {
      return product.value.inventories[0];
    }
    return {};
  };

  const inventoryRef = ref(getDefaultInventory());

  watch([product, productInventory], () => {
    inventoryRef.value = getDefaultInventory();
  }, { deep: true });

  const {wishListAction, addToCart, ajaxingWishlist, buyingNow, wishListed} = 
    useCartHelper({product, productInventory: inventoryRef, emit});

  const badge = computed(() => {
    return product.value?.badge;
  });

  const soldCount = computed(() => {
    return product.value?.sold || product.value?.total_sold || null;
  });

  const showWishlistBtn = computed(() => {
    return authenticated.value;
  });

  const detailStore = useDetailStore();
  const {setProduct} = detailStore;

  const goToProduct = () => {
    setProduct(product.value);
  };

  const {t} = useI18n();

  const handleAddToCart = async () => {
    if (!setting.value?.guest_checkout && !authenticated.value) {
      return navigateTo('/login');
    }
    
    // Check stock status - use in_stock from API or check inventory quantity
    const inventoryQuantity = parseInt(inventoryRef.value?.quantity || 0);
    const isProductInStock = product.value?.in_stock !== false && (product.value?.in_stock === true || inventoryQuantity > 0);
    
    if (!isProductInStock) {
      setToastError(t('detailRight.outOfStock'));
      return;
    }

    // If product has attributes and no inventory selected, navigate to product page
    if (product.value?.attribute?.length && !inventoryRef.value?.id) {
      goToProduct();
      navigateTo(productLink(product.value));
      return;
    }

    await addToCart(false);
  };

  const handleBuyNow = async () => {
    if (!setting.value?.guest_checkout && !authenticated.value) {
      return navigateTo('/login');
    }

    // Check stock status - use in_stock from API or check inventory quantity
    const inventoryQuantity = parseInt(inventoryRef.value?.quantity || 0);
    const isProductInStock = product.value?.in_stock !== false && (product.value?.in_stock === true || inventoryQuantity > 0);
    
    if (!isProductInStock) {
      setToastError(t('detailRight.outOfStock'));
      return;
    }

    // If product has attributes and no inventory selected, navigate to product page
    if (product.value?.attribute?.length && !inventoryRef.value?.id) {
      goToProduct();
      navigateTo(productLink(product.value));
      return;
    }

    const result = await addToCart(true);
    if (result?.status === 200) {
      navigateTo('/checkout');
    }
  };

</script>

