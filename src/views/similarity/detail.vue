<template>
  <div>
    <detail-table :labels="detailLable" :records="detailValue" style="margin:10px" />
  </div>
</template>

<script>
// 操作日志
import DetailTable from './components/DetailTable'
import { detailLog } from '@/api/log.js'
export default {
  components: { DetailTable },
  data() {
    return {
      detailLable: [
        {
          prop: 'uuid', // 数据库中的编号
          label: 'uuid',
          width: 100,
          show: false
        },
        {
          prop: 'opt_id',
          label: 'optid',
          width: 100,
          show: false
        },
        {
          prop: 'source',
          label: this.$t('logView.source'),
          width: 400,
          show: true
        },
        {
          prop: 'target',
          label: this.$t('logView.target'),
          width: 400,
          show: true
        },
        {
          prop: 'mt',
          label: this.$t('logView.mt'),
          width: 400,
          show: true
        },
        {
          prop: 'similarity',
          label: this.$t('logView.similarity'),
          width: 150,
          show: true
        },
        {
          prop: 'remarks',
          label: this.$t('logView.remarks'),
          width: 150,
          show: true
        }
      ],
      detailValue: []
    }
  },
  mounted() {
    // 获取参数
    this.opt_id = this.$route.params.opt_id
    if (this.opt_id !== '' || typeof this.opt_id !== 'undefined') {
      this.getDetail(this.opt_id)
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>
</style>
