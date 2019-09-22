<template>
  <div class="dndList">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form v-if="queriable" :inline="true" :model="filters">
        <el-form-item :label="$t('components.selectPlaceholder')">
          <el-select v-model="filters.name" :placeholder="$t('components.selectPlaceholder')">
            <template v-for="(value, key, index) in labels">
              <el-option v-if="value.show" :key="index" :label="value.label" :value="value.prop" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.value" placeholder />
        </el-form-item>
        <el-form-item>
          <el-button plain type="primary" @click="handleQuery(filters)">{{ $t('components.query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            plain
            type="primary"
            @click="handleDownload(labels, records)"
          >{{ $t('components.exportExcel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table stripe :data="currecords" style="width: 100%;" @selection-change="selsChange">
      <el-table-column type="index" width="50" />
      <template v-for="(value, key, index) in labels">
        <el-table-column
          v-if="value.show"
          :key="index"
          :prop="value.prop"
          :label="value.label"
          :width="value.width"
          sortable
        />
      </template>
      <el-table-column :label="$t('components.operate')" width="150">
        <template slot-scope="scope">
          <el-button
            plain
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >{{ $t('components.query') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pagesize"
        :page-sizes="[10, 20, 50, 100, 200]"
        :total="total"
        style="float:right;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-col>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  name: 'DynamicTable',
  props: {
    // 表项，格式见说明
    labels: {
      type: Array,
      default() {
        return []
      }
    },
    // 表格记录
    records: {
      type: Array,
      default() {
        return []
      }
    },
    // 编辑函数
    handleEdit: {
      type: Function,
      default() {
        return function(index, row) {}
      }
    },
    // 查询，参数为查询值
    handleQuery: {
      type: Function,
      default() {
        return function(filters) {}
      }
    },
    queriable: {
      type: Boolean,
      default() {
        return true
      }
    } // 是否可查询，导出
  },
  data() {
    return {
      currecords: [],
      curindex: 0,
      total: 0,
      page: 1,
      pagesize: 10,
      listLoading: false,
      sels: [], // 列表选中列,
      filters: {
        name: '',
        value: ''
      }
    }
  },
  watch: {
    records() {
      this.getcurRecords()
      //  console.log(this.currecords, 'watch')
    },
    immediate: true
  },
  created() {
    this.getcurRecords()
  },
  methods: {
    getcurRecords() {
      this.total = this.records.length
      this.currecords = []
      const startpos = (this.page - 1) * this.pagesize

      let endpos = this.pagesize + startpos
      if (endpos > this.total) {
        endpos = this.total - startpos
      }
      for (let i = startpos; i < endpos; i++) {
        this.currecords.push(this.records[i])
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getcurRecords()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getcurRecords()
    },
    selsChange(sels) {
      this.sels = sels
      //  console.log(sels, 'sels')
    },
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
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

<style lang="scss" scoped>
</style>
