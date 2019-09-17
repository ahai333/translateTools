<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-button type="primary" @click="onAddNew">添加部门</el-button>
      </el-col>
    </el-row>
    <el-row>
      <ah-table
        :labels="labels"
        :records="values"
        :handle-edit="onEdit"
        :handle-del="onDelete"
        :batch-remove="onBatchRemove"
        :queriable="false"
      />
    </el-row>
    <!--编辑界面-->
    <el-dialog :visible.sync="editFormVisible" :title="editTitle" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-row>
          <el-col :span="10">
            <el-form-item label="部门" prop="Dept">
              <el-input v-model="editForm.Dept" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="editForm.remark"
                type="textarea"
                maxlength="500"
                show-word-limit
                rows="5"
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
 * IP管理
 */
import AhTable from '@/components/AhTable/index.vue'
import { getDeptList, modifyDept, delDept } from '@/api/home.js'

export default {
  components: { AhTable },
  data() {
    return {
      editForm: {
        uid: 0,
        remark: '',
        Dept: '部门一'
      },
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editTitle: '查看/编辑',
      editIsNew: false,
      dialogImageUrl: '',
      dialogVisible: false,
      editFormRules: {
        Dept: [{ required: true, message: '请选择部门', trigger: 'blur' }]
      },
      //
      labels: [
        {
          prop: 'uid', // 数据库中的编号
          label: '编号',
          width: 100,
          show: false
        },
        {
          prop: 'Dept',
          label: '部门',
          width: 200,
          show: true
        },
        {
          prop: 'remark',
          label: '备注',
          width: 250,
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
      getDeptList().then(res => {
        console.log(res, 'getusers')
        this.values = res.data
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    onEdit(index, row) {
      console.log(row, 'handleEdit')
      this.editTitle = '查看/编辑'
      this.editFormVisible = true
      this.editIsAdd = false
      this.editForm = Object.assign({}, row)
    },
    onDelete(index, row) {
      const param = [row.uid]
      delDept(param).then(res => {
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
        param.push(element.uid)
      })
      delDept(param).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getInfo()
      })
    },
    onAddNew() {
      this.editTitle = '添加'
      this.editFormVisible = true
      this.editIsAdd = true
      // 初始化this.editForm
      this.editForm = {
        uid: 0, // 当uid==0时，是新加的用户
        Uname: '',
        IpAddr: '',
        Dept: ''
      }
    },
    onEditSubmit() {
      const param = Object.assign({}, this.editForm)
      // console.log(param, 'onEditSubmit')

      modifyDept(param).then(res => {
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
</script>

<style lang="scss" scoped>
.el-row {
  margin: 10px;
}
.el-col {
  border-radius: 4px;
}
</style>
