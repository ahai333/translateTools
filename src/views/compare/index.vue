<template>
  <div style="margin:10px">
    <el-form v-model="form">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item :label="$t('compareView.firstData')">
            <el-input
              v-model="form.oldStr"
              type="textarea"
              :autosize="{minRows: 2, maxRows: 15}"
              :placeholder="$t('compareView.inputData')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compareView.secondData')">
            <el-input
              v-model="form.newStr"
              type="textarea"
              :autosize="{minRows: 2, maxRows: 15}"
              :placeholder="$t('compareView.inputData')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('compareView.displayStyle')">
            <el-switch v-model="fotmat" active-text="line-by-line" inactive-text="side-by-side" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <code-diff
      :old-string="form.oldStr"
      :new-string="form.newStr"
      :context="context"
      :output-format="outputFormat"
    />
  </div>
</template>

<script>
import codeDiff from 'vue-code-diff'
export default {
  name: 'CompareView',
  components: {
    codeDiff
  },
  data() {
    return {
      form: {
        oldStr: '',
        newStr: ''
      },
      fotmat: false,
      context: 5
    }
  },
  computed: {
    outputFormat() {
      return this.fotmat ? 'line-by-line' : 'side-by-side'
    }
  }
}
</script>
