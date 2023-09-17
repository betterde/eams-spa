<template>
  <div class="main-content">
    <el-page-header v-if="action !== 'list'" @back="$router.back()" title="Go back" content="Detail"></el-page-header>
    <component :is="action"></component>
  </div>
</template>

<script>
  import OrderList from './List.vue'
  import OrderDetail from './Detail.vue'

  export default {
    name: "School",
    data() {
      return {
        action: 'list'
      }
    },
    methods: {
    },
    components: {
      list: OrderList,
      detail: OrderDetail,
    },
    watch: {
      '$route' (to) {
        let uris = to.path.split('/');
        if (uris.length > 2) {
          this.action = uris.pop();
        } else {
          this.action = 'list';
        }
      }
    },
    mounted() {
      let uris = this.$route.path.split('/');
      if (uris.length > 2) {
        this.action = uris.pop();
      } else {
        this.action = 'list';
      }
    }
  }
</script>

<style lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to
  {
    opacity: 0;
  }

  .el-switch__label, .el-switch__label--right {
    color: #909399;
  }
  .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left;
    }
  }
</style>
