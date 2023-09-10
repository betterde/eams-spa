<template>
  <div class="main-content">
    <div class="panel">
      <div class="panel-header" :class="classes">
        <div class="panel-tools">
          <el-row :gutter="20">
            <el-col :xs="24" :span="6">
              <el-input placeholder="Search teachers by typing here" v-model="query.search" @keyup.enter.native="fetchTeachers" @clear="handleClear" clearable>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-col>
            <el-col :xs="12" :span="2">
              <el-button type="primary" icon="el-icon-search" @click="fetchTeachers" plain>Search</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="panel-body" :class="classes">
        <el-table v-loading="loading" :data="teachers" empty-text="No data" style="width: 100%">
          <el-table-column prop="id" label="ID" width="300"></el-table-column>
          <el-table-column prop="name" label="Name"></el-table-column>
          <el-table-column prop="email" label="Email"></el-table-column>
          <el-table-column prop="option" label="Actions" width="130">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.followed" class="item" effect="dark" content="Unfollow" placement="top">
                <el-button size="mini" type="info" icon="el-icon-star-off" plain circle @click="changeFollowStatus(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="dark" content="Follow" placement="top">
                <el-button size="mini" type="success" icon="el-icon-star-on" plain circle @click="changeFollowStatus(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
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
import {mapState} from 'vuex'
import api from '../../../apis'

export default {
  name: 'Teacher',
  data() {
    return {
      loading: false,
      classes: ['animated', 'fade-in', 'fast'],
      query: {
        size: 10,
        search: '',
        follow: true,
        school_id: '',
        current_page: 1
      },
      meta: {
        total: 0,
        pager_count: 11,
        page_sizes: [10, 20, 50],
        layout: 'sizes, total, prev, pager, next'
      },
      teachers: [],
    }
  },
  methods: {
    fetchTeachers() {
      this.loading = true;
      api.teacher.fetchTeachers(this.query).then(res => {
        this.teachers = res.data.map(item => {
          item.followed = item.followers.length !== 0;
          return item;
        });
        console.log(this.teachers);
        this.loading = false;
      }).catch(err => {
        console.log(err);
        this.loading = false;
        this.$message.error({
          offset: 95,
          message: err.message
        });
      });
    },
    handleClear() {
      this.fetchTeachers();
    },
    handleCurrentChange(page) {
      this.query.page = page;
      this.fetchTeachers();
    },
    handleSizeChange(size) {
      this.query.size = size;
      this.fetchTeachers();
    },
    changeFollowStatus(row) {
      api.teacher.changeFollowStatus({teacher_id: row.id}).then(res => {
        this.fetchTeachers();
      }).catch(err => {
        this.$message.error({
          offset: 95,
          message: err.message
        });
      })
    }
  },
  computed: {
    ...mapState({
      profile: state => state.account.profile,
    })
  },
  mounted() {
    this.query.school_id = this.profile.school_id;
    this.fetchTeachers();
  }
}
</script>

<style lang="scss">

</style>