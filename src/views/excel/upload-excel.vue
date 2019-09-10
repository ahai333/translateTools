<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-form v-model="form">
      <el-row>
        <el-col :span="3">
          <el-form-item label="翻译引擎">
            <el-select v-model="form.engine" filterable placeholder="请选择翻译引擎">
              <el-option v-for="item in engineOption" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="源语言">
            <el-select v-model="form.from" filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in codeOption"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="目标语言">
            <el-select v-model="form.to" filterable placeholder="请选择">
              <el-option
                v-for="(item,index) in codeOption"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="small" @click="translate">开始翻译</el-button>
          <el-button type="small" @click="onQuality">开始比较</el-button>
        </el-col>
      </el-row>
      <el-progress :text-inside="true" :stroke-width="24" :percentage="percent" status="success" />
    </el-form>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <!-- <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" /> -->
      <template v-for="(value, key, index) in labels" v-once>
        <el-table-column
          v-if="value.show"
          :key="index"
          :prop="value.prop"
          :label="value.label"
          :width="value.width"
          sortable
        />
      </template>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { trans, quality } from '@/api/translate.js'

const code_name = require('@/assets/lang.json').code_name
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      form: {
        engine: 'google',
        from: 'en',
        to: 'zh-CN'
      },
      engineOption: ['google', 'baidu', 'youdao'],
      codeOption: [],
      percent: 0,
      labels: [
        {
          prop: 'source', // 数据库中的编号
          label: '源语言',
          width: 400,
          show: true
        },
        {
          prop: 'target',
          label: '目标语言',
          width: 400,
          show: true
        },
        {
          prop: 'translate',
          label: '机器翻译',
          width: 400,
          show: true
        },
        {
          prop: 'quality',
          label: '匹配率(%)',
          width: 120,
          show: true
        }
      ]
    }
  },
  created() {
    this.codeOption = code_name
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      // this.tableHeader = header
      for (const index in header) {
        if (header[index] !== this.labels[index].prop) {
          this.$message({
            message: '上传文件格式错误',
            type: 'warning'
          })
          return
        }
      }
      // for (const index in results) {
      //   let tmp = { source: '', target: '', translate: '', quality: 0 }
      //   if (typeof results[index].source !== 'undefined') {
      //     tmp.source = results[index].source
      //   }
      //   if (typeof results[index].target !== 'undefined') {
      //     tmp.target = results[index].target
      //   }
      //   if (typeof results[index].translate !== 'undefined') {
      //     tmp.translate = results[index].translate
      //   }
      //   if (typeof results[index].quality !== 'undefined') {
      //     tmp.quality = results[index].quality
      //   }
      //   this.tableData.push(tmp)
      // }
      this.tableData = results
      console.log(this.tableData, 'tableData')
    },
    async translate() {
      const count = this.tableData.length
      this.percent = 0
      const param = {
        engine: this.form.engine,
        data: 'this is a test',
        from: this.form.from,
        to: this.form.to
      }
      for (let i = 0; i < count; i++) {
        param.data = this.tableData[i].source
        // console.log(param, 'param')

        const res = await trans(param)
        // console.log(res, 'trans')
        this.percent = +(((i + 1) * 100) / count).toFixed(3)

        let target = ''
        res.data.text.forEach(ret => {
          target += ret + ' '

          // console.log(res, target, this.tableData[i], 'trans')
          this.tableData[i].translate = target
        })
      }
    },
    async onQuality() {
      const param = {
        engine: this.form.engine,
        source: 'this is a test. this is a test.',
        target: '这是一个测试。这是两个测试。',
        from: this.form.from,
        to: this.form.to
      }
      const count = this.tableData.length

      for (let i = 0; i < count; i++) {
        param.source = this.tableData[i].source
        param.target = this.tableData[i].target
        this.tableData[i].translate = ''
        this.tableData[i].quality = 0
        const res = await quality(param)
        // console.log(res, 'onQuality')
        this.percent = +(((i + 1) / count) * 100).toFixed(2)
        console.log(i + 1, count, typeof this.percent, this.percent, 'percent')

        this.tableData[i].translate = res.data.text
        this.tableData[i].quality = res.data.quality
      }
      this.$forceUpdate()
    }
  }
}
</script>
