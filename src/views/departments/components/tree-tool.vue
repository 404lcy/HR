<template>

  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ dataTool.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ dataTool.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="clickItem">
            <!-- 内容 -->
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col></el-row>
</template>
<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    dataTool: {
      type: Object,
      default: () => {}
    },
    isRoot: {
      type: Boolean,
      default: false

    }
  },
  data() {
    return {}
  },
  methods: {
    async clickItem(type) {
      if (type === 'add') {
        this.$emit('ishanderAddDepl', this.dataTool)
        console.log('添加成功了')
      } else if (type === 'edit') {
        this.$emit('editDepts', this.dataTool)
        console.log('编辑l')
      } else {
        await this.$confirm('确定删除吗？')
        await delDepartments(this.dataTool.id)
        this.$message.success('删除成功！')
        this.$emit('getDepartments')
        console.log('删除')
      }
    }
  }
}
</script>
