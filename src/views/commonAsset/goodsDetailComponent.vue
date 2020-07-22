<template>
    <div>
        <!-- 表格 -->
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :selected="selected"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true"
              :height2="height"
              >
        </Table>
        <p v-show="selected">
        备注：
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="remarks">
        </el-input>
        </p>
        <!-- 合计 -->
        <div style="float:right;margin-top:20px;overflow:hidden;width:100%;" v-show="selected">
            <el-col :span="18">&nbsp;</el-col>
            <el-col :span="6" style="line-height: 36px;float:right;">
                <el-col :span="3">
                    <span class="elInput">合计：</span>
                </el-col>
                <el-col :span="8">共 <span class="elInput">{{assetsUidList.length}}</span>条</el-col>
                <el-col :span="12">共<span style="width:70%; padding:0; display:inline-block; border-bottom:1px solid #ccc;text-indent:10px;" class="elInput">{{recvgAmount | MoneyFormat}}</span>
                    元
                </el-col>
            </el-col>
        </div>
        <div class="dialog-footer" style="margin-top:62px;">
          <el-button plain  @click="close()" size="medium">取消</el-button>
          <el-button type="primary"  @click="sure()" size="medium" :loading="loading" v-show="selected" class="primaryButton">确定</el-button>
        </div>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import commonSetData from '@/assets/js/commonSetData';

export default {
  name: '',
  data() {
    return {
      loading:false,
      selected: false,
      // 表格数据
      mainTable: {
        tableHeader: {},
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      height: 400,
      allData:[],
      assetsUidList:[],
      selectedAssetsList:[],
      entityUuid:'',
      recvgAmount:'',
      remarks:"",
      assetType:""
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
      vm.recvgAmount = 0;
      console.log(vm.selectedAssetsList,'vm.se');
      vm.selectedAssetsList.forEach(item => {
        vm.recvgAmount+=Number(item.unitPrice *　item.quantity);
      });
    })
  },
  methods: {
    setSelected(flag){
      this.selected = flag;
    },
    close() {
        this.$bus.$emit('closeDialog');
        this.assetsUidList = [];
        this.selectedAssetsList = [];
        this.$refs.tableRef.clearSelection();
    },
    async sure() {
      const vm = this;
      if(this.assetsUidList.length == 0){
        this.$message.error('未选择数据，无法确认收货');
        return;
      }
      if(this.assetsUidList.length<this.allData.length){
        this.$message.error('请勾选全部的数据');
        return;
      }
      var params = {
        goods:this.allData,
        remarks:this.remarks,
        recvgAmount:this.recvgAmount
      };
      try{
        vm.loading = true;
        var response  = await this.$http.post(`${this.$apiUrl.confirmRecvgGoods}/${this.entityUuid}`,params);
        if(response.data.status == this.$appConst.status){
          vm.$message.success('收货成功！');
          vm.close();
          vm.$emit('search');
          vm.loading = false;
        }
      }catch(error){
        vm.loading = false;
        vm.$message.error(error.data.data);
      }
    },
    init(row,assetType) {
      this.assetType = assetType;
      this.mainTable.tableHeader = commonSetData.detailsGoodsTableHeader[this.assetType];
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.allData = row.goods;
      this.entityUuid = row.entityUuid;
      this.mainTable.tableData = this.allData.slice(0,this.pageSize);
      this.totalCount = row.goods.length;
      this.mainTable.tableData.map(item=> {
        item.unitPrice2 = this.$appConst.fmoney(item.unitPrice, 2);
        item.receiveTotalAmount2 = item.receiveTotalAmount ? this.$appConst.fmoney(item.receiveTotalAmount, 2) : '/';
        item.totalAmount2 = this.$appConst.fmoney(item.totalAmount, 2);
        item.receiveQuantity = item.quantity;
        item.receiveTotalAmount2 = item.totalAmount2;
        item.id = item.skuId;
      });
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.mainTable.tableData = this.allData.slice((this.page-1)*this.pageSize,this.page*this.pageSize);
      this.mainTable.tableData.map(item=>{
        item.id = item.skuId;
      });
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.mainTable.tableData = this.allData.slice((this.page-1)*this.pageSize,this.page*this.pageSize);
      this.mainTable.tableData.map(item=>{
        item.id =item.skuId;
      });
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
