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
        <dialogCommonComponent ref="dialogCommonComponent" title="发货详情" width="80%">
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
            name: "发货单名称",
            entityNo: "发货单单号",
            delvAmount: "发货单总金额",
            seller: "卖方名称",
            buyer: "买方名称",
            recvgStatusFlag: "收货状态",
            delvDate: "发货日期"
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
        assetType:'TRADEDLVRGOODS',
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
            item.delvAmount = this.$appConst.fmoney(item.amount, 2);
            item.recvgStatusFlag = item.recvgStatus === 'false' || item.recvgStatus === "FALSE"? '未收货':'收货完成';
            item.delvDate = this.$appConst.handleSetTime(item.drDate);
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
