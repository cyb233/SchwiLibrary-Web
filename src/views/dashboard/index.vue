<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ user.username }}</div>
    <div class="dashboard-info">status: {{user.status==0?'active':'banned'}}</div>
    <div class="dashboard-info">role: {{user.role==0?'user':'admin'}}</div>
    <div class="dashboard-info">borrownow: {{ user.borrownow }}</div>
    <div class="dashboard-info">borrowtimes: {{ user.borrowtimes }}</div>
    <div class="dashboard-info">createtime: {{ user.createtime }}</div>
  </div>
</template>

<script>
  //import { mapGetters } from 'vuex'
  import {
    getToken,
    getUser,
    setUser
  } from '@/utils/auth'
  import {
    parseTime
  } from '@/utils'
  import {
    refreshUser
  } from '@/api/user'

  export default {
    name: 'Dashboard',
    data() {
      return {
        user: {}
      }
    },
    created() {
      this.refreshUser()
    },
    methods: {
      refreshUser: function() {
        const oldUser = getUser()
        refreshUser().then(response => {
          const user = response.data
          user.createtime = parseTime(user.createtime)
          setUser(user)
          this.user = user
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }

    &-info {
      font-size: 20px;
      line-height: 46px;
    }
  }
</style>
