<template>
    <div >
        <!-- 表格 -->
        <el-button style="margin-bottom:20px;"
                type="primary"
                icon="el-icon-plus"
                @click="add()">
            添加
        </el-button>
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :selected="false"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true">
              <!-- 操作 -->
              <el-table-column fixed="right"
                        label="操作"
                        >
                  <template slot-scope="scope">
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="deletes(scope.row)">
                        删除
                    </el-button>
                  </template>
              </el-table-column>
        </Table>
        <dialogCommonComponent ref="dialogCommonComponent" title="添加企业" width="500px">
            <div class="contractDetail">
                <protle-title-component>
                  <span>添加企业</span>
                </protle-title-component>
                <div class="baseInfo" style="padding: 10px 15px;">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" @submit.native.prevent>
                        <el-form-item
                                label="企业名称"
                                prop="orgName">
                            <el-input type="orgName"
                                      v-model.number="ruleForm.orgName"
                                      autocomplete="off"
                                      placeholder="请输入企业全称，Enter查询"
                                      @keyup.enter.native="handleEnter">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="企业角色" prop="orgRole">
                            <el-radio-group v-model="ruleForm.orgRole">
                                <el-radio label="CORE_MANAGER">核心企业</el-radio>
                                <el-radio label="SUPPLIER">供应商</el-radio>
                                <el-radio label="THIRD_PARTY_ENTERPRISE">第三方企业</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="text-align:center;margin-top:30px;">
                    <el-button size="small" @click="close()">
                        取 消
                    </el-button>
                    <el-button  size="small" type="primary" :loading="loading"
                            @click="handleDailogConfirm()">
                        确 定
                    </el-button>
                </div>
            </div>
        </dialogCommonComponent>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import protleTitleComponent from '@/components/protleTitleComponent';
import mixin from '@/assets/js/mixin';
import { mapGetters } from 'vuex'

export default {
  name: '',
  mixins:[mixin],
  data() {
    return {
      loading:false,
      workDate: '',
      // 表格数据
      mainTable: {
        tableHeader: {
            orgName: "企业名称",
            orgRole2: "企业角色",
            createTime: "创建时间"
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      assetsList: [],
      ruleForm:{},
      rules:{
        orgRole: { required: true, message: '请至少选择一个活动性质', trigger: 'change'},
        orgName: { required: true, message: '企业全称不能为空', trigger: 'blur'},
      },
      orgId:''
    };
  },
  components: {
    Table,
    dialogCommonComponent,
    protleTitleComponent
  },
  computed: {
    
  },
  watch: {
    
  },
  created() {
    this.search();
  },
  methods: {
    add(){
      this.$nextTick(() =>{
        this.$refs.dialogCommonComponent.show();
      });
    },
    close() {
      this.$bus.$emit('closeDialog');
      this.$refs.ruleForm.resetFields();
      this.orgId = '';
    },
    async handleEnter() {
      var orgInfo = await this.getOrgInfo({orgName:this.ruleForm.orgName});
      this.orgId = orgInfo && orgInfo.orgId ? orgInfo.orgId : '';
      if(!this.orgId){
        this.$message.error('企业不存在');
      }else{
        this.$message.success('获取企业信息成功');
      }
    },
    async handleDailogConfirm() {
      const vm = this;
      this.$refs.ruleForm.validate(async(validate) => {
        if (validate) {
          try {
            if (!vm.orgId){
              vm.$message.warning('请先输入正确的企业名称并且按enter键进行查询');
              return;
            }
            var params = {
              orgName:vm.ruleForm.orgName,
              orgRole:vm.ruleForm.orgRole,
              orgId:vm.orgId
            };
            vm.loading = true;
            var response = await vm.$http.post(`${vm.$apiUrl.saveBusiness}`,params);
            if(response.data.status == vm.$appConst.status){
              vm.$message.success('添加成功');
              vm.search();
              vm.loading = false;
              vm.close();
            }
          }
          catch(error){
            vm.loading = false;
            vm.$message.error(error.data.data);
          }
        }
      })
    },
    // 删除
    async deletes(row) {
        var vm = this;
        try {
          var response = await vm.$http.get(`${vm.$apiUrl.deleteBusiness}/${row.id}`);
          if(response.data.status == vm.$appConst.status){
            vm.$message.success('删除成功');
            vm.search();
          }
        }
        catch(error){
          vm.$message.error(error.data.message);
        }
    },
    // 搜索
    search(searchData) {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize
      };
      this.loading = true;
      const url = `${this.$apiUrl.queryBusiness}`;
      this.$http.get(url,{params})
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.mainTable.tableData.map(item => {
            item.orgRole2 = this.$appConst.businessRoleTypes[item.orgRole];
          });
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$message.warning(err.message || '服务器错误，请稍后再试!');
        });
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.search();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.search();
    }
  }
};
</script>

<style lang="scss" scoped>
.approval__box{
  .search{
    height: 120px;
    margin-top: 50px;
  }
  .btn__search{
    bottom: -46px;
    right: 0;
  }
  .table_btn{
    margin: 5px;
  }
}
</style>
