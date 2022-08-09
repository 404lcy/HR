<template>
  <el-dialog
    title="编辑角色"
    :visible="dialogVisible"
    width="width"
    @close="close()"
  >

    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>

    </el-checkbox-group>

    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="btnOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { assignRoles } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
import { getRoleList } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      require: true,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: this.roleIds
        })
        this.$message.success('分配权限成功！')
        this.close()
      } catch (e) {
        this.$message.error('分配失败!')
        this.close()
      }
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    close() {
      this.roleIds = []
      this.$emit('update:dialogVisible', false)
    }
  }

}
</script>

<style>

</style>
