<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="close">
    <!-- 表单 -->
    <el-form ref="fromRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-cascader
          v-model="formData.departmentName"
          style="width: 50%;"
          :options="treeData"
          :props="{ checkStrictly: true, label: 'name', value: 'name', emitPath: false }"
          clearable
          placeholder="请选择部门数据"
          @focus="getDepartments"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'// 获取接口
import { addEmployee } from '@/api/employees'
import { transListToTree } from '@/utils'// 获取处理数据的树形结构

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      treeData: [], // 定义数组接收树形数据
      formData: {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }

    }
  },
  methods: {
    close() {
      this.$emit('update:showDialog', false)
      this.$refs.fromRef.resetFields()
      this.formData = {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
    },
    // 下拉框获取到焦点的时候再去调用
    async getDepartments() {
      // if (this.treeData.length) return // 如果当前的树形数据已经有的的情况下就不需要再获取数据
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      this.treeData = transListToTree(depts, '')
    //   console.log('2312', this.treeData)
    },
    async  btnOk() {
      await this.$refs.fromRef.validate()
      await addEmployee(this.formData)
      this.$message.success('新增成功')
      this.close()
      // 获取父元素的实例，直接调用父元素的方法
      this.$parent.getEmployeeList()
    }

  }
}
</script>

<style>

</style>
