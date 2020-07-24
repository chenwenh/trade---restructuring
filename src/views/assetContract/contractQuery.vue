<template>
    <div>
        <breadcrumb :breadcrumbList="breadcrumbs"/>
        <!-- 表格 -->
        <div  v-show="firstShow">
        <el-button style="margin-bottom:20px;"
                type="primary"
                class="addButton"
                icon="el-icon-plus"
                @click="handleAddAsset()">
            添加
        </el-button>
        <selectForm ref="selectForm" :queryTerms="queryTerms" @search="reSearch" class="selectForm"></selectForm>
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
                        fixed="right"
                        >
                  <template slot-scope="scope">
                    <el-button
                        icon="el-icon-view"
                        class="collectBtn redBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="details(scope.row)">
                        详情
                    </el-button>
                     <el-button
                        icon="el-icon-edit"
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px; "
                        @click="edit(scope.row)">
                        编辑
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
                                icon="el-icon-share"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px;display:block; "
                                @click="handlePushClick(scope.row)"
                               >
                                推送
                            </el-button>
                            </el-dropdown-item>
                            <el-dropdown-item>
                             <el-button
                                icon="el-icon-edit"
                                class="collectBtn"
                                size="medium"
                                type="text"
                                style="margin-left:0px;display:block; "
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
        </div>
        <!-- 添加编辑合同 -->
        <div v-show="secondShow" style="background:white;">
            <contractInfoComponentNew ref="contractInfoComponentNew" @contractStep="contractStep"></contractInfoComponentNew>
        </div>
        <!-- 附件 -->
        <div v-show="thirdShow" style="background:white;padding-bottom:30px;">
            <uploadFileComponent ref="uploadFileComponent" title="附件"></uploadFileComponent>
            <div style="text-align:center;margin-top:20px;">
              <el-button plain size="small" @click="prev()" style="height:40px;">上一步</el-button>
              <el-button type="primary" size="small" @click="sure" class="primaryButton" style="width:236px;height:40px;">确定</el-button>
            </div>  
        </div>
        <!-- 推送时展示结算单 -->
         <div v-show="settlementShow" style="background:white;">
            <settlement ref="settlement"></settlement>
        </div>
        <!-- 查看合同详情 -->
        <dialogCommonComponent ref="dialogCommonComponent" title="合同详情" width="80%">
            <contractInfoDetailComponent  ref="contractInfoDetailComponent" :showCancel="showCancel"></contractInfoDetailComponent>
        </dialogCommonComponent>
        <!-- 查看资产图 -->
        <dialogCommonComponent ref="dialogCommonComponent2" title="资产视图" width="90%">
            <assetView ref="assetView"></assetView>
        </dialogCommonComponent>
        <!-- 添加时选择业务模式 -->
        <dialogCommonComponent ref="dialogCommonComponent3" title="业务模式" width="500px">
            <span>请选择一个业务模式：</span>
            <el-select v-model="businessTypeVal" placeholder="请选择">
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
                        :disabled="!businessTypeVal"
                        size="small"
                        type="primary"
                        class="primaryButton"
                        @click="handleDailogConfirm()">
                    确 定
                </el-button>
            </div>
        </dialogCommonComponent>
        <!-- 创建关联 -->
        <relation-dialog  ref="relationDialog" @openTabs="openTabs"></relation-dialog>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import contractInfoDetailComponent from '@/components/contractInfoDetailComponent';
import contractInfoComponentNew from './contractInfoComponentNew';
import settlement from './settlement';
import assetView from '@/components/assetView';
import relationDialog from '../createOrCancelRelation/relationDialog.vue';
import uploadFileComponent from '@/components/uploadFileComponent';
import selectForm from '@/components/selectForm.vue';
import breadcrumb from '@/components/breadcrumb.vue';

export default {
  name: '',
  data() {
    return {
      dialogVisible:false,
      breadcrumbs: ['贸易管理', '合同管理'],
      queryTerms:{
        "orgName":" 买方或卖方企业名称",
        "entityNo":"合同编号",
        "name":"合同名称",
        "TradeContract_amount":"合同金额区间",
        "TradeContract_signingDate":"合同签署时间区间"
      },
      platFormOptions:[],
      businessTypeVal:'',
      showCancel:true,
      firstShow:true,
      secondShow:false,
      settlementShow:false,
      // 表格数据
      mainTable: {
        tableHeader: {
          name: "合同名称",
          entityNo: "合同编号",
          contractContent: "合同内容",
          businessType: "业务类型",
          cType: "合同类型",
          buyer: "买方",
          seller: "卖方",
          contractMoney: "合同金额(元)",
          signingDate: "合同签署时间",
          startDate: "合同生效日期",
          endDate: "合同到期日期"
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      form:{},
      thirdShow:false,
      user:JSON.parse(sessionStorage.getItem('user')),
      operation:'',//代表是添加还是编辑。
      newForm: {},
      searchForm:{}
    };
  },
  components: {
    Table,
    dialogCommonComponent,
    contractInfoDetailComponent,
    contractInfoComponentNew,
    settlement,
    assetView,
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
      vm.settlementShow = false;
    });
    vm.getPlatFormOptions();
  },
  methods: {
    close() {
      this.$bus.$emit('closeDialog');
    },
    handleDailogConfirm() {
      if (!this.businessTypeVal){
        this.$message.error('请选择业务模式');
        return;
      }
      this.firstShow = false;
      this.secondShow = true;
      this.close();
      this.$refs.contractInfoComponentNew.init('add');
    },
    contractStep(form) {
      this.form = form;
      this.thirdShow = true;
      this.secondShow = false;
    },
    prev() {
      this.thirdShow = false;
      this.secondShow = true;
    },
    async createAssetGraph() {
      var vm = this;
      var assetGraphName = this.form.entityNo + '-' + new Date().getTime();
      var response = await vm.$http.post(`${this.$apiUrl.createAssetGraph}?assetGraphName=${assetGraphName}&patternGraphUuid=${this.businessTypeVal}&companyOrgId=${this.user.orgId}&systemType=TRADE`)
      if(response.data.status == this.$appConst.status){
        var graphUuid = response.data.data.graphUuid;
        return Promise.resolve(graphUuid);
      }
    },
    async save(graphUuid) {
      var vm = this;
      var params = Object.assign({},this.form);
      params["@class"]="com.evisible.trade.core.domain.entity.TradeContract";
      var response = await this.$http.post(`${this.$apiUrl.queryAssetsById}TRADECONTRACT/graph/${graphUuid}/saveAsset`,params)
      if(response.data.status == this.$appConst.status){
        vm.$message.success("添加成功");
        vm.firstShow = true;
        vm.secondShow = false;
        vm.thirdShow = false;
        vm.$refs.uploadFileComponent.resetFileList();
        vm.page = 1;
        vm.$refs.tableRef.resetCurrentPage();
        vm.search(this.searchForm);
      }
    },
    async updateAsset() {
      var vm = this;
      this.newForm["@class"]="com.evisible.trade.core.domain.entity.TradeContract";
      this.newForm.contractOrgId = this.user.orgId;
      try{
        var response = await this.$http.post(`${this.$apiUrl.updateAsset}`,this.newForm);
        if(response.data.status == this.$appConst.status){
          vm.firstShow = true;
          vm.secondShow = false;
          vm.thirdShow = false;
          vm.$refs.uploadFileComponent.resetFileList();
          vm.search(this.searchForm);
        }
      }catch(error){
        vm.$message.error(error.data.message);
      }
    },
    async sure() {
      var attachments = this.$refs.uploadFileComponent.getFile();
      if(attachments.length==0){
        this.$message.error('请上传附件');
        return;
      }
      if(this.operation == 'add'){
        var graphUuid = await this.createAssetGraph();
        this.save(graphUuid); 
      }else{
        this.newForm.attachments = attachments;
        this.updateAsset();
      }
    },
    async getPlatFormOptions(){
      var vm = this;
      try{
        // 获取业务模式
        vm.platFormOptions = [];
        var response = await vm.$http.get(`${this.$apiUrl.getPatternGraphInfos}`);
        if(response.data.status == this.$appConst.status){
            response.data.data.forEach(item => {
              vm.platFormOptions.push({
                label:item.name,
                value:item.graphUuid
              });
            });
            vm.businessTypeVal = vm.platFormOptions[0].value;
        }
      }catch(error){
        vm.$message.error(error.data.message);
      }
    },
    // 添加合同
    async handleAddAsset() {
      var vm = this;
      vm.operation = 'add';
      vm.$refs.dialogCommonComponent3.show();
      vm.$refs.uploadFileComponent.resetFileList();
      // vm.businessTypeVal = '';
    },
    // 详情
    details(row) {
      this.$refs.dialogCommonComponent.show();
      this.$nextTick(() => {
         this.$refs.contractInfoDetailComponent.handleGetOrgInfo(row);
      }); 
    },
    // 编辑合同
    edit(row){
      this.firstShow = false;
      this.secondShow = true;
      this.operation = 'edit';
      this.newForm = Object.assign({},row);
      this.$refs.contractInfoComponentNew.init('edit',this.newForm);
      this.$refs.uploadFileComponent.init(this.newForm);
    },
    // 推送
    handlePushClick(row) {
      this.firstShow = false;
      this.settlementShow = true;
      this.$refs.settlement.init(row);
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
      this.$refs.relationDialog.show(row, 'createRelation', 'TRADECONTRACT');
    },
    // 取消关联
    handleCancelRelation(row) {
      this.$refs.relationDialog.show(row, 'cancelRelation', 'TRADECONTRACT');
    },
    // 查看资产图
    previewAssets(row) {
      this.$refs.dialogCommonComponent2.show();
      this.$nextTick(() => {
        this.$refs.assetView.init(row);
      });
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
        assetType:'TRADECONTRACT',
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
            item.businessType = this.$appConst.businessTypes[item.buzType];
            item.contractMoney = this.$appConst.fmoney(item.amount, 2);
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
