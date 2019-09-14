<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-form v-model="form" style="margin:10px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="翻译引擎">
            <el-select v-model="form.engine" filterable placeholder="请选择翻译引擎">
              <el-option v-for="item in engineOption" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
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
        <el-col :span="5">
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
        <el-col :span="4">
          <el-button type="primary" plain @click="onTranslate">开始翻译</el-button>
          <el-button type="primary" plain @click="handleDownload(labels, tableData)">导出到excel</el-button>
        </el-col>
        <el-col :span="4">
          <el-link href="/files/trans.xlsx" target="_blank" type="primary" icon="el-icon-view">翻译模板文件下载</el-link>
        </el-col>
      </el-row>
      <el-progress :text-inside="true" :stroke-width="24" :percentage="percent" status="success" />
    </el-form>
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
import { trans } from '@/api/translate.js'
import XLSX from 'xlsx'

const code_name = require('../../../public/files/lang.json').code_name
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
      engineOption: ['google', 'google(com)', 'baidu', 'youdao'],
      codeOption: [],
      percent: 0,
      listLoading: false,
      labels: [
        {
          prop: 'source', // 数据库中的编号
          label: '源语言',
          width: 600,
          show: true
        },
        {
          prop: 'translate',
          label: '机器翻译',
          width: 600,
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
      // 要提前初始化字段，否则在刷新时不能实时显示更新内容，（因为初始时没有相应字段，没有正确数据绑定？）
      for (const index in results) {
        const tmp = { source: '', target: '', translate: '', quality: 0 }
        if (typeof results[index].source !== 'undefined') {
          tmp.source = results[index].source
        }
        if (typeof results[index].target !== 'undefined') {
          tmp.target = results[index].target
        }
        if (typeof results[index].translate !== 'undefined') {
          tmp.translate = results[index].translate
        }
        if (typeof results[index].quality !== 'undefined') {
          tmp.quality = results[index].quality
        }
        this.tableData.push(tmp)
      }
      // console.log(this.tableData, 'tableData')
    },
    async onTranslate() {
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

        this.tableData[i].translate = res.data.text
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
        '导出结果' +
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
