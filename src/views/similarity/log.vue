<template>
  <div>
    <ah-table
      :labels="labels"
      :records="values"
      :handle-edit="onEdit"
      :queriable="false"
      style="margin:10px"
    />
  </div>
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
      detailVisible: false,
      labels: [
        {
          prop: 'uuid', // 数据库中的编号
          label: 'uuid',
          width: 100,
          show: false
        },
        {
          prop: 'user_id',
          label: 'userid',
          width: 200,
          show: false
        },
        {
          prop: 'operate',
          label: this.$t('logView.operate'),
          width: 200,
          show: true
        },
        {
          prop: 'detail',
          label: 'detail',
          width: 200,
          show: false
        },
        {
          prop: 'engine',
          label: this.$t('logView.engine'),
          width: 150,
          show: true
        },
        {
          prop: 'starttime',
          label: this.$t('logView.starttime'),
          width: 200,
          show: true
        },
        {
          prop: 'endtime',
          label: this.$t('logView.endtime'),
          width: 250,
          show: true
        },
        {
          prop: 'content',
          label: this.$t('logView.content'),
          width: 250,
          show: true
        },
        {
          prop: 'remarks',
          label: this.$t('logView.remarks'),
          width: 350,
          show: true
        }
      ]
    }
  },
  created() {
    this.username = getToken()
    this.getList()
  },
  methods: {
    getList() {
      optLog({ username: this.username }).then(res => {
        this.values = res.data
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    getDetail(opt_id) {
      const param = {
        opt_id: opt_id
      }
      detailLog(param).then(res => {
        this.detailValue = res.data
        this.$message({
          message: res.msg,
          type: 'success'
        })
      })
    },
    onEdit(index, row) {
      console.log(row, 'onEdit')
      this.$router.push({
        path: '/similarity/detail',
        name: 'similarity-detail',
        params: { opt_id: row.uuid }
      })
    }
  }
}
</script>

<style>
</style>
