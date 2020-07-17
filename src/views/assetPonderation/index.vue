<template>
    <div >
        <breadcrumb :breadcrumbList="breadcrumbs"/>
        <div class="allSuttleWeight">总净重:<span style="margin-left:10px;margin-right:6px;">{{allSuttleWeight}}</span></div>
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
        </Table>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import breadcrumb from '@/components/breadcrumb.vue';

export default {
  name: '',
  data() {
    return {
      breadcrumbs: ['贸易管理', '过磅单管理'],
      workDate: '',
      // 表格数据
      mainTable: {
        tableHeader: {
          entityNo: "过磅单编号",
          name:"过磅单名称",
          buyer: "买方",
          seller: "卖方",
          carPlateNumber: "车牌号",
          driver: "司机名称",
          netWeight: "净重",
          weighingDate: "过磅日期"
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      allSuttleWeight:''
    };
  },
  components: {
    Table,
    breadcrumb
  },
  computed: {
    
  },
  watch: {
    
  },
  created() {
    this.search();
    this.getAllSuttleWeight();
  },
  methods: {
    // 获取总净重
    async getAllSuttleWeight(){
      var vm = this;
      var params = {
          "page":1,
          "pageSize":10000,
          "orgId":this.user.orgId,
          "assetType":"TRADEPONDERATION"
      };
      var response = await this.$http.post(`${this.$apiUrl.sumTotalAmount}`,params);
      if (response.data.status == this.$appConst.status) {
        vm.allSuttleWeight = response.data.data;
      }
    },
    // 搜索
    search() {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        orgId:sessionStorage.getItem('orgId'),
        assetType:'TRADEPONDERATION',
        // sortDirection: 'DESC'
      };
      this.loading = true;
      const url = `${this.$apiUrl.queryContract}`;
      this.$http.post(url,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
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
.allSuttleWeight{
  text-align:right;
  margin-right:130px;
  font-size:16px;
  padding:10px 0;
}
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
