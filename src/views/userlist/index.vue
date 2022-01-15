<template>
  <div class="app-container">
    <el-form ref="form" :model="searchForm" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" style="width: 500px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="users" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="username" width="110">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="role" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role == 0 ? 'user' : 'admin' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="borrownow" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.borrownow }}
        </template>
      </el-table-column>
      <el-table-column label="borrowtimes" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.borrowtimes }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status == 0 ? 'active' : 'banned' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="createtime" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="actions" width="110" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--弹出层-->
    <el-dialog title="用户编辑" :visible.sync="outerVisible" style="height: 600px;">
      <div>
        <el-form ref="form" :model="edit" label-width="120px">
          <el-form-item label="id" v-show="false">
            <el-input style="width: 200px;" v-model="edit.id"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input style="width: 200px;" v-model="edit.username"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="权限">
            <el-select placeholder="请选择" v-model="edit.role">
              <el-option label="user" :value='0' />
              <el-option label="admin" :value='1' />
            </el-select>
          </el-form-item>
          <br>
          <el-form-item label="状态">
            <el-select placeholder="请选择" v-model="edit.status">
              <el-option label="active" :value='0' />
              <el-option label="banned" :value='1' />
            </el-select>
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
    </el-dialog>

    <div style="width:90%;margin-top:30px;margin-left:30px">
      <!-- 分页 -->
      <el-pagination background :current-page="searchForm.pageNow" :page-sizes="[2,5,10,15]"
        :page-size="searchForm.pageSize" layout="total,prev,pager,next,jumper,sizes" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
  import {
    searchUser,
    updateUser
  } from '@/api/user'
  import {
    parseTime
  } from '@/utils'
  import {
    isAdmin
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
          role: 0,
          status: 0,
        },
        data: null,
        users: null,
        listLoading: true,
        total: 0, // 总数据条数
        outerVisible: false,
        innerVisible: false
      }
    },
    created() {
      if (!isAdmin()) {
        this.$router.push({
          path: this.redirect || '/'
        })
      }
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        searchUser(this.searchForm).then(response => {
          this.data = response.data
          this.users = response.data.list
          this.total = response.data.total
          this.users.forEach(user => {
            user.createtime = parseTime(user.createtime)
          })
          this.listLoading = false
        })
      },
      editUser: function(row) {
        this.edit.id = row.id;
        this.edit.username = row.username;
        this.edit.role = row.role;
        this.edit.status = row.status;
        this.outerVisible = true;
      },
      updateUser: function() {
        updateUser(this.edit).then(response => {
          this.innerVisible = false;
          this.outerVisible = false;
          this.fetchData()
        })
      },
      handleSizeChange: function(size) {
        this.searchForm.pageSize = size
        this.fetchData()
      },
      handleCurrentChange: function(pageNow) {
        this.searchForm.pageNow = pageNow
        this.fetchData()
      },
      onSubmit: function() {
        this.fetchData()
      },
      onCancel: function() {
        this.searchForm.username = ''
        this.fetchData()
      }
    }
  }
</script>
