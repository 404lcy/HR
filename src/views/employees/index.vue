<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #before>
          <span>共50条记录</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/')">导入</el-button>
          <el-button size="mini" type="danger" @click="exportToExecel">导出</el-button>
          <el-button size="mini" type="warning" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像">
            <template v-slot="{row}">
              <el-row type="flex" justify="center">
                <el-avatar
                  style="width:80px; height:80px"
                  :src="row.staffPhoto"
                  @click.native="showQrCode(row.staffPhoto)"
                >
                  <img src="@/assets/common/bigUserHeader.png" alt="">
                </el-avatar>
              </el-row>
            </template>m
          </el-table-column>

          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column :formatter="formatter" label="聘用形式" sortable="" prop="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="chackDialogVisible(row.id)">角色</el-button>
              <el-button type="text" size="small" :disabled="checkPermission('DELETE_USER')" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>

    </div>
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog" @close="imgUrl=''">
      <el-row type="flex" justify="center">
        <canvas ref="canvas" />
      </el-row>
    </el-dialog>
    <assign-role ref="assignRole" :dialog-visible.sync="dialogVisible" :current-id="currentId" />
  </div>
</template>

<script>
import { mixins } from '@/utils/mixins'
import qrcode from 'qrcode'
import { formatterData } from '@/filters/index'
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'

export default {
  name: 'Toolber',
  components: { addEmployee, AssignRole },
  mixins: [mixins],

  data() {
    return {
      currentId: null,
      dialogVisible: false,
      showCodeDialog: false,
      showDialog: false,
      list: [],
      total: 0,
      page: {
        page: 1,
        size: 10

      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    chackDialogVisible(id) {
      console.log(id)
      this.currentId = id
      this.$refs.assignRole.getUserDetailById(id)

      this.dialogVisible = true
    },
    showQrCode(url) {
      this.showCodeDialog = true
      this.$nextTick(() => {
        qrcode.toCanvas(this.$refs.canvas, url)
      })
    },
    async exportToExecel() {
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      const resData = this.formatterData(rows, headers)
      console.log(resData)
      const { export_json_to_excel } = await import(
        /* webpackChunkName:'liucongyuan'*/
        '@/utils/Export2Excel')
      const tHeader = ['ID', '标题', '作者', '阅读', '时间']

      export_json_to_excel({
        header: tHeader, // 表头 必填
        data: [[1, '哈哈', 'lala', 123, '2020 - 1 - 1'], [1, '哈哈', 'lala', 123, '2020 - 1 - 1'], [1, '哈哈', 'lala', 123, '2020 - 1 - 1']], // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    formatterData(rows, headers) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatterData(item[headers[key]])
          }
          if (headers[key] === 'fromOfEmployment') {
            return EmployeeEnum.hireType.find(child => +child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.total = total
      this.list = rows
      this.loading = false
    },
    // 用来格式化内容 表格自带的方法formatter
    formatter(row, column, cellValue) {
      /* EmployeeEnum.hireType对应文件的内容 */
      const currentData = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    },
    async del(id) {
      try {
        await this.$confirm('是否删除？')
        await delEmployee(id)
        this.$message.success('删除成功！')
        await this.getEmployeeList()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
