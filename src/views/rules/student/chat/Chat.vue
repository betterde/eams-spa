<template>
  <div class="main-content">
    <div class="panel">
      <div class="panel-body" :class="classes" style="height: 80vh; display: flex; flex-direction: row">
        <el-main style="padding: 0">
          <el-container class="is-vertical" style="height: 100%">
            <div class="chat-header">
              <h1>{{school.manager.name}}</h1>
            </div>
            <el-main style="flex: 1; flex-basis: auto; overflow: hidden; box-sizing: border-box; display: block; margin: 0 20px; padding: 0">
              <div class="messages-container">
                <div v-for="message in messages" :key="message.id">
                  <div :class="message.from === profile.id ? 'im-message-text right' : 'im-message-text left'">
                    <pre>{{ message.content }}</pre>
                  </div>
                </div>
              </div>
            </el-main>
            <el-footer style="margin-top: 20px">
              <el-row>
                <el-col>
                  <el-input placeholder="Press Enter to send" :disabled="sending" v-model="message.content" @keyup.enter.native="sendMessage"></el-input>
                </el-col>
              </el-row>
            </el-footer>
          </el-container>
        </el-main>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import api from '../../../../apis'
import Echo from "laravel-echo";

export default {
  name: 'Chat',
  data() {
    return {
      classes: ['animated', 'fade-in', 'fast'],
      sending: false,
      message: {
        to: this.$route.params.id,
        content: ''
      },
      school: {
        id: '',
        name: '',
        manager: {
          id: '',
          name: ''
        },
        manager_id: ''
      },
      messages: [],
      connector: null,
    }
  },
  methods: {
    fetchSchool() {
      api.school.fetchSchool(this.profile.school_id).then(res => {
        this.school = res.data;
        this.fetchMessages();
      }).catch(err => {
        this.$message.error({
          offset: 95,
          message: err.message
        });
      });
    },
    fetchMessages() {
      api.message.fetchMessages({to: this.school.manager_id}).then(res => {
        this.messages = res.data;
      }).catch(err => {
        this.$message.error({
          offset: 95,
          message: err.message
        });
      });
    },
    sendMessage() {
      this.sending = true;
      api.message.sendMessage(this.message).then(res => {
        this.sending = false;
        this.message.content = '';
        this.messages.push(res.data);
      }).catch(err => {
        this.sending = false;
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
      access_token: state => state.account.access_token
    })
  },
  mounted() {
    window.Pusher = require('pusher-js');
    window.Pusher.logToConsole = true;

    this.connector = new Echo({
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

    this.connector.private(`message.${this.profile.id}`)
        .listen('.MessageNotification', (e) => {
          this.messages.push(e.message)
        });

    this.fetchSchool();
  }
}
</script>

<style lang="scss">
.chat-header {
  padding: 20px;
  border-bottom-style: inset;
}

.messages-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  .im-message-text {
    clear: both;
    max-width: 70%;
    min-width: 30px;
    min-height: 30px;
    padding: 3px;
    margin: 10px 0;
    background: #daf3fd;

    pre {
      font-size: 14px;
      overflow: hidden;
      word-break: break-word;
      white-space: pre-wrap;
      padding: 3px 10px;
    }
  }

  .right {
    float: right;
    border-radius: 10px 0 10px 10px;
  }

  .left {
    float: left;
    background: #e7e7e7;
    border-radius: 0 10px 10px 10px;
  }
}
</style>