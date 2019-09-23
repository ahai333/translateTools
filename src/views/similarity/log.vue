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
      // 	uuid	user_id	lang_from	lang_to	types	engine	avg	starttime	endtime	content	remarks
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
          prop: 'lang_from',
          label: this.$t('similarity.lang_from'),
          width: 150,
          show: true
        },
        {
          prop: 'lang_to',
          label: this.$t('similarity.lang_to'),
          width: 150,
          show: true
        },
        {
          prop: 'types',
          label: this.$t('similarity.types'),
          width: 200,
          show: true
        },
        {
          prop: 'avg',
          label: this.$t('similarity.avg'),
          width: 150,
          show: true
        },
        {
          prop: 'engine',
          label: this.$t('logView.engine'),
          width: 150,
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
        }
      ]
    }
  },
  created() {
    this.username = getToken()
    this.user_id = getToken('user_id')
    this.getList()
  },
  methods: {
    getList() {
      optLog({ user_id: this.user_id, tablename: 'similarity_log' }).then(
        res => {
          this.values = res.data
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }
      )
    },
    getDetail(opt_id) {
      const param = {
        opt_id: opt_id,
        tablename: 'similarity_detail'
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
