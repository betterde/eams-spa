<template>
  <div class="main-content">
    <div class="panel">
      <div class="panel-body" :class="classes">
        <el-table v-loading="loading" :data="students" style="width: 100%">
          <el-table-column prop="id" label="ID" width="300"></el-table-column>
          <el-table-column prop="name" label="Name"></el-table-column>
          <el-table-column prop="email" label="Email"></el-table-column>
          <el-table-column prop="created_at" label="Created At"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination background :layout="meta.layout"
                         :page-size="query.size"
                         :total="meta.total"
                         :pager-count="meta.pager_count"
                         :page-sizes="meta.page_sizes"
                         :current-page.sync="query.current_page"
                         @current-change="handleCurrentChange"
                         @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../../apis'
export default {
  name: 'Followers',
  data() {
    return {
      meta: {
        total: 0,
        pager_count: 11,
        page_sizes: [10, 20, 50],
        layout: 'sizes, total, prev, pager, next'
      },
      query: {
        page: 1,
        size: 10,
        search: '',
        current_page: 1
      },
      loading: false,
      classes: ['animated', 'fade-in', 'fast'],
      students: [],
    }
  },
  methods: {
    fetchFollowers() {
      api.teacher.fetchFollowers(this.query).then(res => {
        this.students = res.data;
      }).catch(err => {
        this.$message.error({
          offset: 95,
          message: err.message
        });
      })
    },
    handleCurrentChange(page) {
      this.query.page = page;
      this.fetchFollowers();
    },
    handleSizeChange(size) {
      this.query.size = size;
      this.fetchFollowers();
    }
  },
  mounted() {
    this.fetchFollowers();
  }
}
</script>
<style lang="scss">

</style>