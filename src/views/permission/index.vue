<template>

  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- <Toolber>
        <template v-solt:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </Toolber> -->
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(row.id,2 )">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="close">
      <!-- 表单 -->
      <el-form ref="perFrom" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!--   当值为1(active-value)时，激活节点，当值为(inactive-value)0时，不激活 */
          /* v-model绑定的为当前switch对应的值 -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>

</template>

<script>
import { getPermissionList, addPermission, delPermission, updatePermission, getPermissionDetail } from '@/api/permisson'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      // 需要展示的数据
      list: [],
      // formData数据和rules数据
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      // 新增或者编辑弹框的校验规则，
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      // 是否展示新增或者编辑弹框
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 点击添加
    async btnOK() {
      await this.$refs.perFrom.validate()
      try {
        if (this.formData.id) {
          // 编辑
          await updatePermission(this.formData)
        } else {
          await addPermission(this.formData)
        }
        this.$message.success(`${this.showText}权限成功！`)
        this.close()
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
        this.$message.error('修改失败！')
      }
    },
    close() {
      this.$refs.perFrom.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
    },
    // 点击权限弹出弹层
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    // 获取数据
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = transListToTree(res, '0')
    },
    // 删除对应的元素
    async  delPermission(id) {
      await this.$confirm('确认删除吗？')
      await delPermission(id)
      this.$message.success('删除成功！')
      await this.getPermissionList()
    },
    // 点击编辑
    async  editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }

}
</script>

<style>

</style>
