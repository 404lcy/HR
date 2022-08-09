<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="fromRef" :model="formData" label-width="120px" style="margin-left: 120px; margin-top:30px" :rules="rules">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="formData.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="formData.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updataUserInfor">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="UserInfo" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">

            <component :is="jobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { saveUserDetailById } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
import UserInfo from './user-info.vue'
import jobInfo from './job-info.vue'

export default {

  data() {
    return {
      jobInfo: jobInfo,
      UserInfo: UserInfo,
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.formData = await getUserDetailById(this.$route.params.id)
    },
    async updataUserInfor() {
      try {
        await this.$refs.fromRef.validate()
        await saveUserDetailById({ ...this.formData, password: this.formData.password2

        })
        this.$message.success('保存成功')
      } catch (e) {
        this.$message.error('更新失败！')
      }
    }
  }
}

</script>

<style>

</style>
