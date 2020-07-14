<template>
    <div >
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

export default {
  name: '',
  data() {
    return {
      workDate: '',
      // 表格数据
      mainTable: {
        tableHeader: {
          flightNumber: "航班号",
          airplaneNumber: "飞机号",
          passage: "航段",
          airportServiceFee2: "机场服务费",
          civilAviationDevelopmentFund2: "民航发展基金",
          serviceDate: "日期"
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
    };
  },
  components: {
    Table
  },
  computed: {
    
  },
  watch: {
    
  },
  created() {
    this.search();
  },
  methods: {
    // 搜索
    search() {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        orgId:sessionStorage.getItem('orgId'),
        assetType:'TRADEAVIATIONSERVICEFEE',
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
            item.airportServiceFee2 = this.$appConst.fmoney(item.airportServiceFee, 2);
            item.civilAviationDevelopmentFund2 = this.$appConst.fmoney(item.civilAviationDevelopmentFund, 2);
            // item.cType = this.$appConst.cTypes[item.type];
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
