<template>
  <div class="app-container">

    <!--弹出层-->
    <div>
      <el-form ref="form" :model="edit" label-width="120px">
        <el-form-item label="id" v-show="false">
          <el-input style="width: 200px;" v-model="edit.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input style="width: 200px;" v-model="edit.username"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="密码">
          <el-input style="width: 200px;" v-model="edit.password"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog width="30%" title="提示:" :visible.sync="innerVisible" append-to-body>
      <p>您确认修改吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="innerVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="updateUser()">确定</el-button>
      </div>
    </el-dialog>

    <div slot="footer" class="dialog-footer">
      <el-button @click="outerVisible = false">取 消</el-button>
      <el-button type="primary" @click="innerVisible = true">更新</el-button>
    </div>

  </div>
</template>

<script>
  import {
    updateUser
  } from '@/api/user'
  import {
    parseTime
  } from '@/utils'
  import {
    getToken,
    getUser,
    setUser
  } from '@/utils/auth'

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: 'success',
          1: 'danger',
          // published: 'success',
          // draft: 'gray',
          // deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        searchForm: {
          username: '',
          pageNow: 1, // 当前页
          pageSize: 5
        },
        edit: {
          id: 0,
          username: '',
          password: '',
        },
        data: null,
        listLoading: true,
        total: 0, // 总数据条数
        outerVisible: false,
        innerVisible: false
      }
    },
    created() {
      this.fetchData()
      const user = getUser()
      this.edit.id = user.id
      this.edit.username = user.username
      this.edit.password = user.password
    },
    methods: {
      fetchData() {
        this.listLoading = true
        const user = getUser()
        user.username = this.edit.username
        this.listLoading = false
      },
      updateUser: function() {
        updateUser(this.edit).then(response => {
          this.innerVisible = false;
          this.fetchData()
        })
      }
    }
  }
</script>
