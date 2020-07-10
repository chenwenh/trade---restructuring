<template>
    <div>
        <!-- 表格 -->
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :selected="true"
              :selectable="selectable"
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
            <el-button :disabled="isDisabled" type="primary" icon="el-icon-share" @click="handlePush">
                推送
            </el-button>
        </div>
        <dialogCommonComponent ref="dialogCommonComponent" title="请选择推送平台" width="500px">
            <span>我同意数据授权至：</span>
            <el-select v-model="sendUrl" placeholder="请选择">
                <el-option
                        v-for="item in platFormOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div style="text-align:center;margin-top:30px;">
                <el-button
                        size="small"
                        @click="close()">
                    取 消
                </el-button>
                <el-button
                        :disabled="!sendUrl"
                        size="small"
                        type="primary"
                        @click="handleDailogConfirm()">
                    确 定
                </el-button>
            </div>
        </dialogCommonComponent>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import mixin from '@/assets/js/mixin.js';

export default {
  name: '',
  mixins:[mixin],
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
      amount:0,
      platFormOptions: [
        {
          value: 'financing',
          label: '易见区块（易见融资平台）'
        },
      ],
      sendUrl:'',
      entityUuids:[]
    };
  },
  components: {
    Table,
    dialogCommonComponent
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
    selectable (row, index) {
      if (row.lockState) {
        return false
      } else {
        return true
      }
    },
    close() {
      this.$bus.$emit('closeDialog');
    },
    handlePush() {
      this.$refs.dialogCommonComponent.show();
      this.sendUrl = "";
    },
    handleDailogConfirm() {
      const vm = this;
      vm.entityUuids = this.selectedAssetsList.map(item => item.entityUuid);
      vm.close();
      vm.$bus.$emit('showProgress',0);

      var everyNumber = 10; //每次发送的个数。 
      this.common(0,vm.entityUuids,everyNumber);
    },
    async common(i,allIds,everyNumber) {
      var vm = this;
      var allNumber = Math.ceil(allIds.length/everyNumber); 
      var everyIds = allIds.slice(i * everyNumber,(i+1) * everyNumber); 
      try{
        let response = await this.$http.post(`${this.$apiUrl.pushFullAssetPackage}`,{entityUuids:everyIds});
        if(response.data.status == 200) {
          i = i+1;
          vm.$bus.$emit('showProgress',(i/allNumber)*100);
          if (i==allNumber){
            setTimeout(()=> {
              vm.$bus.$emit('hideProgress');
              vm.$message.success('推送成功!');
              vm.search();
              vm.$refs.tableRef.clearSelection();
            },1000);
            return;
          }
          vm.common(i,allIds,everyNumber);
        }
      }catch(err){
        vm.$message.error(err.data.message);
        vm.$bus.$emit('hideProgress');
      }
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
