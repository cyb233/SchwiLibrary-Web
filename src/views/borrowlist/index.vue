<template>
  <div class="app-container">
    <el-form ref="form" :model="searchForm" label-width="120px">
      <el-form-item label="书名">
        <el-input v-model="searchForm.bookname" style="width: 500px;" />
      </el-form-item>
      <el-form-item label="用户名" v-if="roleAuth">
        <el-input v-model="searchForm.username" style="width: 500px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="borrows" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="username" width="110" v-if="roleAuth">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="bookname" width="110" align="center">
        <template slot-scope="scope">
          <span>《{{ scope.row.bookname }}》</span>
        </template>
      </el-table-column>
      <el-table-column label="duration" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.duration>0?scope.row.duration:0 }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="borrow" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.borrow | borrowFilter">{{ scope.row.borrow == 1 ? 'returned' : 'borrowed' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status == 0 ? 'active' : 'banned' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="borrowtime" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.borrowtime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="actions" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.borrow == 0" type="primary" @click="borrowBorrow(scope.row)">归还</el-button>
          <el-button v-else type="primary" disabled>归还</el-button>
          <el-button type="primary" @click="editBorrow(scope.row)" v-if="roleAuth">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--弹出层-->
    <el-dialog title="借阅记录编辑" :visible.sync="outerVisible" style="height: 800px;">
      <div>
        <el-form ref="form" :model="edit" label-width="120px">
          <el-form-item label="id" v-show="false">
            <el-input style="width: 200px;" v-model="edit.id"></el-input>
          </el-form-item>
          <el-form-item label="书籍名">
            <el-input style="width: 200px;" v-model="edit.bookname" disabled></el-input>
          </el-form-item>
          <br>
          <el-form-item label="借阅者">
            <el-input style="width: 200px;" v-model="edit.username" disabled></el-input>
          </el-form-item>
          <br>
          <el-form-item label="期限">
            <el-input style="width: 200px;" v-model="edit.duration"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="借出状态">
            <el-select placeholder="请选择" v-model="edit.borrow">
              <el-option label="已借出" :value='0' />
              <el-option label="未借出" :value='1' />
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
          <el-button type="primary" size="mini" @click="updateBorrow()">确定</el-button>
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
    searchBorrow,
    updateBorrow
  } from '@/api/borrow'
  import {
    borrowBorrow,
    returnBorrow
  } from '@/api/borrow'
  import {
    parseTime
  } from '@/utils'
  import {
    getUser
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
      },
      borrowFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'danger',
          // published: 'success',
          // draft: 'gray',
          // deleted: 'danger'
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        searchForm: {
          bookname: '',
          username: '',
          pageNow: 1, // 当前页
          pageSize: 5
        },
        edit: {
          id: 0,
          bookname: '',
          username: '',
          duration: 0,
          borrow: 0,
          status: 0,
        },
        roleAuth: false,
        data: null,
        borrows: null,
        listLoading: true,
        total: 0, // 总数据条数
        outerVisible: false,
        innerVisible: false
      }
    },
    created() {
      this.fetchData()
      this.updateRoleAuth()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        searchBorrow(this.searchForm).then(response => {
          this.data = response.data
          this.borrows = response.data.list
          this.total = response.data.total
          this.borrows.forEach(borrow => {
            borrow.borrowtime = parseTime(borrow.borrowtime)
          })
          this.listLoading = false
        })
      },
      updateRoleAuth() {
        this.roleAuth = (getUser().role == 1)
      },
      editBorrow: function(row) {
        this.edit.id = row.id;
        this.edit.bookname = row.bookname;
        this.edit.username = row.username;
        this.edit.duration = row.duration;
        this.edit.borrow = row.borrow;
        this.edit.status = row.status;
        this.outerVisible = true;
      },
      updateBorrow: function() {
        updateBorrow(this.edit).then(response => {
          this.innerVisible = false;
          this.outerVisible = false;
          this.fetchData()
        })
      },
      borrowBorrow: function(row) {
        const borrow = {
          id: row.id,
          uid: row.uid,
          bid: row.bid,
        }
        if (row.borrow == 0) {
          returnBorrow(borrow).then(response => {
            this.fetchData()
          })
        }
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
        this.searchForm.bookname = ''
        this.searchForm.username = ''
        this.fetchData()
      }
    }
  }
</script>
