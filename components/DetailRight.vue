<template>
  <div class="detail-right">
    <div class="sticky-right">
      <client-only>
        <social-share
          class="hide-sm mb-15"
          :product="product"
        />
      </client-only>

      <store-tile
        class="mt-10"
        :store="product.store"
      />

    </div><!-- detail-right -->
  </div><!-- detail-right -->
</template>

<script setup>
  import {toRefs} from "vue";
  import {useCartHelper} from "~/composables/useCartHelper";

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object
    },
    productInventory: {
      type: Object
    }
  });

  const {disabled, product, productInventory} = toRefs(props);
  const emit = defineEmits(['cart-error']);

  const {wishListAction} = useCartHelper({product, productInventory, emit});

  defineExpose({ wishListAction });
</script>
