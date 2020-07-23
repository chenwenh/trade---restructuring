<template>
    <div>
         <breadcrumb :breadcrumbList="breadcrumbs"/>
        <div  v-show="firstShow">
        <!-- 表格 -->
         <el-button style="margin-bottom:20px;"
                type="primary"
                class="addButton"
                icon="el-icon-plus"
                v-if="addButtonIsShow()"
                @click="handleAddAsset()">
            添加
        </el-button>
        <selectForm ref="selectForm" :queryTerms="queryTerms" @search="reSearch" class="selectForm"></selectForm>
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :selected="selected()"
              :selectable="selectable"
              :loading="loading"
              :pageSize="pageSize"
              :totalCount="totalCount"
              @handleSizeChange = "handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
              :showPagination="true">
              <!-- 操作 -->
              <el-table-column 
                      fixed="right"
                        label="操作" width="120"
                        v-if="operationButtionIsShow()"
                        >
                  <template slot-scope="scope">
                    <el-button
                        icon="el-icon-view"
                        class="collectBtn redBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        v-if="detailButtonIsShow()"
                        @click="details(scope.row)">
                        详情
                    </el-button>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                          <i class="el-icon-more iconMore"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-if="scope.row.graphUuid&&scope.row.graphUuid!='00000000-0000-0000-0000-000000000000'">
                            <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px;"
                                @click="handleCreateRelation(scope.row)">
                                创建关联
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.graphUuid&&scope.row.graphUuid!='00000000-0000-0000-0000-000000000000'">
                            <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px;"
                                @click="handleCancelRelation(scope.row)">
                                取消关联
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item>
                             <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px; "
                                v-if="scope.row.graphUuid"
                                @click="previewAssets(scope.row)"
                               >
                                查看资产图
                            </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item>
                              <el-button
                                  icon="el-icon-tickets"
                                  class="collectBtn"
                                  size="medium"
                                  type="text"
                                  style="margin-left:0px;display:block; "
                                  @click="getAttachments(scope.row)"
                                >
                                  附件
                              </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item>
                              <el-button
                                  icon="el-icon-goods"
                                  class="collectBtn"
                                  size="medium"
                                  type="text"
                                  style="margin-left:0px;display:block; "
                                  @click="receiveGoods(scope.row)"
                                  v-if="scope.row.recvgStatusFlag === '未收货' && assetType == 'TRADEDLVRGOODS'"
                                >
                                  收货
                              </el-button>
                          </el-dropdown-item>
                          <el-dropdown-item>
                             <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px; "
                                @click="handleSearchEaglecointransaction(scope.row)"
                                v-if="assetType === 'TRADESETTLEMENT'"
                               >
                                山鹰币查询
                            </el-button>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                  </template>
              </el-table-column>
        </Table>
        <el-button 
                :loading="confirmLoading"
                size="small"
                type="primary"
                class="primaryButton"
                style="margin-left:0px;margin-top:-20px;"
                v-show="assetType === 'TRADEDLVRGOODS'"
                @click="handleConfrim()">
            批量确认
        </el-button>
        </div>
        <!-- 添加 -->
        <el-drawer
          style="overflow:auto;"
          class="drawer"
          :title="addFormTitle()"
          size="40%"
          :visible.sync="drawer"
          >
          <addDelv ref="addDelv" @search="search"></addDelv>
        </el-drawer>
        <dialogCommonComponent ref="dialogCommonComponent" :title="title" width="80%">
            <goodsDetailComponent  ref="goodsDetailComponent" @search="search"></goodsDetailComponent>
        </dialogCommonComponent>
        <!-- 查看资产图 -->
        <dialogCommonComponent ref="dialogCommonComponent2" title="资产视图" width="90%">
            <assetView ref="assetView"></assetView>
        </dialogCommonComponent>
        <!-- 附件 -->
        <dialogCommonComponent ref="dialogCommonComponent3" title="附件" width="60%">
            <uploadFileComponent ref="uploadFileComponent" title="附件"></uploadFileComponent>
            <div style="text-align:center;margin-top:20px;">
              <el-button plain size="small" @click="close()">取消</el-button>
              <el-button type="primary" size="small" @click="sure" class="primaryButton">确定</el-button>
            </div>  
        </dialogCommonComponent>
        <!-- 山鹰币查询 -->
        <dialogCommonComponent ref="dialogCommonComponent4" title="山鹰币查询" width="60%">
            <eagleCoinListBySettlement ref="eagleCoinListBySettlement"></eagleCoinListBySettlement>
            <div style="text-align:center;margin-top:20px;">
              <el-button plain size="small" @click="close()">取消</el-button>
            </div>  
        </dialogCommonComponent>
        <!-- 创建关联 -->
        <relation-dialog  ref="relationDialog" @openTabs="openTabs"></relation-dialog>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import goodsDetailComponent from './goodsDetailComponent';
import assetView from '@/components/assetView';
import uploadFileComponent from '@/components/uploadFileComponent';
import eagleCoinListBySettlement from '@/components/eagleCoinListBySettlement';
import relationDialog from '../createOrCancelRelation/relationDialog.vue';
import addDelv from './addDelv';
import selectForm from '@/components/selectForm.vue';
import breadcrumb from '@/components/breadcrumb.vue';
import commonSetData from '@/assets/js/commonSetData.js';

export default {
  name: '',
  data() {
    return {
      drawer:false,
      breadcrumbs: [],
      queryTerms:{},
      confirmLoading:false,
      // selected:true,
      title:'',
      firstShow:true,
      secondShow:false,
      // 表格数据
      mainTable: {
        tableHeader: {},
        tableData: [],
        tableWidth: {
          name:120,
          entityNo:120,
          createTime:120,
          startDate:120,
          totalAmount:150,
          paidAmount:150,
          endDate:150,
          // startDate:150
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      assetsUidList:[],
      selectedAssetsList:[],
      searchForm:{},
    };
  },
  components: {
    Table,
    dialogCommonComponent,
    goodsDetailComponent,
    assetView,
    addDelv,
    relationDialog,
    uploadFileComponent,
    selectForm,
    breadcrumb,
    eagleCoinListBySettlement
  },
  created() {
    // 首次用到该组件的时候执行这个。
    var assetType = this.$route.params.assetType;
    this.initExecute(assetType);
  },
  beforeRouteUpdate(to,from,next){
    // 上一次用到该组件，路由变化之后还是用到该组件，则执行这个。
    this.initExecute(to.params.assetType);
    next();
  },
  computed: {
  },
  mounted() {
    var vm = this;
    this.$bus.$on('back',function() {
      vm.firstShow = true;
      vm.secondShow = false;
    });
    this.$bus.$on('addClose',function() {
      vm.drawer = false;
    });
    this.$bus.$on('getAssetsUidList',function(value1,value2) {
      // assetsUidList 为选中的id数组
      // selectedAssetsList为选中的行的所有数据。
      vm.assetsUidList = value1;
      vm.selectedAssetsList = value2;
      vm.entityUuids = [];
      vm.selectedAssetsList.forEach(item => {
        vm.entityUuids.push(item.entityUuid);
      });
    })
  },
  methods: {
    initExecute(assetType) {
      this.assetType = assetType;
      this.breadcrumbs = commonSetData.breadcrumbs[this.assetType];
      this.queryTerms = commonSetData.queryTerms[this.assetType];
      this.mainTable.tableHeader = commonSetData.tableHeader[this.assetType];
      this.search();
    },
    // 添加按钮是否显示
    addButtonIsShow() {
      if(this.assetType=='TRADESUPPLIER'){
        return false;
      }
      if(this.assetType == 'TRADEAVIATIONSERVICEFEE' || this.assetType == 'TRADEAVIATIONOILDATA' || this.assetType == 'TRADEEAGLECOINTRANSACTION' ||  this.assetType == 'TRADETICKETSALES'){
        return false;
      }
      if(this.assetType == 'TRADEWAREHOUSE'){
        return false;
      }
      return true;
    },
    // 操作栏是否显示
    operationButtionIsShow() {
      if(this.assetType == 'TRADEINVOICE' || this.assetType == 'TRADEPONDERATION' ||this.assetType == 'TRADEQUALITY' || this.assetType == 'TRADESUPPLIER'){
        return false;
      }
      if(this.assetType == 'TRADEAVIATIONSERVICEFEE' || this.assetType == 'TRADEAVIATIONOILDATA' ||this.assetType == 'TRADEEAGLECOINTRANSACTION' || this.assetType == 'TRADETICKETSALES'){
        return false;
      }
      if(this.assetType == 'TRADEWAREHOUSE'){
        return false;
      }
      return true;
    },
    // 详情按钮是否显示
    detailButtonIsShow() {
      if(this.assetType == 'TRADEINVOICE' || this.assetType == 'TRADELOGISTICS'){
        return false;
      }
      return true;
    },
    // 判断是否有勾选框。发货的时候存在。
    selected() {
      if(this.assetType === 'TRADEDLVRGOODS'){
        return true;
      }else{
        return false;
      }
    },
    // 添加时标题。
    addFormTitle() {
      return '添加'+ this.$appConst.dataType[this.assetType];
    },
    // 判断什么情况下可以勾选。
    selectable (row) {
      // 发货单有这个功能。
      if(this.assetType != 'TRADEDLVRGOODS') return true;
      if (row.recvgStatusFlag === '未收货') {
        return true
      } else {
        return false
      }
    },
    // 发货单管理中的批量确认
    async handleConfrim() {
      const vm = this;
      if(this.assetsUidList.length==0){
        this.$message.error('请至少选择一条数据');
        return;
      } 
      this.common(0,vm.entityUuids,this.$appConst.everySendNum);
    },
    async common(i,allIds,everyNumber) {
      var vm = this;
      var allNumber = Math.ceil(allIds.length/everyNumber); 
      var everyIds = allIds.slice(i * everyNumber,(i+1) * everyNumber); 
      try{
        let response = await this.$http.post(`${this.$apiUrl.confirmRecvgGoodsByBatch}`,{entityUuids:everyIds});
        if(response.data.status == 200) {
          i = i+1;
          vm.$bus.$emit('showProgress',(i/allNumber)*100);
          if (i==allNumber){
            setTimeout(()=> {
              vm.$bus.$emit('hideProgress');
              vm.$message.success('批量确认成功！!');
              vm.search(this.searchForm);
              vm.$refs.tableRef.clearSelection();
              vm.confirmLoading = false;
            },1000);
            return;
          }
          vm.common(i,allIds,everyNumber);
        }
      }catch(err){
        vm.confirmLoading = false;
        vm.$message.error(err.data.message);
        vm.$bus.$emit('hideProgress');
      }
    },
    getAttachments(row){
      this.entityUuid = row.entityUuid;
      this.$refs.dialogCommonComponent3.show();
      this.$nextTick(() => {
        this.$refs.uploadFileComponent.init(row);
      });
    },
    // 山鹰币查询
    handleSearchEaglecointransaction(row) {
      this.$refs.dialogCommonComponent4.show();
      this.$nextTick(() =>{
        this.$refs.eagleCoinListBySettlement.init(row.entityUuid);
      });
    },
    close() {
      this.$bus.$emit('closeDialog');
    },
    async sure() {
      var vm = this;
      var attachements = this.$refs.uploadFileComponent.getFile();
      var response = await vm.$http.post(`${vm.$apiUrl.addAttach}${this.assetType}/assetuuid/${this.entityUuid}/addAttach`,attachements)
      if (response.data.status == this.$appConst.status) {
        this.$bus.$emit('closeDialog');
        this.$message.success('附件修改成功');
        this.search(this.searchForm);
      }
    },
    handleAddAsset() {
      this.drawer = true;
      this.$nextTick(() => {
        this.$refs.addDelv.init(this.assetType);
      });
    },
    openTabs(isTrue) {
      if (isTrue) {
        this.firstShow = true;
        this.secondShow = false;
      } else {
        this.firstShow = false;
        this.secondShow = false;
      }
    },
    // 创建关联
    handleCreateRelation(row) {
      this.$refs.relationDialog.show(row, 'createRelation', this.assetType);
    },
    // 取消关联
    handleCancelRelation(row) {
      this.$refs.relationDialog.show(row, 'cancelRelation', this.assetType);
    },
    // 查看资产图
    previewAssets(row) {
      this.$refs.dialogCommonComponent2.show();
      this.$nextTick(() => {
        this.$refs.assetView.init(row);
      });
    },
    // 详情
    details(row) {
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
        this.$refs.goodsDetailComponent.init(row,this.assetType);
        this.$refs.goodsDetailComponent.setSelected(false);
      }); 
      this.title= this.$appConst.dataType[this.assetType] + '详情';
    },
    // 收货
    receiveGoods(row){
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
        this.$refs.goodsDetailComponent.init(row,this.assetType);
        this.$refs.goodsDetailComponent.setSelected(true);
      }); 
      this.title = '收货详情';
    },
    reSearch(searchForm) {
      this.page = 1;
      this.searchForm = searchForm;
      this.search(searchForm);
    }, 
    // 搜索
    search(searchForm) {
      var vm = this;
      vm.mainTable.tableData = [];
      const origionParams = {
        page: this.page,
        pageSize: this.pageSize,
        orgId:sessionStorage.getItem('orgId'),
        assetType:this.assetType,
        sortDirection: 'DESC'
      };
      const params = Object.assign({},searchForm,origionParams);
      this.loading = true;
      const url = `${this.$apiUrl.queryContract}`;
      this.$http.post(url,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.mainTable.tableData.map(item => {
            // 订单中字段处理
            if(this.assetType == 'TRADEORDER'){
              item.cType = this.$appConst.cTypes[item.type];
            }
          });
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.totalCount = 0;
          this.$message.warning(err.data.message || '服务器错误，请稍后再试!');
        });
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.search(this.searchForm);
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.search(this.searchForm);
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
