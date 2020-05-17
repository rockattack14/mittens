import Vue from 'vue'
import App from './App.vue'

var eventBus = new Vue()

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">
    <div class="product-image">
      <img :src="image">
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else>Out of Stock</p>
      <p>Shipping: {{ shipping }}</p>

      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>

      <div class="color-box" 
          v-for="(variant, index) in variants" 
          :key="variant.variantId" 
          :style="{ 'background-color': variant.variantColor }" 
          @mouseover="updateProduct(index)"
          ></div>

      <button v-on:click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock}"
              >Add to Cart</button>

    </div>

    <product-tabs :reviews="reviews"></product-tabs>

  </div>`,
  data() {
    return {
      brand: "Sac Clothes",
      product: "Mittens",
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "brown",
          variantImage: '/src/assets/brown-mittens.png',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "gray",
          variantImage: '/src/assets/gray-mittens.png',
          variantQuantity: 0
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart: function () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct (index) {
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if(this.premium) {
        return "Free"
      }
      else {
        return 2.99
      }
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>

  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name">
  </p>

  <p>
    <label for="review">Review:</label>
    <textarea id="review" v-model="review"></textarea>
  </p>

  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>
    <fieldset>
      <legend>Would you Recommend this Product?</legend>
        <input type="radio" id="recommended" v-model.Boolean="recommended" name="Yes" value="True">
        <input type="radio" id="recommended" v-model.Boolean="recommended" name="No" value="False">
    </fieldset>
  </p>

  <p>
    <input type="submit" value="Submit">
  </p>

  </form>
  `,
  data () {
    return {
      name: null,
      review: null,
      rating: null,
      recommended: null,
      errors: []
    }
  },
  methods: {
    onSubmit () {
      this.errors = []
      if (this.name && this.review && this.rating && this.recommended != null) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommended: this.recommended
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommended = null
      }
      else {
        if (!this.name) this.errors.push("Name required.")
        if (!this.rating) this.errors.push("Rating required.")
        if (!this.review) this.errors.push("Review required.")
        if (this.recommended == null) this.errors.push("Recommendation required.")
      }
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
    <span class="tab"
          :class="{ activeTab: selectedTab == tab}"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="selectedTab = tab">{{ tab }}</span>

    <div v-show="selectedTab==='Reviews'">
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <p v-else>There are {{ reviews.length }} reviews</p>
      <ul>
        <li v-for="review in reviews">
        <p>{{ review.name }}</p>
        <p>{{ review.rating }}</p>
        <p>{{ review.review }}</p>
        <p>{{ review.recommended }}</p>
        </li>
      </ul>
    </div>
    
    <product-review v-show="selectedTab==='Make a Review'"></product-review>
  </div>
  `,
  data () {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    }
  }
  // render: h => h(App)
})


