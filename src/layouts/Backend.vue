<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="2">
          <div class="grid-content logo">
            <h3 style="line-height: 36px;"><router-link to="/server">EAMS</router-link></h3>
          </div>
        </el-col>
        <el-col :span="20">
          <el-menu v-if="profile.guard === 'teacher'" :default-active="module" class="el-menu-nav" mode="horizontal" router>
            <el-menu-item index="/">Dashboard</el-menu-item>
            <el-menu-item index="/school">School</el-menu-item>
          </el-menu>
          <el-menu v-else :default-active="module" class="el-menu-nav" mode="horizontal" router>
            <el-menu-item index="/">Dashboard</el-menu-item>
            <el-menu-item index="/chat">Chat</el-menu-item>
            <el-menu-item index="/teacher">Teacher</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="2">
          <el-row :gutter="20" type="flex" justify="end">
            <el-col :span="6">
              <el-badge :value="notifications.length" type="info" style="margin: 12px 0" :hidden="notifications.length === 0">
                <el-popover placement="bottom" width="80" trigger="click">
                  <el-table :data="notifications" empty-text="No data">
                    <el-table-column property="name" label="Sender">
                      <template slot-scope="scope">
                        <el-button type="text" @click="goToChat(scope.row)">{{scope.row.name}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference" size="medium" style="height: 36px; width: 36px" icon="el-icon-bell" circle></el-button>
                </el-popover>
              </el-badge>
            </el-col>
            <el-col :span="6">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <div class="avatar grid-content" v-html="profile.name.slice(0,1)"></div>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="profile">Personal</el-dropdown-item>
                  <el-dropdown-item command="signOut">Sign out</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row justify="center">
        <el-col :xs="24" :sm="24" :md="24" :lg="{ span: 20, offset: 2 }" :xl="{ span: 20, offset: 2 }">
          <router-view></router-view>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from 'vuex'
  import Echo from "laravel-echo";

  export default {
    name: 'backend',
    data() {
      return {
        year: '',
        senders: new Map(),
        notifications: []
      }
    },
    methods: {
      goToChat(row) {
        let index = this.senders.get(row.id);
        this.notifications.splice(index, 1);
        this.$router.push({path: `/chat/${row.id}`})
      },
      handleCommand(command) {
        switch (command) {
          case 'signOut':
            this.signOut();
            break;
          case 'profile':
            this.$router.push({path: '/profile'});
            break;
          case 'journal':
            this.$router.push({path: '/journal'});
            break;
        }
      },
      signOut(){
        this.$store.commit('SET_ACCESS_TOKEN', false);
        this.$store.commit('SET_PROFILE', false);
        this.$message.success('Sign out successful');
        // Here, the native page jump is used instead of this.$router.push("/signin") to avoid logging in again and adding routes repeatedly.
        window.location.href = '/signin';
      }
    },
    computed: {
      ...mapState({
        profile: state => state.account.profile,
        access_token: state => state.account.access_token
      }),
      module() {
        let path = this.$route.path.match(/\/[a-z]*/);
        return path.shift();
      }
    },
    mounted() {
      let date = new Date();
      this.year = date.getFullYear();

      window.Pusher = require('pusher-js');
      window.Pusher.logToConsole = true;

      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.VUE_APP_PUSHER_APP_KEY,
        auth: {
          headers: {
            Authorization: `Bearer ${this.access_token}`
          }
        },
        cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
        encrypted: true,
        logToConsole: true
      });

      window.Echo.private(`notify.${this.profile.id}`)
          .listen('.MessageNotification', (e) => {
            if (this.senders.has(e.sender.id) === false) {
              if (this.$route.name === 'chat' && this.$route.params.id === e.sender.id) {
                return;
              }
              this.notifications.push({
                id: e.sender.id,
                name: e.sender.name,
                type: 'message'
              });
              this.senders.set(e.sender.id, this.notifications.length - 1);
            }
          });
    }
  }
</script>

<style lang="scss">
  #app {
    height: 100%;
    background-color: #f0f2f5;

    .el-header {
      width: 100%;
      z-index: 100;
      background-color: white;
      box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
      .el-dropdown {
        float: right;
      }
      .avatar {
        width: 36px;
        height: 36px;
        background-color: #8c939d;
        float: right;
      }
    }

    .el-menu-nav {
      display: table;
      margin: auto;
      align-items: center;
      text-align: center;

      &.el-menu--horizontal {
        border: none;
      }
    }

    .el-container {
      height: 100%;
      min-height: 100%;

      .grid-content {
        margin: 12px 0;
        border-radius: 4px;
        min-height: 36px;
        line-height: 36px;
        font-size: 26px;
        text-align: center;
        cursor: pointer;
        color: #e9e9e9;
      }
      .logo {
        a {
          color: #8c939d;
        }
        text-align: left;
      }
    }

    .el-main {
      display: block;
      padding: 20px 0 0 0;

      .el-col {
        height: 100%;
      }
    }
  }

  .main-content {
    border-radius: 4px;
    padding: 0 20px;
    .el-page-header {
      margin-bottom: 20px;
    }
    .el-page-header__title {
      font-weight: normal;
    }
    .el-page-header__content {
      color: #909399;
      font-size: 14px;
    }
  }
</style>
