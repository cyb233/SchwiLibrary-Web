<template>
  <div class="app-container">
    <div>
      <el-form ref="form" :model="edit" label-width="120px">
        <el-form-item label="书籍名">
          <el-input style="width: 200px;" v-model="edit.name"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="作者名">
          <el-input style="width: 200px;" v-model="edit.author"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="简介">
          <el-input style="width: 200px;" v-model="edit.content"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog width="30%" title="提示:" :visible.sync="innerVisible" append-to-body>
      <p>您确认添加吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="innerVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="addBook()">确定</el-button>
      </div>
    </el-dialog>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="innerVisible = true">添加</el-button>
    </div>

  </div>
</template>

<script>
  import {
    addBook
  } from '@/api/book'
  import {
    parseTime
  } from '@/utils'
  import {
    isAdmin
  } from '@/utils/auth'
import {
  MessageBox,
  Message
} from 'element-ui'

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
        edit: {
          name: '',
          author: '',
          content: ''
        },
        data: null,
        listLoading: true,
        innerVisible: false
      }
    },
    created() {
      if (!isAdmin()) {
        Message({
          message: 'user role not enough',
          type: 'error',
          duration: 5 * 1000
        })
        this.$router.push({
          path: this.redirect || '/'
        })
      }
    },
    methods: {
      addBook: function() {
        addBook(this.edit).then(response => {
          this.innerVisible = false
          this.edit.name = ''
          this.edit.author = ''
          this.edit.content = ''
        })
      }
    }
  }
</script>
