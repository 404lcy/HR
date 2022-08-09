<template>
  <div><el-card style="margin:20px">
         <el-tabs v-model="activeName">
           <el-tab-pane label="用户管理" name="first">
             <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">新增角色</el-button>
             <el-table
               :data="list"
               style="width: 100%"
             >
               <el-table-column
                 prop="date"
                 label="序号"
                 width="180"
                 type="index"
               />
               <el-table-column
                 prop="name"
                 label="角色名称"
                 width="180"
               />
               <el-table-column
                 prop="description"
                 label="描述"
               />
               <el-table-column

                 label="操作"
               ><template v-slot="{row}">
                 <el-button type="success" size="small" @click="assignPerm(row.id)">分配权限</el-button>
                 <el-button type="primary" size="small" @click="etid(row.id)">编辑</el-button>
                 <el-button type="danger" size="small" @click="delIfor(row.id)">删除</el-button>

               </template></el-table-column>
               <!-- <el-row>
            <el-pagination
              style="margin-top:20px"
              background
              layout="prev, pager, next"
              :total="1000"
            />
          </el-row> -->
             </el-table>
             <el-row type="flex" justify="center" align="middle" style="height:60px">
               <el-pagination
                 :current-page="page.page"
                 :page-size="page.pagesize"
                 :total="page.total"
                 layout="prev, pager, next"
                 @current-change="changePage"
               />
             </el-row>
           </el-tab-pane>
           <el-tab-pane label="配置管理" name="second">
             <el-alert
               title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
               type="info"
               show-icon
               :closable="false"
             />
             <el-form label-width="120px" style="margin-top:50px">
               <el-form-item label="公司名称">
                 <el-input v-model="formData.name" disabled style="width:400px" />
               </el-form-item>
               <el-form-item label="公司地址">
                 <el-input v-model="formData.companyAddress" disabled style="width:400px" />
               </el-form-item>
               <el-form-item label="邮箱">
                 <el-input v-model="formData.mailbox" disabled style="width:400px" />
               </el-form-item>
               <el-form-item label="备注">
                 <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
               </el-form-item>
             </el-form></el-tab-pane>

         </el-tabs>

       </el-card>
    <el-dialog
      :title="`${roleFormData.id?'编辑':'新增'}角色`"
      :visible="dialogVisible"
      @close="close"
    >
      <el-form ref="formRef" :model="roleFormData" :rules="formRules" label-width="120px">
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleFormData.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible="showPermissionDialog"
      width="width"
      @close="closePerMission"
    >
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <div slot="footer">
        <el-button @click="closePerMission">取 消</el-button>
        <el-button type="primary" @click="btnOk2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: '', // 用来记录分配角色的id
      // 权限框的显示和隐藏
      showPermissionDialog: false,
      dialogVisible: false,
      activeName: 'first',
      list: [],
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0 // 记录总数
      },
      formData: [],
      roleFormData: {
        name: '',
        description: ''
      },
      formRules: {
        name: [{
          required: true,
          message: '名字不能为空'
        }],
        description: [{}]
      }

    }
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId)
    },
    async delIfor(id) {
      // 获取当前页面删除前的长度
      const len = this.list.length
      await this.$confirm('确认删除吗？')
      // 如果删除的页面等于还有一个，或者是最后一页
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }

      await deleteRole(id)
      this.$message.success('删除成功！')
      await this.getRoleList()
    },
    async etid(id) {
      this.dialogVisible = true
      this.roleFormData = await getRoleDetail(id)
    },
    // 点击关闭
    close() {
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    async btnOk() {
      this.$refs.formRef.validate()
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData)
      } else {
        await addRole(this.roleFormData)
      }
      this.$message.success('修改用户成功！')
      this.getRoleList()
      this.close()
    },
    // 点击分配权限
    async assignPerm(id) {
      console.log(id)
      this.permData = transListToTree(await getPermissionList(), '0') // 转化list到树形数据
      this.roleId = id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值

      this.showPermissionDialog = true
    },
    async btnOk2() {
      const checkedKeys = this.$refs.permTree.getCheckedKeys()
      await assignPerm({
        id: this.roleId,
        permIds: checkedKeys
      })
      this.$message.success('分配权限成功！')
      this.closePerMission()
    },
    closePerMission() {
      this.showPermissionDialog = false
      this.selectCheck = []
    }
  }

}
</script>

<style lang="less" scoped>

</style>

