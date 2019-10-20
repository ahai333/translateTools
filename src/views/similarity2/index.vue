<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-form v-model="form" style="margin-top:20px" label-width="100px">
      <el-row>
        <el-col :span="5">
          <el-form-item :label="$t('transView.engine')">
            <el-select
              v-model="form.engines"
              filterable
              multiple
              :placeholder="$t('transView.selectPlaceholder')"
            >
              <el-option
                v-for="item in engineOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('transView.source')">
            <el-select
              v-model="form.from"
              filterable
              :placeholder="$t('transView.selectPlaceholder')"
            >
              <el-option
                v-for="(item,index) in codeOption"
                :key="index"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="$t('transView.target')">
            <el-select
              v-model="form.to"
              filterable
              :placeholder="$t('transView.selectPlaceholder')"
            >
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
          <el-button
            type="primary"
            plain
            :disabled="tableData.length===0"
            @click="onSimilarity"
          >{{ $t('transView.beginTranslate') }}</el-button>
          <el-button
            type="primary"
            plain
            :disabled="tableData.length===0"
            @click="handleDownload(labels, tableData)"
          >{{ $t('transView.exportExcel') }}</el-button>
          <el-button
            type="primary"
            plain
            :disabled="tableData.length===0"
            @click="onClear"
          >{{ $t('transView.clear') }}</el-button>
        </el-col>
        <el-col :span="2">
          <el-link
            href="/files/test.xlsx"
            target="_blank"
            type="primary"
            icon="el-icon-view"
          >{{ $t('transView.downloadModelFile') }}</el-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item :label="$t('transView.types')">
            <el-input v-model="form.types" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-progress
      :text-inside="true"
      :stroke-width="24"
      :percentage="percent"
      status="success"
      style="margin-top:10px"
    />
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      show-summary
      highlight-current-row
      style="width: 100%;margin-top:20px;"
      stripe
    >
      <!-- <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" /> -->
      <template v-for="(value, key, index) in labels">
        <el-table-column
          v-if="value.show"
          :key="index"
          :prop="value.prop"
          :label="value.label"
          :width="value.width"
        />
      </template>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { similarity2, startLog, endLog } from '@/api/similarity.js'
import XLSX from 'xlsx'
import lang from '@/utils/lang'
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      form: {
        engines: ['google', 'google(com)', 'baidu', 'youdao'],
        from: 'zh-CN',
        to: 'pt',
        types: ''
      },
      engineOption: [
        { label: '谷歌翻译(中国)', value: 'google' },
        { label: '谷歌翻译(海外)', value: 'google(com)' },
        { label: '百度', value: 'baidu' },
        { label: '有道', value: 'youdao' }
      ],
      codeOption: [],
      percent: 0,
      listLoading: false,
      username: '',
      label: [
        {
          prop: 'index',
          label: this.$t('transView.index'),
          width: 80,
          show: true
        },
        {
          prop: 'source',
          label: this.$t('transView.source'),
          width: 400,
          show: true
        },
        {
          prop: 'target',
          label: this.$t('transView.target'),
          width: 400,
          show: true
        }
      ],
      labels: [
        {
          prop: 'index',
          label: this.$t('transView.index'),
          width: 80,
          show: true
        },
        {
          prop: 'source',
          label: this.$t('transView.source'),
          width: 400,
          show: true
        },
        {
          prop: 'target',
          label: this.$t('transView.target'),
          width: 400,
          show: true
        }
      ]
    }
  },
  created() {
    this.codeOption = lang.code_name
    this.username = getToken()
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: this.$t('transView.errorSize'),
        type: 'warning'
      })
      return false
    },
    onClear() {
      this.tableData = []
    },
    // 根据引擎动态改变表格项
    setTableLable(res) {
      // for (let i = 0; i < this.tableData.length; i++) {
      //   for (let j = 1; j < res.length; j++) {
      //     this.tableData[i]['trans' + j] = ''
      //     this.tableData[i]['lcs' + j] = 0
      //     this.tableData[i]['ld' + j] = 0
      //     this.tableData[i]['sh' + j] = 0
      //   }
      // }

      const lb = [...this.label]
      let i = 1
      for (const option of res) {
        lb.push({
          prop: 'trans' + i,
          label: option,
          width: 400,
          show: true
        })
        lb.push({
          prop: 'lcs' + i,
          label: 'lcs',
          width: 100,
          show: true
        })
        lb.push({
          prop: 'ld' + i,
          label: 'ld',
          width: 100,
          show: true
        })
        lb.push({
          prop: 'sh' + i,
          label: 'simhash',
          width: 100,
          show: true
        })
        i++
      }
      this.labels = lb
    },
    handleSuccess({ results, header }) {
      // 判断格式
      // this.tableHeader = header
      // for (const index in header) {
      //   if (header[index] !== this.labels[index].prop) {
      //     this.$message({
      //       message: this.$t('transView.errorFile'),
      //       type: 'warning'
      //     })
      //     return
      //   }
      // }
      // 要提前初始化字段，否则在刷新时不能实时显示更新内容，（因为初始时没有相应字段，没有正确数据绑定？）

      const len = results.length
      const start = this.tableData.length
      for (let index = 0; index < len; index++) {
        // for (const index in results) {
        const tmp = {
          index: index + start + 1,
          source: '',
          target: '',
          trans1: '',
          lcs1: '',
          ld1: '',
          sh1: '',
          trans2: '',
          lcs2: '',
          ld2: '',
          sh2: '',
          trans3: '',
          lcs3: '',
          ld3: '',
          sh3: '',
          trans4: '',
          lcs4: '',
          ld4: '',
          sh4: ''
        }
        if (typeof results[index].source !== 'undefined') {
          tmp.source = results[index].source
        }
        if (typeof results[index].target !== 'undefined') {
          tmp.target = results[index].target
        }
        this.tableData.push(tmp)
      }
    },
    async onSimilarity() {
      this.setTableLable(this.form.engines)

      const retlog = await startLog({ username: this.username })

      const param = {
        engines: JSON.stringify(this.form.engines),
        source: 'this is a test.',
        target: '这是一个测试。',
        from: this.form.from,
        to: this.form.to,
        opt_id: retlog.data.opt_id
      }
      const count = this.tableData.length
      this.percent = 0

      let avg = 0.0

      for (let i = 0; i < count; i++) {
        this.tableData[i].translate = ''

        param.source = this.tableData[i].source
        param.target = this.tableData[i].target
        this.tableData[i].translate = ''
        // console.log(param, 'onSimilarity')

        let res = await similarity2(param)
        // console.log(res, 'similarity2')

        this.tableData[i] = Object.assign(this.tableData[i], res.data)

        this.percent = +(((i + 1) / count) * 100).toFixed(2)
        avg += res.data['lcs1']
        // console.log(i + 1, count, typeof this.percent, this.percent, 'percent')
        //  this.listLoading = i + 1 === count ? false : true
        if (i + 1 === count) {
          this.$forceUpdate()
          // 日志结束
          const logparam = {
            uuid: retlog.data.opt_id,
            endtime: new Date().toLocaleDateString(),
            lang_from: this.form.from,
            lang_to: this.form.to,
            engine: this.form.engine,
            types: this.form.types,
            avg: +(avg / count).toFixed(2),
            content: 'total items: ' + count,
            remarks: ''
          }
          res = await endLog(logparam)
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }
      }
      // this.$forceUpdate()
    }, // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || 'sheet1'
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      }
      workbook.Sheets[sheetName] = sheet
      // 生成excel的配置项
      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      }
      var wbout = XLSX.write(workbook, wopts)
      var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      }
      return blob
    },
    /**
     * 通用的打开下载对话框方法，没有测试过具体兼容性
     * @param url 下载地址，也可以是一个blob对象，必选
     * @param saveName 保存文件名，可选
     */
    openDownloadDialog(url, saveName) {
      if (typeof url === 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url) // 创建blob地址
      }
      var aLink = document.createElement('a')
      aLink.href = url
      aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event
      if (window.MouseEvent) event = new MouseEvent('click')
      else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        )
      }
      aLink.dispatchEvent(event)
    },
    handleDownload(labels, record) {
      // this.downloadLoading = true
      const header = []
      const filterVal = []
      labels.forEach(label => {
        header.push(label.label)
        filterVal.push(label.prop)
      })

      const data = this.formatJson(filterVal, record)
      const data1 = [...data]
      data1.unshift(header)

      var sheet = XLSX.utils.aoa_to_sheet(data1)
      //       console.log(data1);
      const date = new Date()

      const fn =
        'result' +
        date.getFullYear() +
        (date.getMonth() + 1) +
        date.getDate() +
        '.xlsx'
      this.openDownloadDialog(this.sheet2blob(sheet), fn)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>
