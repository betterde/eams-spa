<template>
  <div class="signinview">
    <div class="panel signin">
      <div class="panel-header">
        <h1 class="panel-title">EAMS</h1>
      </div>
      <div class="panel-body">
        <el-form :model="credentials" :rules="rules" ref="signin">
          <el-form-item prop="guard">
            <el-select style="display: block" v-model="credentials.guard" autocomplete="off" placeholder="Please select your identity type">
              <el-option label="Teacher" value="teacher"></el-option>
              <el-option label="Student" value="student"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="credentials.username" autocomplete="off" placeholder="Username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="credentials.password" @keyup.enter.native="submit" placeholder="Password" show-password></el-input>
          </el-form-item>
          <el-form-item class="login-button">
            <el-button type="primary" plain class="pull-right" style="width: 100%" @click="submit" :loading="loading">Sign-In</el-button>
          </el-form-item>
          <el-form-item>
            <div id="sign-in-with-google" style="text-align: center"></div>
          </el-form-item>
          <div class="tips">
            <p>If you forgot your password, <router-link to="/forgot">Please click here!</router-link></p>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../../apis';
  import store from '../../../store';
  import register from "../../../router/register";

  export default {
    name: "SignIn",
    data() {
      return {
        loading: false,
        platform: {
          google: false
        },
        credentials: {
          guard: '',
          username: '',
          password: ''
        },
        rules: {
          guard: [
            {required: true, message: 'Please select your identity type', trigger: 'change'},
          ],
          username: [
            {required: true, message: 'Please enter the email address', trigger: 'blur'},
          ],
          password: [
            {required: true, message: 'Please enter password', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs.signin.validate(valid => {
          if (valid) {
            this.loading = true;
            store.dispatch('signIn', this.credentials).then(() => {
              store.dispatch("fetchProfile").then(res => {
                this.loading = false;
                this.$router.addRoutes(register(res.data.guard));
                this.$router.replace('/');
              });
            }).catch(err => {
              this.loading = false;
              if (err.hasOwnProperty('exception')) {
                this.$message.error(`${err.exception}: ${err.message}`);
              } else {
                this.$message.error(err.message);
              }
            });
          } else {
            return false;
          }
        });
      }
    },
    mounted() {
      api.system.fetchPlatform().then(res => {
        this.platform = res.data;
      });
    }
  }
</script>

<style lang="scss">
  html, body {
    color: #76838f;
    margin: 0;
  }

  .signinview {
    height: 100%;
    display: flex;
    background: #62a8ea;
    background-repeat: repeat-x;
    background-image: -o-linear-gradient(top, #62a8ea 0, #3583ca 100%);
    background-image: linear-gradient(to bottom, #62a8ea 0, #3583ca 100%);
    background-image: -webkit-linear-gradient(top, #62a8ea 0, #3583ca 100%);
    background-image: -webkit-gradient(linear, left top, left bottom, from(#62a8ea), to(#3583ca));

    .panel-title {
      font-size: 28px;
      margin: 0 0 30px 0;
    }

    .footer-row {
      height: 100%;
      z-index: 0;
    }
  }

  .signin {
    z-index: 10;
    width: 400px;
    padding: 40px;
    margin: 0 auto;
    border-radius: 4px;
    align-self: center;
    background-color: #FFF;
    box-shadow: 0 2px 2px rgba(0, 0, 0, .05);

    .panel-header {
      text-align: center;

      .panel-title {
        color: #76838f;
      }
    }

    .panel-body {
      text-align: center;
      padding: 10px;

      .tips {
        font-size: 14px;
        font-weight: 400;
      }
    }

    .login-button {
      padding-top: 10px;
    }
    #sign-in-with-google {
      .abcRioButton {
        width: 100% !important;
      }
    }
  }

  @media screen and (max-width: 734px) and (min-width: 0px) {
    .signin {
      width: 80%;
      padding: 4%;
    }
  }
</style>
