<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-button plain type="primary" @click="onAddNew">{{ $t('systemView.addnew') }}</el-button>
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
            <el-form-item :label="$t('systemView.username')" prop="username">
              <el-input
                v-model="editForm.username"
                auto-complete="off"
                :disabled="editIsAdd===false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('systemView.password')" prop="password">
              <el-input v-model="editForm.password" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('systemView.role')" prop="role">
              <el-select v-model="editForm.role" :placeholder="$t('systemView.selectPlaceholder')">
                <el-option v-for="item in roles" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('systemView.email')" prop="email">
              <el-input v-model="editForm.email" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('systemView.expire')" prop="expire">
              <el-date-picker
                v-model="editForm.expire"
                type="date"
                :placeholder="$t('systemView.selectPlaceholder')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item :label="$t('systemView.remarks')" prop="remarks">
              <el-input
                v-model="editForm.remarks"
                type="textarea"
                :placeholder="$t('systemView.remarks')"
                maxlength="300"
                rows="3"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">{{ $t('systemView.cancel') }}</el-button>
        <el-button
          type="primary"
          :loading="editLoading"
          @click.native="onEditSubmit"
        >{{ $t('systemView.submit') }}</el-button>
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
      editTitle: this.$t('systemView.view'),
      editIsAdd: false,
      dialogImageUrl: '',
      dialogVisible: false,
      editFormRules: {
        username: [
          {
            required: true,
            message: this.$t('systemView.username'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('systemView.password'),
            trigger: 'blur'
          }
        ]
      },
      //
      labels: [
        {
          prop: 'uuid', // 数据库中的编号
          label: 'uuid',
          width: 100,
          show: false
        },
        {
          prop: 'username',
          label: this.$t('systemView.username'),
          width: 200,
          show: true
        },
        {
          prop: 'email',
          label: this.$t('systemView.email'),
          width: 250,
          show: true
        },
        {
          prop: 'role',
          label: this.$t('systemView.role'),
          width: 200,
          show: true
        },
        {
          prop: 'expire',
          label: this.$t('systemView.expire'),
          width: 200,
          show: true
        },
        {
          prop: 'password',
          label: this.$t('systemView.password'),
          width: 250,
          show: false
        },
        {
          prop: 'remarks',
          label: this.$t('systemView.remarks'),
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
      this.editTitle = this.$t('systemView.view')
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
      this.editTitle = this.$t('systemView.addnew')
      this.editFormVisible = true
      this.editIsAdd = true
      // 初始化this.editForm
      this.editForm = {
        uuid: 0, // 当uuid==0时，是新加的用户
        username: '',
        password: '',
        role: 'editor',
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
        this.$confirm(this.$t('systemView.changepwd'), 'Warning', {
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
