<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <el-upload
        class="avatar-uploader"
        action="http://127.0.0.1:7001/upload/upimage"
        :show-file-list="false"
        :on-success="handleLicenseSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <el-image v-if="user.avatar" :src="user.avatar" class="thumbnail" />
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateProfile } from '@/api/'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: ''
        }
      }
    }
  },
  methods: {
    submit() {
      const param = Object.assign({}, this.user)
      updateProfile(param).then(res => {
        this.$message({
          message: 'User information has been updated successfully',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    handleLicenseSuccess(res, file) {
      this.user.avatar = res.data
      console.log(this.user.avatar, 'handleLicenseSuccess')
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }
}
</script>
<style scoped>
.thumbnail {
  width: 50%;
  height: 50%;
}
</style>
