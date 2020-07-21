<template>
    <div>
        <breadcrumb :breadcrumbList="breadcrumbs"/>
        <div  v-show="firstShow">
        <!-- 表格 -->
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
                        >
                  <template slot-scope="scope">
                    <el-button
                        icon="el-icon-view"
                        class="collectBtn"
                        size="medium"
                        type="text"
                        style="margin-left:0px;"
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
                        </el-dropdown-menu>
                      </el-dropdown>
                  </template>
              </el-table-column>
        </Table>
        </div>
         <!-- 添加收货单 -->
        <div v-show="secondShow" style="background:white;">
          <addRevc ref="addRevc" @search="search"></addRevc>
        </div>
        <dialogCommonComponent ref="dialogCommonComponent" title="收货单详情" width="80%">
            <goodsDetailComponent  ref="goodsDetailComponent"></goodsDetailComponent>
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
import addRevc from './addRevc';
import selectForm from '@/components/selectForm.vue';
import breadcrumb from '@/components/breadcrumb.vue';

export default {
  name: '',
  data() {
    return {
      breadcrumbs: ['贸易管理', '收货单管理'],
      queryTerms:{
        "orgName":" 买方或卖方企业名称",
        "entityNo":"收货单单号",
        "TradeRecvgGoods_drDate":"收货日期",
        "TradeRecvgGoods_createTime":"创建日期"
      },
      firstShow:true,
      secondShow:false,
      // 表格数据
      mainTable: {
        tableHeader: {
            entityNo: "收货单单号",
            buyer: "买方名称",
            seller: "卖方名称",
            createTime: '创建日期',
            drDate: "收货日期",
            revcAmount: "收货单总金额",
        },
        tableData: [],
        tableWidth: {
        }
      },
      totalCount: 0, // 数据总数
      page: 1,
      pageSize: 10,
      loading: false,
      searchForm:{}
    };
  },
  components: {
    Table,
    dialogCommonComponent,
    goodsDetailComponent,
    assetView,
    uploadFileComponent,
    relationDialog,
    addRevc,
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
  },
  methods: {
    close() {
      this.$bus.$emit('closeDialog');
    },
    async sure() {
      var vm = this;
      var attachements = this.$refs.uploadFileComponent.getFile();
      var response = await vm.$http.post(`${vm.$apiUrl.addAttach}TRADERECVGGOODS/assetuuid/${this.entityUuid}/addAttach`,attachements)
      if (response.data.status == this.$appConst.status) {
        this.$bus.$emit('closeDialog');
        this.$message.success('附件修改成功');
        this.search(this.searchForm);
      }
    },
    getAttachments(row){
      this.entityUuid = row.entityUuid;
      this.$refs.dialogCommonComponent3.show();
      this.$nextTick(() => {
        this.$refs.uploadFileComponent.init(row);
      });
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
      this.$refs.relationDialog.show(row, 'createRelation', 'TRADERECVGGOODS');
    },
    // 取消关联
    handleCancelRelation(row) {
      this.$refs.relationDialog.show(row, 'cancelRelation', 'TRADERECVGGOODS');
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
        assetType:'TRADERECVGGOODS',
        sortDirection: 'DESC'
      };
      const params = Object.assign({},searchForm,origionParams);
      if(params.TradeRecvgGoods_drDate){
        params.timeInterval = {
          "TradeRecvgGoods_drDate":{
            startDate:params.TradeRecvgGoods_drDate[0],
            endDate : params.TradeRecvgGoods_drDate[1]
          }
        }
      }
      if(params.TradeRecvgGoods_createTime){
        params.timeInterval.TradeRecvgGoods_createTime = {
            startDate:params.TradeRecvgGoods_createTime[0],
            endDate : params.TradeRecvgGoods_createTime[1]
          }
      }
      delete params.TradeRecvgGoods_drDate;
      delete params.TradeRecvgGoods_createTime;
      this.loading = true;
      const url = `${this.$apiUrl.queryContract}`;
      this.$http.post(url,params)
        .then(res => {
          if (res.data.status !== 200) return;
          this.totalCount = res.data.data.totalElements;
          this.mainTable.tableData = res.data.data.content;
          this.mainTable.tableData.map(item => {
            item.revcAmount = this.$appConst.fmoney(item.amount, 2);
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
