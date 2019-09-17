<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-button type="primary" @click="onAddNew">添加新人员</el-button>
      </el-col>
    </el-row>
    <el-row>
      <ah-table
        :labels="labels"
        :records="values"
        :handle-edit="onEdit"
        :handle-del="onDelete"
        :batch-remove="onBatchRemove"
        :handle-query="onQuery"
        :queriable="false"
      />
    </el-row>
    <!--编辑界面-->
    <el-dialog :visible.sync="editFormVisible" :title="editTitle" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="editForm.username"
                auto-complete="off"
                :disabled="editIsAdd===false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="密码" prop="password">
              <el-input v-model="editForm.password" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="权限" prop="role">
              <el-select v-model="editForm.role" placeholder="请选择">
                <el-option v-for="item in roles" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="有效期" prop="expire">
              <el-date-picker v-model="editForm.expire" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="备注" prop="remarks">
              <el-input
                v-model="editForm.remarks"
                type="textarea"
                placeholder="请输入内容"
                maxlength="300"
                rows="3"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="onEditSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 用户管理
 */
import AhTable from '@/components/AhTable/index.vue'
import { getAdminList, modifyAdmin, delAdmin } from '@/api/admin.js'
import md5 from 'js-md5'

export default {
  components: { AhTable },
  data() {
    return {
      editForm: {
        uuid: 0,
        username: '',
        password: '',
        role: '',
        email: '',
        expire: '',
        remarks: ''
      },
      tmppass: '',
      roles: ['admin', 'editor'],
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editTitle: '查看/编辑',
      editIsAdd: false,
      dialogImageUrl: '',
      dialogVisible: false,
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      //
      labels: [
        {
          prop: 'uuid', // 数据库中的编号
          label: '编号',
          width: 100,
          show: false
        },
        {
          prop: 'username',
          label: '用户名',
          width: 200,
          show: true
        },
        {
          prop: 'email',
          label: '邮箱',
          width: 250,
          show: true
        },
        {
          prop: 'role',
          label: '权限',
          width: 200,
          show: true
        },
        {
          prop: 'expire',
          label: '有效期',
          width: 200,
          show: true
        },
        {
          prop: 'password',
          label: '密码',
          width: 250,
          show: false
        },
        {
          prop: 'remarks',
          label: '备注',
          width: 350,
          show: true
        }
      ],
      // 从服务器获取
      values: []
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getAdminList().then(res => {
        this.values = res.data
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    onEdit(index, row) {
      this.editTitle = '查看/编辑'
      this.editFormVisible = true
      this.editIsAdd = false
      this.editForm = Object.assign({}, row)
      this.tmppass = this.editForm.password
    },
    onDelete(index, row) {
      const param = [row.uuid]
      delAdmin(param).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getInfo()
      })
    },
    onBatchRemove(sels) {
      const param = []
      sels.forEach(element => {
        param.push(element.uuid)
      })
      delAdmin(param).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getInfo()
      })
    },
    onQuery(filter) {
      const json = '{"' + filter.name + '": "' + filter.value + '" }'
      console.log(json)

      const param = JSON.parse(json)
      getAdminList(param).then(res => {
        console.log(res, 'getusers')
        this.values = res.data
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    onAddNew() {
      this.editTitle = '添加'
      this.editFormVisible = true
      this.editIsAdd = true
      // 初始化this.editForm
      this.editForm = {
        uuid: 0, // 当uuid==0时，是新加的用户
        username: '',
        password: '',
        role: '',
        email: '',
        expire: '',
        remarks: ''
      }
    },
    onEditSubmit() {
      // 判断是否修改了密码
      const param = Object.assign({}, this.editForm)
      console.log(this.tmppass, this.editForm.password, 'onEditSubmit')

      if (this.tmppass !== this.editForm.password) {
        this.$confirm('确实要修改密码?', 'Warning', {
          type: 'warning'
        })
          .then(() => {
            param.password = md5(this.editForm.password)
            modifyAdmin(param).then(res => {
              if (res.data === true) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.editFormVisible = false
                this.getInfo()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        modifyAdmin(param).then(res => {
          if (res.data === true) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.editFormVisible = false
            this.getInfo()
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin: 10px;
}
.el-col {
  border-radius: 4px;
}
</style>
