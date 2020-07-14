<template>
    <div>
        <div  v-show="firstShow">
        <!-- 表格 -->
         <el-button style="margin-bottom:20px;"
                type="primary"
                icon="el-icon-plus"
                @click="handleAddAsset()">
            添加
        </el-button>
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
                        style="margin-left:0px; "
                        @click="details(scope.row)">
                        详情
                    </el-button>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                             <el-button
                                icon="el-icon-share"
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
                                  icon="el-icon-share"
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
        <!-- 添加发货单 -->
        <div v-show="secondShow" style="background:white;">
          <addDelv ref="addDelv" @search="search"></addDelv>
        </div>
        <dialogCommonComponent ref="dialogCommonComponent" title="发货详情" width="80%">
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
              <el-button type="primary" size="small" @click="sure">确定</el-button>
            </div>  
        </dialogCommonComponent>
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import goodsDetailComponent from './goodsDetailComponent';
import assetView from '@/components/assetView';
import uploadFileComponent from '@/components/uploadFileComponent';
import addDelv from './addDelv';

export default {
  name: '',
  data() {
    return {
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
      loading: false
    };
  },
  components: {
    Table,
    dialogCommonComponent,
    goodsDetailComponent,
    assetView,
    addDelv,
    uploadFileComponent
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
        this.search();
      }
    },
    handleAddAsset() {
      this.firstShow = false;
      this.secondShow = true;
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
    // 搜索
    search(searchData) {
      this.mainTable.tableData = [];
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        orgId:sessionStorage.getItem('orgId'),
        assetType:'TRADEDLVRGOODS',
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
