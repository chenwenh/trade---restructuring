<template>
    <div>
        <!-- 表格 -->
        <div  v-show="firstShow">
        <el-button style="margin-bottom:20px;"
                type="primary"
                icon="el-icon-plus"
                @click="handleAddAsset()">
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
              <el-table-column 
                        label="操作"
                        >
                  <template slot-scope="scope">
                    <el-button
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="details(scope.row)">
                        详情
                    </el-button>
                  </template>
              </el-table-column>
        </Table>
        </div>
        <div v-show="secondShow" style="background:white;">
            <contractInfoComponentNew ref="contractInfoComponentNew"></contractInfoComponentNew>
        </div>
        <dialogCommonComponent ref="dialogCommonComponent" title="合同详情" width="80%">
            <contractInfoDetailComponent  ref="contractInfoDetailComponent"></contractInfoDetailComponent>
        </dialogCommonComponent>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import contractInfoDetailComponent from '@/components/contractInfoDetailComponent';
import contractInfoComponentNew from './contractInfoComponentNew';

export default {
  name: '',
  data() {
    return {
      firstShow:true,
      secondShow:false,
      // 表格数据
      mainTable: {
        tableHeader: {
          name: "合同名称",
          entityNo: "合同编号",
          contractContent: "合同内容",
          businessType: "业务类型",
          cType: "合同类型",
          buyer: "买方",
          seller: "卖方",
          contractMoney: "合同金额(元)",
          signingDate: "合同签署时间",
          startDate: "合同生效日期",
          endDate: "合同到期日期"
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false
    };
  },
  components: {
    Table,
    dialogCommonComponent,
    contractInfoDetailComponent,
    contractInfoComponentNew
  },
  created() {
    this.search();
  },
  mounted() {
    var vm = this;
    this.$bus.$on('back',function() {
      vm.firstShow = true;
      vm.secondShow = false;
    });
  },
  methods: {
    handleAddAsset() {
      this.firstShow = false;
      this.secondShow = true;
    },
    // 详情
    details(row) {
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
         this.$refs.contractInfoDetailComponent.handleGetOrgInfo(row);
      }); 
    },
    // 搜索
    search(searchData) {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        orgId:sessionStorage.getItem('orgId'),
        assetType:'TRADECONTRACT',
        sortDirection: 'DESC'
      };
      this.loading = true;
      const url = `${this.$apiUrl.queryContract}`;
      this.$http.post(url,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.mainTable.tableData.map(item => {
            item.businessType = this.$appConst.businessTypes[item.buzType];
            item.contractMoney = this.$appConst.fmoney(item.amount, 2);
            item.cType = this.$appConst.cTypes[item.type];
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
    handleSizeChange(size){
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
