<template>
  <div class="panel">
    <div class="panel-header" :class="classes">
      <div class="panel-tools">
        <el-row :gutter="20">
          <el-col :xs="24" :span="6">
            <el-input placeholder="Search schools by typing here" v-model="params.search" @keyup.enter.native="fetchSchools" @clear="handleClear" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-col :xs="12" :span="2">
            <el-button type="primary" icon="el-icon-search" @click="fetchSchools" plain>Search</el-button>
          </el-col>
          <el-col :xs="12" :span="16" style="text-align: right">
            <el-button type="primary" plain @click="handleCreate">Create</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="Create school" :visible.sync="create.dialog" @close="handleClose('create')" width="600px" :close-on-click-modal="false">
      <el-form :model="create.params" :rules="create.rules" ref="create" label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Name" prop="name">
              <el-input v-model="create.params.name" placeholder="Please enter the school name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="create.dialog = false">取消</el-button>
        <el-button type="primary" @click="submit('create')">确定</el-button>
      </div>
    </el-dialog>
    <div class="panel-body" :class="classes">
      <el-table v-loading="loading" :data="schools" style="width: 100%">
        <el-table-column prop="id" label="ID" width="300"></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="status" label="Status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="info">{{enums.school.status[scope.row.status]}}</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">{{enums.school.status[scope.row.status]}}</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">{{enums.school.status[scope.row.status]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="manager.name" label="Manager"></el-table-column>
        <el-table-column prop="created_at" label="Created At"></el-table-column>
        <el-table-column prop="option" label="Actions" width="130">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Detail" placement="top">
              <el-button size="mini" icon="el-icon-tickets" plain circle
                         @click="viewDetails(scope.row)" :disabled="scope.row.status === 1"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete" placement="top">
              <el-button size="mini" icon="el-icon-delete" type="danger" plain circle
                         @click="handleDelete(scope.row)" :disabled="scope.row.manager_id !== profile.id"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background :layout="meta.layout"
                       :page-size="params.size"
                       :total="meta.total"
                       :pager-count="meta.pager_count"
                       :page-sizes="meta.page_sizes"
                       :current-page.sync="params.current_page"
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import api from '../../../../apis';

  export default {
    name: 'OrderList',
    data() {
      return {
        enums: {
          school: {
            status: [
              'Unknown', 'Pending', 'Approved', 'Rejected'
            ]
          }
        },
        loading: false,
        classes: ['animated', 'fade-in', 'fast'],
        params: {
          size: 10,
          search: '',
          current_page: 1
        },
        create: {
          dialog: false,
          params: {
            name: ''
          },
          rules: {
            name: [
              {type: 'string', required: true, message: 'Please enter the school name', trigger: 'change'}
            ]
          }
        },
        schools: [],
        meta: {
          total: 0,
          pager_count: 11,
          page_sizes: [10, 20, 50],
          layout: 'sizes, total, prev, pager, next'
        },
      }
    },
    methods: {
      /**
       * 分页跳转时触发
       */
      handleCurrentChange(page) {
        this.params.page = page;
        this.fetchSchools();
      },
      handleClose(form) {
        switch (form) {
          case 'create':
            this.$refs.create.resetFields();
            this.create.dialog = false;
            break;
        }
      },
      /**
       * Submit form
       * @param form
       */
      submit(form){
        switch (form) {
          case 'create':
            this.$refs.create.validate(valid => {
              if (valid) {
                api.school.createSchool(this.create.params).then(res => {
                  this.handleClose(form);
                  this.$message.success({
                    offset: 95,
                    message: res.message
                  });
                  this.fetchSchools();
                }).catch(err => {
                  this.$message.error({
                    offset: 95,
                    message: err.message
                  });
                });
              } else {
                return false;
              }
            });
            break;
        }
      },
      handleCreate() {
        this.create.dialog = true;
      },
      handleDelete(row) {
        this.$confirm('此操作将删除服务器，是否继续', '警告', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.school.deleteSchool(row.id).then(res => {
            this.$message({
              type: 'success',
              offset: 95,
              message: res.message
            });
            this.fetchSchools();
          }).catch(err => {
            this.$message.error({
              offset: 95,
              message: err.message
            })
          });
        }).catch(() => {
          this.$message.info({
            offset: 95,
            message: '操作已取消'
          });
        });
      },
      viewDetails(row) {
        this.$router.push({path: `/school/${row.id}/detail`});
      },
      handleClear() {
        this.fetchSchools();
      },
      handleSizeChange(size) {
        this.params.size = size;
        this.fetchSchools();
      },
      fetchSchools() {
        this.loading = true;
        api.school.fetchSchools(this.params).then(res => {
          this.schools = res.data;
          this.params.current_page = res.current_page;
          this.meta.total = res.total;
          this.loading = false;
        }).catch(err => {
          this.$message.error({
            offset: 95,
            message: err.message
          });
        });
      }
    },
    computed: {
      ...mapState({
        profile: state => state.account.profile,
      })
    },
    mounted() {
      if (document.body.clientWidth < 767) {
        this.meta.pager_count = 5;
        this.meta.layout = 'prev, pager, next';
      }
      this.fetchSchools();
    }
  }
</script>

<style lang="scss">
  .remark {
    margin-left: 2px;
    margin-right: 2px;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
    text-overflow: ellipsis;
  }
</style>
