<template>
  <div>
    <el-dialog
      :title="`${showTitle}部门[${currentNode.name}]`"
      :visible="isShowAddDept"
      width="width"

      @close="close"
    >
      <el-form ref="fromRef" label-width="120px" :rules="rules" :model="formData">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">

          <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {

  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // 自定义校验规则
    const checkName = async(rule, value) => {
      // 获取数据
      const { depts } = await getDepartments()
      let currentChilder = null
      if (this.formData.id) {
        // 当前兄弟节点 && 不包括自己
        currentChilder = depts.filter(item => {
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        currentChilder = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }

      const isReprt = currentChilder.some(item => item.name === value)
      if (isReprt) {
        return Promise.reject('部门名称重复了')
      }
    }
    const checkCode = async(rule, value) => {
      const { depts } = await getDepartments()
      let isReprt = null
      if (this.formData.id) {
        isReprt = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        isReprt = depts.some(item => item.code === value)
      }
      // 如果重复 return reject状态的promise ，表示表单校验失败
      if (isReprt) {
        return Promise.reject('部门编码重复了')
      }
    }
    return {
      options: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple()
    },
    async submit() {
      await this.$refs.fromRef.validate()
      if (this.formData.id) {
        await updateDepartments(this.formData)
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id
        })
      }
      await addDepartments({
        ...this.formData,
        pid: this.currentNode.id
      })
      this.$message.success('添加成功！')
      this.$emit('getDepartments')
      this.close()
    },
    close() {
      this.$emit('update:isShowAddDept', false)
      this.$refs.fromRef.resetFields()
    },
    async  getDepartDetail(id) {
      console.log(111)
      this.formData = await getDepartDetail(id)
    }

  }

}
</script>

<style>

</style>
