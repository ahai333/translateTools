<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-form v-model="form" style="margin-top:20px">
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
        <el-col :span="4">
          <el-button
            type="primary"
            plain
            :disabled="tableData.length===0"
            @click="onQuality"
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
        <el-col :span="4">
          <el-link
            href="/files/test.xlsx"
            target="_blank"
            type="primary"
            icon="el-icon-view"
          >{{ $t('transView.downloadModelFile') }}</el-link>
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
import { quality } from '@/api/translate.js'
import XLSX from 'xlsx'
import lang from './lang'

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
        },
        {
          prop: 'translate',
          label: this.$t('transView.machineTranslate'),
          width: 400,
          show: true
        },
        {
          prop: 'quality',
          label: this.$t('transView.similarity'),
          width: 120,
          show: true
        }
      ]
    }
  },
  created() {
    this.codeOption = lang.code_name
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
          index: index + start,
          source: '',
          target: '',
          translate: '',
          quality: 0
        }
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
    async onQuality() {
      const param = {
        engine: this.form.engine,
        source: 'this is a test.',
        target: '这是一个测试。',
        from: this.form.from,
        to: this.form.to
      }
      const count = this.tableData.length
      this.percent = 0
      for (let i = 0; i < count; i++) {
        param.source = this.tableData[i].source
        param.target = this.tableData[i].target
        this.tableData[i].translate = ''
        this.tableData[i].quality = 0
        const res = await quality(param)

        this.tableData[i].translate = res.data.text
        this.tableData[i].quality = res.data.quality

        this.percent = +(((i + 1) / count) * 100).toFixed(2)
        // console.log(i + 1, count, typeof this.percent, this.percent, 'percent')
        //  this.listLoading = i + 1 === count ? false : true
        if (i + 1 === count) {
          this.$forceUpdate()
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
