<template>
    <div>
        <!-- 表格 -->
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :selected="true"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true"
              :height2="height2()">
        </Table>
        <div style="text-align:right;margin-top:15px;margin-right:30px;font-size:16px;">
            <label style="margin-right:20px;font-weight:bold;color: #666666">已选中单数:<span style="color: #0068BD">{{assetsUidList.length}}</span></label>
            <label style="font-weight:bold;color: #666666">已选中金额：<span
                    style="color: #0068BD">{{amount|MoneyFormat}}</span></label>
        </div>
         <div style="text-align:center;margin-top:40px;">
            <el-button type="warning" @click="back">上一步</el-button>
            <el-button :disabled="isDisabled" type="primary" icon="el-icon-share">
                推送
            </el-button>
        </div>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';

export default {
  name: '',
  data() {
    return {
      counts:0,
      // 表格数据
      mainTable: {
        tableHeader: {
            entityUuid:"uid",
            entityNo: "结算单单号",
            name: "结算单名称",
            buyer: "买方",
            seller: "卖方",
            settlePrice: "结算单价",
            totalAmount2: "结算单总金额",
            settleDate: "结算日期",
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      selectedAssetsList:[],
      assetsUidList:[],
      isDisabled:true,
      amount:0
    };
  },
  components: {
    Table
  },
  created() {
  },
  mounted() {
    const vm = this;
    this.$bus.$on('getAssetsUidList',function(value1,value2) {
      // assetsUidList 为选中的id数组
      // selectedAssetsList为选中的行的所有数据。
      vm.assetsUidList = value1;
      vm.selectedAssetsList = value2;
      if(vm.assetsUidList.length>0){
        vm.isDisabled = false;
      }else{
        vm.isDisabled = true;
      }
      vm.amount = 0;
      vm.selectedAssetsList.forEach(item=>{
        vm.amount+=Number(item.totalAmount);
      });
    })
  },
  methods: {
    height2() {
      var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      return height - 260;
    },
    back() {
        this.$bus.$emit('back');
    },
    // 详情
    init(row) {
      this.assetGraphUuid = row.graphUuid;
      this.$refs.tableRef.clearSelection();
      this.page = 1;
      this.selectedAssetsList = [];
      this.assetsUidList = [];
      this.amount = 0;
      this.$refs.tableRef.resetCurrentPage();
      this.search();
    },
    // 搜索
    search(searchData) {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        assetGraphUuid:this.assetGraphUuid,
      };
      this.loading = true;
      const url = `${this.$apiUrl.querySettlementByContract}`;
      this.$http.post(url,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.mainTable.tableData.map(item => {
            item.settlePrice = this.$appConst.fmoney(item.settlePrice, 2);
            item.totalAmount2 = this.$appConst.fmoney(item.totalAmount, 2);
          });
          this.loading = false;
          setTimeout(() =>{
            // 复现之前选中的数据。
            this.$refs.tableRef.toggle();
          },);
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
