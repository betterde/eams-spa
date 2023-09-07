<template>
  <div class="main-content">
    <div class="panel"></div>
  </div>
</template>

<script>
  // import api from '../../../apis'
  export default {
    name: "Dashboard",
    data() {
      return {
        classes: ['animated', 'fade-in', 'fast'],
        summary: {
          day: 0,
          month: 0,
          daily_turnover: 0.00,
          daily_profit: 0.00,
          inventory_cost: 0.00,
          purchasing_cost: 0.00,
          sales_amount: 0.00,
          gross_profit: 0.00,
          tendency: [],
          order_quantity: []
        },
        date: new Date(),
      }
    },
    mounted() {
      // api.dashboard.fetchDashboard().then(res => {
      //   this.summary = res.data;
      // }).catch(err => {
      //   this.$message.error({
      //     offset: 95,
      //     message: err.message
      //   });
      // });
    }
  }
</script>

<style lang="scss">
</style>
