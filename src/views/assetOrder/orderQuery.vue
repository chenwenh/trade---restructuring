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
              <el-table-column 
                        label="操作" width="200"
                        >
                  <template slot-scope="scope">
                    <el-button
                        icon="el-icon-view"
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="details(scope.row)">
                        详情
                    </el-button>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                             <el-button
                                icon="el-icon-share"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px; "
                                @click="previewAssets(scope.row)"
                               >
                                查看资产图
                            </el-button>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                  </template>
              </el-table-column>
        </Table>
        <dialogCommonComponent ref="dialogCommonComponent" title="订单详情" width="80%">
            <goodsDetailComponent  ref="goodsDetailComponent"></goodsDetailComponent>
        </dialogCommonComponent>
        <!-- 查看资产图 -->
        <dialogCommonComponent ref="dialogCommonComponent2" title="资产视图" width="90%">
            <assetView ref="assetView"></assetView>
        </dialogCommonComponent>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import goodsDetailComponent from './goodsDetailComponent';
import assetView from '@/components/assetView';

export default {
  name: '',
  data() {
    return {
      workDate: '',
      // 表格数据
      mainTable: {
        tableHeader: {
          name: "订单名称",
          entityNo: "订单单号",
          orderAmount: "订单金额",
          buyer: "买方名称",
          seller: "卖方名称",
          createTime: "订单创建日期",
          startDate: "订单发起日期",
          goodsHead:{
              title: "商品信息",
              children: {
                  skuId: "货品编号",
                  goodsName: "货品名称",
                  remarks: "货品描述",
                  spec: "商品规格",
                  quantity: "数量",
                  unit: "单位",
                  manufacturer: "制造商",
                  unitPrice: "单价",
                  taxRate: "税率(%)",
              }
          }
        },
        tableData: [],
        tableWidth: {
          name: "150",
          entityNo: "150",
          orderAmount: "150",
          createTime: "120",
          startDate: "120",
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      assetsList: [],
    };
  },
  components: {
    Table,
    dialogCommonComponent,
    goodsDetailComponent,
    assetView
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
    // 查看资产图
    previewAssets(row) {
      this.$refs.dialogCommonComponent2.show();
      this.$nextTick(() => {
        this.$refs.assetView.init(row);
      });
    },
    // 搜索
    search(searchData) {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        orgId:sessionStorage.getItem('orgId'),
        assetType:'TRADEORDER',
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
            item.orderAmount = this.$appConst.fmoney(item.amount, 2);
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
