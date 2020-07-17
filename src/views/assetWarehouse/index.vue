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
          // buyerId: "公司编号",
          buyer: "公司名称",
          warehouseName: "仓库名称",
          // sellerId: "供应商编号",
          seller: "供应商明细",
          checkDate: "盘点日期",
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
                  totalAmount: "合计(元)"
              }
          }
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
        assetType:'TRADEWAREHOUSE',
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
</style>
