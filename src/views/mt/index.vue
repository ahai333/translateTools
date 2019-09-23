<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-form v-model="form" style="margin:10px">
      <el-row>
        <el-col :span="5">
          <el-form-item :label="$t('transView.engine')">
            <el-select
              v-model="form.engine"
              filterable
              :placeholder="$t('transView.selectPlaceholder')"
            >
              <el-option v-for="item in engineOption" :key="item" :label="item" :value="item" />
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
            @click="onTranslate"
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
            href="/files/trans.xlsx"
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
import { mt, startLog, endLog } from '@/api/mt.js'
import XLSX from 'xlsx'
import { getToken } from '@/utils/auth'

import lang from '@/utils/lang'
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
        to: 'zh-CN',
        types: ''
      },
      engineOption: ['google', 'google(com)', 'baidu', 'youdao'],
      codeOption: [],
      percent: 0,
      listLoading: false,
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
          width: 600,
          show: true
        },
        {
          prop: 'translate',
          label: this.$t('transView.machineTranslate'),
          width: 600,
          show: true
        }
      ]
    }
  },
  computed: {},
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
    handleSuccess({ results, header }) {
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
          index: index + start,
          source: '',
          translate: ''
        }

        if (typeof results[index].source !== 'undefined') {
          tmp.source = results[index].source
        }
        if (typeof results[index].translate !== 'undefined') {
          tmp.translate = results[index].translate
        }
        this.tableData.push(tmp)
      }
      // console.log(this.tableData, 'tableData')
    },
    async onTranslate() {
      const retlog = await startLog({ username: this.username })

      const count = this.tableData.length
      this.percent = 0
      const param = {
        engine: this.form.engine,
        source: '',
        from: this.form.from,
        to: this.form.to,
        opt_id: retlog.data.opt_id
      }
      for (let i = 0; i < count; i++) {
        param.source = this.tableData[i].source
        // console.log(param, 'param')

        const res = await mt(param)
        // console.log(res, 'trans')
        this.percent = +(((i + 1) * 100) / count).toFixed(3)

        this.tableData[i].translate = res.data.text

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
            content: 'total items: ' + count,
            remarks: ''
          }
          const ret = await endLog(logparam)
          this.$message({
            message: ret.msg,
            type: 'success'
          })
        }
      }
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
