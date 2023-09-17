<template>
  <div class="main-content">
    <div class="profile" :class="classes">
      <div style="text-align: center">
        <el-avatar :size="128" style="font-size: 86px">G</el-avatar>
      </div>
      <div class="information">
        <div class="name">
          <h1>{{profile.name}}</h1>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body" :class="classes">
        <el-tabs v-model="active">
          <el-tab-pane label="Security" name="security">
            <div class="password" style="max-width: 400px; margin: auto">
              <el-form ref="password" :model="params" :rules="rules" label-position="top" label-width="80px">
                <el-form-item label="Old Password" prop="old">
                  <el-input v-model="params.old" type="password" placeholder="Please enter your old password" show-password></el-input>
                </el-form-item>
                <el-form-item label="New password" prop="password">
                  <el-input v-model="params.password" type="password" placeholder="Please enter your new password" show-password></el-input>
                </el-form-item>
                <el-form-item label="Confirm password" prop="password_confirmation">
                  <el-input v-model="params.password_confirmation" type="password" placeholder="Please enter your new password again" show-password></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loading" @click="submit('password')">Submit</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import api from '../../../apis';

  export default {
    name: "Profile",
    data() {
      let confirmation = (rule, value, callback) => {
        if (value !== this.params.password) {
          callback(new Error('The two passwords are inconsistent!'));
        } else {
          callback();
        }
      };
      return {
        header: '',
        loading: false,
        active: 'security',
        classes: ['animated', 'fade-in', 'fast'],
        params: {
          old: '',
          password: '',
          password_confirmation: ''
        },
        rules: {
          old: [
            {required: true, message: 'Please enter password', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please enter password', trigger: 'blur'}
          ],
          password_confirmation: [
            {required: true, message: 'Please enter password', trigger: 'blur'},
            {validator: confirmation, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState({
        profile: state => state.account.profile,
      })
    },
    methods: {
      submit(form) {
        switch (form) {
          case 'password':
            this.$refs.password.validate(valid => {
              if (valid) {
                this.loading = true;
                api.account.password(this.params).then(res => {
                  this.loading = false;
                  this.$message.success({
                    offset: 95,
                    message: res.message
                  });
                  this.$refs.password.resetFields();
                }).catch(err => {
                  this.loading = false;
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
          default:
            return false;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .main-content {
    padding: 0 16%;
  }
  .profile {
    color: #5f6268;
    padding: 40px 20px;
    text-align: center;
    background-repeat: repeat;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-image: url("../../../assets/images/background.png");
  }
  .panel {
    color: #5f6268;
    .el-tabs__item.is-top {
      color: #5f6268;
    }
  }
  .address {
    text-align: center;
  }
  .information {
    margin-top: 20px;
    .status {
      margin: 10px 0 0 0;
      text-align: center;
      width: 100%;
      ul {
        width: auto;
        margin: 0 auto;
        overflow: auto;
        list-style: none;
        line-height: 40px;
        display: inline-block;
        :after {
          clear: both;
        }
      }
      li {
        margin: 0 5px;
        display: inline;
        line-height: 40px;
        float: left;
        :last-child {
          clear: both;
        }
      }
    }
  }
</style>
