<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <TreeTool :data-tool="company" :is-root="true" @ishanderAddDepl="ishanderAddDepl" />
      <el-tree :data="departs" :props="defaultProps" default-expand-all>
        <template v-slot="{ data }">
          <TreeTool :data-tool="data" :is-root="false" @getDepartments="getDepartments" @ishanderAddDepl="ishanderAddDepl" @editDepts="editDepts" />
        </template>
      </el-tree>
    </div>
    <AddDept ref="addDept" :is-show-add-dept.sync="isShowAddDept" :current-node="currentNode" />
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { transListToTree } from '@/utils/index'
import TreeTool from './components/tree-tool.vue'
import AddDept from './components/add-dept.vue'
export default {
  components: { TreeTool, AddDept },
  data() {
    return {
      loading: false,
      currentNode: {},
      isShowAddDept: false,
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      this.company = {
        name: res.companyName,
        manager: res.companyManage || '管理员',
        id: ''
      }
      console.log(res)
      this.departs = transListToTree(res.depts, '')
      this.loading = false
    },
    ishanderAddDepl(node) {
      this.isShowAddDept = true
      this.currentNode = node
    },
    editDepts(node) {
      // 首先打开弹层
      this.isShowAddDept = true
      this.currentNode = node // 赋值操作的节点
      // 使用refs 调用组件的方法和属性
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard-container {

  .app-container {
    margin: 100px auto;
    border: 1px solid pink;
    width: 950px;
  }
}
</style>
