<template>
    <div>
         <breadcrumb :breadcrumbList="breadcrumbs"/>
        <div  v-show="firstShow">
        <!-- 表格 -->
         <el-button style="margin-bottom:20px;"
                type="primary"
                icon="el-icon-plus"
                @click="handleAddAsset()">
            添加
        </el-button>
        <selectForm ref="selectForm" :queryTerms="queryTerms" @search="reSearch"></selectForm>
        <Table
              ref="tableRef"
              :mainTable="mainTable"
              :selected="selected"
              :selectable="selectable"
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
                                  v-if="scope.row.recvgStatusFlag === '未收货'"
                                >
                                  收货
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
                style="margin-left:0px;margin-top:-20px;"
                @click="handleConfrim()">
            批量确认
        </el-button>
        </div>
        <!-- 添加发货单 -->
        <div v-show="secondShow" style="background:white;">
          <addDelv ref="addDelv" @search="search"></addDelv>
        </div>
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
              <el-button type="primary" size="small" @click="sure">确定</el-button>
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
import relationDialog from '../createOrCancelRelation/relationDialog.vue';
import addDelv from './addDelv';
import selectForm from '@/components/selectForm.vue';
import breadcrumb from '@/components/breadcrumb.vue';

export default {
  name: '',
  data() {
    return {
      breadcrumbs: ['贸易管理', '发货单管理'],
      queryTerms:{
        "entityNo":"发货单单号",
        "name":"发货单名称"
      },
      confirmLoading:false,
      selected:true,
      title:'',
      firstShow:true,
      secondShow:false,
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
      loading: false,
      assetsUidList:[],
      selectedAssetsList:[],
      searchForm:{}
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
    breadcrumb
  },
  created() {
    this.search();
  },
  mounted() {
    var vm = this;
    this.$bus.$on('back',function() {
      vm.firstShow = true;
      vm.secondShow = false;
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
    selectable (row) {
      if (row.recvgStatusFlag === '未收货') {
        return true
      } else {
        return false
      }
    },
    // 批量确认
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
    close() {
      this.$bus.$emit('closeDialog');
    },
    async sure() {
      var vm = this;
      var attachements = this.$refs.uploadFileComponent.getFile();
      var response = await vm.$http.post(`${vm.$apiUrl.addAttach}TRADEDLVRGOODS/assetuuid/${this.entityUuid}/addAttach`,attachements)
      if (response.data.status == this.$appConst.status) {
        this.$bus.$emit('closeDialog');
        this.$message.success('附件修改成功');
        this.search(this.searchForm);
      }
    },
    handleAddAsset() {
      this.firstShow = false;
      this.secondShow = true;
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
      this.$refs.relationDialog.show(row, 'createRelation', 'TRADEDLVRGOODS');
    },
    // 取消关联
    handleCancelRelation(row) {
      this.$refs.relationDialog.show(row, 'cancelRelation', 'TRADEDLVRGOODS');
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
        this.$refs.goodsDetailComponent.init(row);
        this.$refs.goodsDetailComponent.setSelected(false);
      }); 
      this.title='发货详情';
    },
    // 收货
    receiveGoods(row){
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
        this.$refs.goodsDetailComponent.init(row);
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
      this.mainTable.tableData = [];
      const origionParams = {
        page: this.page,
        pageSize: this.pageSize,
        orgId:sessionStorage.getItem('orgId'),
        assetType:'TRADEDLVRGOODS',
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
