<template>
    <div>
        <!-- 表格 -->
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
                        @click="details(scope.row)">
                        详情
                    </el-button>
                  </template>
              </el-table-column>
        </Table>
        <dialogCommonComponent ref="dialogCommonComponent" title="结算单详情" width="80%">
            <goodsDetailComponent  ref="goodsDetailComponent"></goodsDetailComponent>
        </dialogCommonComponent>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import goodsDetailComponent from './goodsDetailComponent';

export default {
  name: '',
  data() {
    return {
      // 表格数据
      mainTable: {
        tableHeader: {
            entityNo: "结算单单号",
            name: "结算单名称",
            buyer: "买方",
            seller: "卖方",
            settlePrice: "结算单价",
            totalAmount: "结算单总金额",
            paidAmount: "结算单支付金额",
            balanceAmount: "余额",
            settleDate: "结算日期",
            startDate: "结算开始日期",
            endDate: "结算结束日期",
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
    goodsDetailComponent
  },
  created() {
    this.search();
  },
  methods: {
    // 详情
    details(row) {
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
        this.$refs.goodsDetailComponent.init(row);
      }); 
    },
    // 搜索
    search(searchData) {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        orgId:sessionStorage.getItem('orgId'),
        assetType:'TRADESETTLEMENT',
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
            item.settlePrice = this.$appConst.fmoney(item.settlePrice, 2);
            item.totalAmount = this.$appConst.fmoney(item.totalAmount, 2);
            item.paidAmount = this.$appConst.fmoney(item.paidAmount, 2);
            item.balanceAmount = this.$appConst.fmoney(item.balanceAmount, 2);
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
