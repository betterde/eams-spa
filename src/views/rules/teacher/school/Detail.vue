<template>
  <div class="panel">
    <div class="panel-header" :class="classes">
      <div class="panel-tools">
        <el-row :gutter="20">
          <el-col :span="12" style="text-align: left">
            <el-button type="info" plain @click="$router.back()">Go back</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button v-if="profile.id === school.manager_id && active === 'student'" type="primary" plain @click="handleCreateStudent">Create</el-button>
            <el-button v-else-if="profile.id === school.manager_id && active === 'invitation'" type="primary" plain @click="handleTeacherInvitation">Create</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="Invitation" :visible.sync="invitation.dialog" @close="handleClose('create')" width="600px" :close-on-click-modal="false">
      <el-form :model="invitation.params" :rules="invitation.rules" ref="invitation" label-position="top">
        <el-form-item label="Email" prop="email">
          <el-input type="string" v-model="invitation.params.email" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="invitation.dialog = false">取消</el-button>
        <el-button type="primary" @click="submit('invitation')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Student" :visible.sync="student.create.dialog" @close="handleClose('create')" width="600px" :close-on-click-modal="false">
      <el-form :model="student.create.params" :rules="student.create.rules" ref="student" label-position="top">
        <el-form-item label="Name" prop="name">
          <el-input type="string" v-model="student.create.params.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input type="string" v-model="student.create.params.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="student.create.params.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="student.create.dialog = false">取消</el-button>
        <el-button type="primary" @click="submit('student')">确定</el-button>
      </div>
    </el-dialog>
    <div class="panel-body" :class="classes">
      <div class="details" style="padding: 20px">
        <table>
          <tbody>
          <tr>
            <td class="detail-item">
              <span class="detail-item-label detail-item-colon">ID</span>
              <span class="detail-item-content">{{school.id}}</span>
            </td>
            <td class="detail-item">
              <span class="detail-item-label detail-item-colon">Name</span>
              <span class="detail-item-content">{{school.name}}</span>
            </td>
            <td class="detail-item">
              <span class="detail-item-label detail-item-colon">Status</span>
              <span class="detail-item-content">{{enums.school.status[school.status]}}</span>
            </td>
            <td class="detail-item">
              <span class="detail-item-label detail-item-colon">Manager</span>
              <span class="detail-item-content">{{school.manager.name}}</span>
            </td>
            <td class="detail-item">
              <span class="detail-item-label detail-item-colon">Created At</span>
              <span class="detail-item-content">{{school.created_at}}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <el-tabs v-model="active" @tab-click="changeTab">
        <el-tab-pane label="Student" name="student">
          <el-table v-loading="student.loading" :data="students" style="width: 100%" ref="pipeline">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="email" label="Email"></el-table-column>
            <el-table-column prop="created_at" label="Created At"></el-table-column>
            <el-table-column v-if="profile.id === school.manager_id" prop="option" label="Actions" width="90">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="Chat" placement="top">
                  <el-button size="mini" icon="el-icon-chat-dot-round" plain circle @click="goToChat(scope.row)" :disabled="school.manager_id !== profile.id"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Delete" placement="top">
                  <el-button size="mini" icon="el-icon-delete" type="danger" plain circle @click="handleDeleteStudent(scope.row)" :disabled="profile.id === school.manager_id"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="sizes, total, prev, pager, next"
                           :page-size="student.query.size" :page-sizes="student.meta.page_sizes"
                           :current-page.sync="student.query.page" :total="student.meta.total"
                           @current-change="handleStudentsTableCurrentChange"
                           @size-change="handleStudentsTableSizeChange">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="profile.id === school.manager_id" label="Teacher" name="teacher">
          <el-table v-loading="teacher.loading" :data="teachers" style="width: 100%" ref="pipeline">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="email" label="Email"></el-table-column>
            <el-table-column prop="pivot.role" label="Role"></el-table-column>
            <el-table-column prop="created_at" label="Join At"></el-table-column>
            <el-table-column prop="option" label="Actions" width="80">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="Delete" placement="top">
                  <el-button size="mini" icon="el-icon-delete" type="danger" plain circle
                             @click="handleDeleteTeacher(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="sizes, total, prev, pager, next"
                           :page-size="teacher.query.size" :page-sizes="teacher.meta.page_sizes"
                           :current-page.sync="teacher.query.page" :total="teacher.meta.total"
                           @current-change="handleTeachersTableCurrentChange"
                           @size-change="handleTeachersTableSizeChange">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="profile.id === school.manager_id" label="Invitation" name="invitation">
          <el-table v-loading="invitation.loading" :data="invitations" style="width: 100%" ref="pipeline">
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="email" label="Email"></el-table-column>
            <el-table-column prop="initiator.name" label="Initiator"></el-table-column>
            <el-table-column prop="status" label="Activated">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1">Yes</el-tag>
                <el-tag v-else type="info">No</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="expires" label="Expires"></el-table-column>
            <el-table-column prop="created_at" label="Join At"></el-table-column>
            <el-table-column prop="option" label="Actions" width="80">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="Delete" placement="top">
                  <el-button size="mini" icon="el-icon-delete" type="danger" plain circle
                             @click="handleDeleteTeacher(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="sizes, total, prev, pager, next"
                           :page-size="invitation.query.size" :page-sizes="teacher.meta.page_sizes"
                           :current-page.sync="invitation.query.page" :total="teacher.meta.total"
                           @current-change="handleTeachersTableCurrentChange"
                           @size-change="handleTeachersTableSizeChange">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import api from '../../../../apis'

  export default {
    name: "Detail",
    data() {
      return {
        step: 0,
        enums: {
          school: {
            status: [
              'Unknown', 'Pending', 'Approved', 'Rejected'
            ]
          }
        },
        active: 'student',
        school: {
          id: '',
          name: '',
          status: '',
          manager: {
            id: "",
            name: ""
          },
          manager_id: '',
          created_at: '',
        },
        classes: ['animated', 'fade-in', 'fast'],
        student: {
          loading: false,
          query: {
            school_id: this.$route.params.id,
            only_followers: false,
            size: 5,
            page: 1,
          },
          meta: {
            total: 0,
            page_sizes: [10, 20, 50]
          },
          create: {
            dialog: false,
            params: {
              name: '',
              email: '',
              password: '',
              password_confirmation: '',
              school_id: this.$route.params.id
            },
            rules: {
              name: [
                {type: 'string', required: true, message: 'Please enter student name', trigger: 'blur'}
              ],
              email: [
                {type: 'email', required: true, message: 'Please enter email', trigger: 'blur'}
              ],
              password: [
                {type: 'string', required: true, message: 'Please enter password', trigger: 'blur'}
              ]
            }
          }
        },
        teacher: {
          loading: false,
          query: {
            school_id: this.$route.params.id,
            size: 5,
            page: 1,
          },
          meta: {
            total: 0,
            page_sizes: [10, 20, 50]
          }
        },
        invitation: {
          loading: false,
          dialog: false,
          query: {
            size: 5,
            page: 1,
            school_id: this.$route.params.id
          },
          params: {
            email: '',
            school_id: this.$route.params.id
          },
          meta: {
            total: 0,
            page_sizes: [10, 20, 50]
          },
          rules: {
            email: [
              {type: 'email', required: true, message: 'Please enter email', trigger: 'blur'}
            ]
          }
        },
        teachers: [],
        students: [],
        invitations: [],
      }
    },
    methods: {
      fetchSchool() {
        if (this.$route.params.hasOwnProperty('id')) {
          api.school.fetchSchool(this.$route.params.id).then(res => {
            this.school = res.data;
          }).catch(err => {
            this.$message.error({
              offset: 95,
              message: err.message
            });
          });
        } else {
          this.$message.error({
            offset: 95,
            message: 'Missing school ID parameter'
          });
        }
      },
      fetchTeachers() {
        if (this.$route.params.hasOwnProperty('id')) {
          this.teacher.loading = true
          api.teacher.fetchTeachers(this.teacher.query).then(res => {
            this.teachers = res.data;
            this.teacher.loading = false
            this.teacher.meta.total = res.total;
          }).catch(err => {
            this.$message.error({
              offset: 95,
              message: err.message
            });
            this.teacher.loading = false
          });
        }
      },
      fetchStudents() {
        if (this.$route.params.hasOwnProperty('id')) {
          this.student.loading = true;
          api.student.fetchStudents(this.student.query).then(res => {
            this.students = res.data;
            this.student.loading = false;
            this.student.meta.total = res.total;
          }).catch(err => {
            this.$message.error({
              offset: 95,
              message: err.message
            });
            this.student.loading = false;
          })
        }
      },
      fetchInvitations() {
        if (this.$route.params.hasOwnProperty('id')) {
          this.invitation.loading = true;
          api.invitation.fetchInvitations(this.invitation.params).then(res => {
            this.invitations = res.data;
            this.invitation.loading = false;
            this.invitation.meta.total = res.total;
          }).catch(err => {
            this.$message.error({
              offset: 95,
              message: err.message
            });
            this.student.loading = false;
          })
        }
      },
      handleTeacherInvitation(){
        this.invitation.dialog = true;
      },
      handleCreateStudent() {
        this.student.create.dialog = true;
      },
      handleClose(form) {
        switch (form) {
          case 'create':
            this.$refs.create.resetFields();
            break;
          case 'update':
            break;
        }
      },
      submit(action) {
        switch (action) {
          case 'invitation':
            this.$refs.invitation.validate((valid) => {
              if (valid) {
                api.invitation.createInvitation(this.invitation.params).then(res => {
                  this.$message.success({
                    offset: 95,
                    message: res.message
                  });
                  this.fetchInvitations();
                  this.invitation.dialog = false;
                }).catch(err => {
                  this.$message.error({
                    offset: 95,
                    message: err.message
                  });
                })
              } else {
                return false;
              }
            });
            break;
          case 'student':
            this.$refs.student.validate((valid) => {
              if (valid) {
                this.student.create.params.password_confirmation = this.student.create.params.password;
                api.student.createStudent(this.student.create.params).then(res => {
                  this.$message.success({
                    offset: 95,
                    message: res.message
                  });
                  this.fetchStudents();
                  this.student.create.dialog = false;
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
      goToChat(row) {
        this.$router.push({path: `/chat/${row.id}`})
      },
      changeTab(current) {
        if (current.name === 'teacher') {
          this.fetchTeachers();
        }

        if (current.name === 'student') {
          this.fetchStudents();
        }

        if (current.name === 'invitation') {
          this.fetchInvitations();
        }
      },
      handleDeleteTeacher(row) {
        this.$confirm('Are you sure you want to delete it?', 'Warning', {
          confirmButtonText: 'Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          api.teacher.deleteTeacher(row.id).then(res => {
            this.$message.success({
              offset: 95,
              message: res.message
            });
          }).catch(err => {
            this.$message.error({
              offset: 95,
              message: err.message
            });
          });
        }).catch(() => {
          this.$message.info({
            offset: 95,
            message: 'Operation canceled'
          });
        });
      },
      handleDeleteStudent(row) {
        this.$confirm('Are you sure you want to delete it?', 'Warning', {
          confirmButtonText: 'Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          api.student.deleteStudent(row.id).then(res => {
            this.$message.success({
              offset: 95,
              message: res.message
            });
          }).catch(err => {
            this.$message.error({
              offset: 95,
              message: err.message
            });
          })
        }).catch(() => {
          this.$message.info({
            offset: 95,
            message: 'Operation canceled'
          });
        });
      },
      handleTeachersTableCurrentChange(page) {
        this.teacher.query.page = page;
        this.fetchTeachers();
      },
      handleTeachersTableSizeChange(size) {
        this.teacher.query.size = size;
        this.fetchTeachers();
      },
      handleStudentsTableCurrentChange(page) {
        this.student.query.page = page;
        this.fetchTeachers();
      },
      handleStudentsTableSizeChange(size) {
        this.student.query.size = size;
        this.fetchTeachers();
      },
    },
    computed: {
      ...mapState({
        profile: state => state.account.profile,
      })
    },
    mounted() {
      this.invitation.params.school_id = this.$route.params.id;
      this.fetchSchool();
      this.fetchStudents();
    }
  }
</script>

<style lang="scss">
  .details {
    width: 100%;
    font-size: 14px;
    table {
      width: 100%;
    }
    .detail-item-colon:after {
      position: relative;
      content: ':';
      margin: 0 8px 0 2px;
    }
    .detail-item-label {
      color: #303133;
    }
    .detail-item-content {
      color: #5d5e5f;
    }
    .detail-item {
      padding-bottom: 20px;
    }
  }
  .statement {
    text-align: center;
  }
</style>
