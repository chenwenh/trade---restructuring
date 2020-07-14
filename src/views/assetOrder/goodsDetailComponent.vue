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
              :showPagination="true"
              :height2="height"
              >
        </Table>
        <div class="dialog-footer" style="margin-top:62px;">
			<el-button plain  @click="close()" size="medium">取消</el-button>
		</div>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import contractInfoDetailComponent from '@/components/contractInfoDetailComponent';

export default {
  name: '',
  data() {
    return {
      // 表格数据
      mainTable: {
        tableHeader: {
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
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      height: 300,
      allData:[]
    };
  },
  components: {
    Table
  },
  created() {
    
  },
  methods: {
    close() {
        this.$bus.$emit('closeDialog');
    },
    init(row) {
      if(!row.goods) return;
      this.allData = row.goods;
      this.mainTable.tableData = this.allData.slice(0,this.pageSize);
      this.totalCount = row.goods.length;
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.mainTable.tableData = this.allData.slice((this.page-1)*this.pageSize,this.page*this.pageSize);
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.mainTable.tableData = this.allData.slice((this.page-1)*this.pageSize,this.page*this.pageSize);
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
