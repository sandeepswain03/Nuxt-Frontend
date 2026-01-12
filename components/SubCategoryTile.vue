<template>
  <nuxt-link
    class="category-card-link"
    :to="categoryLink(subCategory)"
    :title="subCategory.title"
  >
    <div class="category-card" :class="`category-card-bg-${getColorIndex}`">
      <div class="category-image-wrapper">
        <ImageLazy
          :lazy-src="thumbImageURL(subCategory)"
          :title="subCategory.title"
          :alt="subCategory.title"
          class="category-image"
        />
      </div>
      <div class="category-title">
        {{ subCategory.title }}
      </div>
    </div>
  </nuxt-link>
</template>

<script>
  import ImageLazy from '~/components/ImageLazy'
  import util from '~/mixin/util'

  export default {
    name: 'SubCategoryTile',
    props: {
      category: {
        type: Object,
        default() {
          return null
        },
      },
      subCategory: {
        type: Object,
        default() {
          return null
        },
      },
      index: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
      }
    },
    components: {
      ImageLazy
    },
    mixins: [util],
    computed: {
      getColorIndex() {
        // Cycle through 10 different colors
        return this.index % 10
      }
    },
    mounted() {
    },
    methods: {
    },
  };
</script>

