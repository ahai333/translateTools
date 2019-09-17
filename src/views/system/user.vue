<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-button type="primary" @click="onAddNew">添加人员</el-button>
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
        :queriable="true"
      />
    </el-row>
    <!--编辑界面-->
    <el-dialog :visible.sync="editFormVisible" :title="editTitle" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-row>
          <el-col :span="10">
            <el-form-item label="姓名" prop="Uname">
              <el-input v-model="editForm.Uname" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="Ip地址" prop="IpAddr">
              <el-input v-model="editForm.IpAddr" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="部门" prop="Dept">
              <el-select v-model="editForm.Dept" placeholder="请选择">
                <el-option v-for="item in department" :key="item" :label="item" :value="item" />
              </el-select>
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
import { getUserList, getDepts, modify, delUser } from '@/api/home.js'

export default {
  components: { AhTable },
  data() {
    return {
      editForm: {
        uid: 0,
        Uname: '姓名',
        IpAddr: '127.0.0.1',
        Dept: '部门一'
      },
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editTitle: '查看/编辑',
      editIsNew: false,
      dialogImageUrl: '',
      dialogVisible: false,
      department: [],
      editFormRules: {
        Uname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        IpAddr: [{ required: true, message: '请输入IP', trigger: 'blur' }],
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
          prop: 'Uname',
          label: '姓名',
          width: 200,
          show: true
        },
        {
          prop: 'IpAddr',
          label: 'IP地址',
          width: 250,
          show: true
        },
        {
          prop: 'Dept',
          label: '所在部门',
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
    this.getDeptsList()
  },
  methods: {
    getDeptsList() {
      getDepts().then(response => {
        // todo:错误判断
        const depts = ['']
        response.data.forEach(dept => {
          depts.push(dept)
        })
        this.department = depts
      })
    },
    getInfo() {
      getUserList().then(res => {
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
      delUser(param).then(res => {
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
      delUser(param).then(res => {
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
      getUserList(param).then(res => {
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
        uid: 0, // 当uid==0时，是新加的用户
        Uname: '',
        IpAddr: '',
        Dept: ''
      }
    },
    onEditSubmit() {
      const param = Object.assign({}, this.editForm)
      console.log(param, 'onEditSubmit')

      modify(param).then(res => {
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
