<template>
  <ah-table :labels="labels" :records="values" :handle-edit="onEdit" style="margin:10px" />
</template>

<script>
// 操作日志
import AhTable from './components/AhTable.vue'
import { optLog, detailLog } from '@/api/log.js'
import { getToken } from '@/utils/auth' // get token from cookie
export default {
  components: { AhTable },
  data() {
    return {
      username: '',
      values: [],
      labels: [
        {
          prop: 'uuid', // 数据库中的编号
          label: '编号',
          width: 100,
          show: false
        },
        {
          prop: 'user_id',
          label: '用户名',
          width: 200,
          show: false
        },
        {
          prop: 'operate',
          label: '操作',
          width: 250,
          show: true
        },
        {
          prop: 'detail',
          label: '细节',
          width: 200,
          show: false
        },
        {
          prop: 'starttime',
          label: '开始时间',
          width: 200,
          show: true
        },
        {
          prop: 'endtime',
          label: '结束时间',
          width: 250,
          show: true
        },
        {
          prop: 'content',
          label: '内容',
          width: 250,
          show: true
        },
        {
          prop: 'remarks',
          label: '备注',
          width: 350,
          show: true
        }
      ]
    }
  },
  created() {
    this.username = getToken()
    this.getInfo()
  },
  methods: {
    getInfo() {
      optLog({ username: this.username }).then(res => {
        this.values = res.data
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    getDetail() {
      detailLog().then(res => {
        this.values = res.data
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    onEdit(index, row) {
      console.log(row, 'onEdit')
    }
  }
}
</script>

<style>
</style>
