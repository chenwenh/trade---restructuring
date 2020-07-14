<template>
    <div>
        <el-dialog v-dialogDrag top="3vh" :title="title" :close-on-click-modal="false" :append-to-body="true"
                    :visible.sync="dialogVisible"
                    :before-close="close" width="30%">
          <div>
            <i class="el-icon-info" style="font-size: 16px;">
                请选择关联资产类型
            </i>
            <el-select
                    v-model="selectAssetType"
                    placeholder="请选择资产类型"
                    style="width: 100%; margin-top: 15px;">
                <!-- v-if="group && group.options.length" -->
                <el-option-group
                        v-for="group in assetTypeOptions"
                        :key="group.label"
                        :label="group.label">
                    <el-option
                            v-for="item in group.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-option-group>
            </el-select>
            <div style="margin-top:20px; margin-left: 35%;">
              <el-button plain @click="close()" size="medium">取消</el-button>
              <el-button type="primary" @click="sure('confirm')" size="medium">确定</el-button>
            </div>
          </div>
        </el-dialog>

        <!-- 创建关联之后的tabs -->
        <div v-if="assetRelationTabsShow" style="margin-top: 50px;">
          <Table
                v-if="selectAssetType==='TRADECONTRACT*up'|| isCreateOrCancelRelation === 'cancelRelation'"
                ref="tableRef3"
                :mainTable="mainTable"
                :selected="true"
                :selectable="selectable"
                :loading="loading"
                :currentPage="page3"
                :pageSize="pageSize3"
                :totalCount="totalCount"
                @handleSizeChange="handleSizeChange3"
                @handleCurrentChange="handleCurrentChange3"
                :showPagination="true">
          </Table>
          <el-tabs v-model="activeName"
              v-else
              class="m-t-50 m-b-102"
              @tab-click="handleClick">
              <!-- <el-tab-pane style="display:inline-block;width;50px;"></el-tab-pane> -->
              <el-tab-pane label="不属于当前合同（待关联）" name="first">
                <Table
                      ref="tableRef"
                      :mainTable="mainTable"
                      :selected="true"
                      :loading="loading"
                      :currentPage="page"
                      :pageSize="pageSize"
                      :totalCount="totalCount"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange"
                      :showPagination="true">
                </Table>
              </el-tab-pane>
              <el-tab-pane label="属于当前合同（待关联）" name="second">
                  <Table
                        ref="tableRef2"
                        :mainTable="mainTable"
                        :selected="true"
                        :loading="loading"
                        :pageSize="pageSize2"
                        :currentPage="page2"
                        :totalCount="totalCount"
                        @handleSizeChange="handleSizeChange2"
                        @handleCurrentChange="handleCurrentChange2"
                        :showPagination="true">
                  </Table>
              </el-tab-pane>
          </el-tabs>
            <div style="text-align: center;margin: 20px 0">
                <el-button type="warning" @click="handlePrev()">上一步</el-button>
                <el-button type="primary" @click="handleRelateSure('confirm')">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Table from '@/components/Table.vue';

export default {
  name: '',
  data() {
    return {
      isCreateOrCancelRelation: '',
      nowSelectInvoice: [],
      assetsUidList: [],
      isDisabled: true,
      activeName: 'first',
      assetRelationTabsShow: false,
      assetGraphUuid: '',
      nowRelationRow: '',
      dialogVisible: false,
      title: '',
      nowSelectPatternNode:{
        // patternGraphUuid:"46a255fc-a682-4726-bdf1-1b66058a3a0e",
        typename: 'TRADEORDER'
      },
      selectAssetType: '',
      assetTypeOptions: [
        {
          label: '上游资产',
          options: []
        },
        {
          label: '下游资产',
          options: []
        }
      ],
      // 表格数据
      mainTable: {
        tableHeader: {
		      name: "发货单名称",
		      entityNo: "发货单单号",
		      amount: "发货单总金额",
		      seller: "卖方名称",
		      buyer: "买方名称",
		      recvgStatusFlag: "收货状态",
		      drDate: "发货日期"
        },
        tableData: [],
        // tableWidth: {
        //   name: "150",
        //   entityNo: "150",
        //   amount: "150",
        //   seller: "120",
        //   buyer: "120",
        //   recvgStatusFlag: "100",
		    //   drDate: "100"
        // }
      },
      totalCount: 0, // 数据总数
      page: 1,
      page2: 1,
      page3: 1,
      pageSize: 10,
      pageSize2: 10,
      pageSize3: 10,
      loading: false,
      nowSendIndex: 0, // 当前发送第几次
      totalSendNum: 0, // 总共需要发送多少次
      text: '', // 关联或者取消关联提示文字
      multipleSectionParams: [], // 关联或取消关联选中的数据uuid
      sendUrl: '' // 关联或取消关联请求的url
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
      // nowSelectInvoice为选中的行的所有数据。
      vm.assetsUidList = value1;
      vm.nowSelectInvoice = value2;
      console.log(vm.assetsUidList, vm.nowSelectInvoice, '选中')
    })
  },
  methods: {
    selectable (row) {
      if (row.lockState) {
        return false
      } else {
        return true
      }
    },
    handlePrev() {
      this.$emit('openTabs', true);
      this.assetRelationTabsShow = false;
    },
    handleClick(tab) {
      this.activeName = tab.name;
      this.$refs.tableRef.clearSelection();
      this.$refs.tableRef2.clearSelection();
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    close() {
      this.dialogVisible = false;
    },
    show(row, isCreateRelation) {
      this.nowRelationRow = row;
      this.dialogVisible = true;
      this.isCreateOrCancelRelation = isCreateRelation;
      this.init(row);
    },
    async init(row) {
      const assetGraphUuid2 = row.graphUuid;
      this.assetGraphUuid = assetGraphUuid2;
      const url = `${this.$apiUrl.getAssetGraphUuid}${assetGraphUuid2}/get`;
      const res = await this.$http.get(url);
      const patternGraphUuid = res.data.data.graphUuid;
      const downUrl = `${this.$apiUrl.getDownStreamAllAssetType}${patternGraphUuid}/${this.nowSelectPatternNode.typename}`;
      const upUrl = `${this.$apiUrl.getUpStreamAllAssetType}${patternGraphUuid}/${this.nowSelectPatternNode.typename}`;
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      let response = [];
      if (this.isCreateOrCancelRelation === "cancelRelation") {
        this.title = '取消关联';
        this.assetTypeOptions = [
          {
            label: '上游资产',
            options: []
          },
          {
            label: '下游资产',
            options: []
          }
        ];
        response = await this.$axiosTools.all([this.$http.get(upUrl), this.$http.get(downUrl)]);
        this.loading.close();
      } else {
        this.title = '创建关联';
        response = await this.$axiosTools.all([this.$http.get(downUrl)]);
        this.loading.close();
        this.assetTypeOptions = [
          //  {
          //   label: '上游资产',
          //   options: []
          // },
          {
            label: '下游资产',
            options: []
          }
        ];
      }

      if (response) {
        console.log(response, 'downUrl返回值');
        if (response && response.length) {
          response.map((val, index) => {
            this.assetTypeOptions[index]["options"] = []
            if (val.data.status === 200) {
              if (val.data.data && val.data.data.length) {
                let data = val.data.data
                let isUpOrDown = "";
                if (this.assetTypeOptions.length == 2) {
                  index === 0 ? isUpOrDown = "up" : isUpOrDown = "down"
                } else {
                  isUpOrDown = "down";
                }
                data.map(v => {
                  this.assetTypeOptions[index]["options"].push({
                    value: v + "*" + isUpOrDown,
                    label: this.$appConst.dataType[v]
                  })
                })
                console.log(this.assetTypeOptions, 'assetTypeOptions下拉列表')
              }
            }
          })
        }
      }

    },
    sure (isConfirm) {
      // console.log(isConfirm, '点击弹框里面确认第一层', this.selectAssetType, '隔开', this.nowRelationRow)
      if (isConfirm && this.selectAssetType.length) {
        this.handleCreateRelationGetData(this.nowRelationRow);
        this.dialogVisible = false;
        this.$emit('openTabs', false); // 隐藏父组件
        this.assetRelationTabsShow = true;
      } else this.selectAssetType = '';
      this.dialogVisible = false;
    },
    // 创建关联  获取上一节点资产数据
    async handleCreateRelationGetData (row, nowNum) {
      this.nowRelationRow = row
      let assetGraphUuid = this.assetGraphUuid
      let patternNodeUuid = this.nowRelationRow.entityUuid
      let isConnect = false
      let assetType = this.selectAssetType.split('*')[0]
      let params = {
        assetType: assetType,
        page: this.page,
        pageSize: this.pageSize
      }
      if (this.isCreateOrCancelRelation === 'cancelRelation') {
        isConnect = true
      }

      let url = `${this.$apiUrl.assetStart}/${isConnect}/patternGraph/${assetGraphUuid}/node/${patternNodeUuid}/queryUpNoRelatedAssets`
      let autoUrl = this.$apiUrl.queryAssetNoGraph;
      if (this.selectAssetType.split("*")[1] === "down") {
        url = `${this.$apiUrl.assetStart}/${isConnect}/patternGraph/${assetGraphUuid}/node/${patternNodeUuid}/queryDownNoRelatedAssets`
      }
      this.mainTable.tableData = [];
      this.loading = true;
      if (this.isCreateOrCancelRelation === 'cancelRelation') {
        params = {
          assetType: assetType,
          page: this.page3,
          pageSize: this.pageSize3
        }
        this.$http.post(url, params).then(res => {
          this.loading = false;
          if (res.data.status === 200) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
          }
        })
        return;
      }

      if (this.activeName === 'first') {
        this.$http.post(autoUrl, params).then(res => {
          this.loading = false;
          if (res.data.status === 200) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
            // console.log('99999999999999999999993', this.mainTable)
          }
        })
      } else {
        params = {
          assetType: assetType,
          page: this.page2,
          pageSize: this.pageSize2
        }
        this.$http.post(url, params).then(res => {
          this.loading = false;
          if (res.data.status === 200) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
          }
        })
      }
    },
    // 关联
    handleRelateSure (isConfirm) {
      if (isConfirm === "confirm" && this.nowSelectInvoice.length>0) {
        this.handleSaveOrCancelRelation();
        // this.handleSetSaveData();
        return
      } else if (isConfirm === "confirm" && !this.nowSelectInvoice.length) {
        this.$message.warning('至少选择一条数据！');
        return
      } else this.selectAssetType = '';
      this.assetRelationTabsShow = false;
      this.$emit('openTabs', true);
    },
    // 资产关联 or 取消关联
    async handleSaveOrCancelRelation () {
      let assetGraphUuid = this.assetGraphUuid;
      let assetUuid = this.nowRelationRow.entityUuid;
      let sourceAssetType = '';
      let targetAssetType = '';
      let url = '';
      let isDown = this.selectAssetType.split("*")[1];
      console.log(isDown, "isDown", this.selectAssetType);
      if (isDown === 'down') {
        targetAssetType = this.selectAssetType.replace('*down', '');
        url = `${this.$apiUrl.assetConnectStart}/${assetGraphUuid}/from/${assetUuid}/${this.nowSelectPatternNode.typename}/to/${targetAssetType}`; // 向下关联
      }
      if (isDown !== "down" && isDown) { // 向上关联
        targetAssetType = this.selectAssetType.replace('*up', '');
        url = `${this.$$apiUrl.assetGraphStart}/${assetGraphUuid}/connect/to/${assetUuid}/${this.nowSelectPatternNode.typename}/from/${targetAssetType}`;
      }
      this.text = "关联";
      let params = [];
      if (this.nowSelectInvoice && this.nowSelectInvoice.length) {
        this.nowSelectInvoice.map(val => {
          params.push(val.entityUuid);
        })
      } else {
        // this.dialogRelateShow = false
        return
      }
      // 取消关联
      if (this.isCreateOrCancelRelation === "cancelRelation") {
        if (this.selectAssetType.indexOf('up') > -1) {
          [params[0], assetUuid] = [assetUuid, params[0]];
        }
        url = `${this.$apiUrl.assetGraphStart}/${assetGraphUuid}/disconnect/from/${assetUuid}/to`;
        this.text = "取消关联";
      }
      // 合同关联订单
      // if (this.relationAsset === "relationOrder") {
      //   sourceAssetType = 'TRADECONTRACT'
      //   targetAssetType = 'TRADEORDER'
      //   // let orderPatternNodeUuid = this.patternNodes.filter(v => v.nodeType.typeName === "TRADEORDER")[0]["uuid"]
      //   url = `/graph/asset-connect/${assetGraphUuid}/from/${assetUuid}/${sourceAssetType}/to/${targetAssetType}` // 向下关联
      // }
      let totalLength = params.length; // 总条数
      this.totalSendNum = Math.ceil(totalLength / this.$appConst.everySendNum); // 总共发送多少次
      this.multipleSectionParams = params;
      this.sendUrl = url;
      // this.handleFullScreenLoadingShow()
      this.handleSaveConfirmData(0);
    },
    // 关联 处理数据
    handleSaveConfirmData (n) {
      console.log(this.multipleSectionParams, 'multipleSectionParams')
      if (this.multipleSectionParams.length) {
        let start = n * this.$appConst.everySendNum;
        let end = (n + 1) * this.$appConst.everySendNum;
        let sendArr = [];
        sendArr = this.multipleSectionParams.slice(start, end);
        console.log(sendArr, 'sendArr2222');
        if (sendArr.length) {
          this.handleSendRelationData(sendArr);
        } else {
          // let tit = "完成100%，即将刷新请稍候……"
          let tit = '';
          this.assetRelationTabsShow = false;
          // this.handleLoadingTitText(tit)
          // this.handleFullScreenLoadingShow()
          // this.handleInit(tit)
          this.handlRestData();
        }
      } else {
        this.$message.warning("至少选择一条，请选择！");
      }
    },
    async handleSendRelationData (sendArr) {
      let vm = this;
      // this.$store.commit("SET_BATCH_STATUS", true);
      const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
      });
      let response = await this.$http.post(this.sendUrl, sendArr);
      loading.close();
      if (response.data.status === 200) {
        vm.nowSendIndex++;
        this.assetRelationTabsShow = false;
        this.handlRestData();
        this.$message.success(this.text + "成功！");
        this.$emit('openTabs', true);

        // if (vm.nowSendIndex < vm.totalSendNum) {
        //   let num = Math.floor((vm.nowSendIndex / vm.totalSendNum) * 100);
        //   let tit = `完成${num}%，请稍候……`;
        //   // vm.handleLoadingTitText(tit)
        //   vm.handleSaveConfirmData(vm.nowSendIndex);
        // } else {
        //   console.log('zou')
        //   // let tit = '完成100%，即将刷新请稍候……'
        //   let tit = '';
        //   let isNeedFlush = 0;
        //   this.assetRelationTabsShow = false;
        //   // this.handleInit(tit, isNeedFlush)
        //   this.handlRestData();
        //   this.$message.success(this.text + "成功！");
        //   this.$emit('openTabs', true);
        // }
      } else {
        let tit = `请求失败，请稍后重试！`;
        let isNeedFlush = 0;
        // this.handleInit(tit, isNeedFlush)
        // this.$store.commit("SET_BATCH_STATUS", false)
      }
    },
    handlRestData () {
      this.totalSendNum = 0;
      this.nowSendIndex = 0;
      this.multipleSectionParams = [];
      this.sendUrl = '';
      this.nowSelectInvoice = [];
      this.selectAssetType = '';
      // this.$store.commit("SET_BATCH_STATUS", false)
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.$refs.tableRef.resetCurrentPage();
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    // 分页
    handleCurrentChange2(currentPage) {
      this.page2 = currentPage;
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    handleSizeChange2(size) {
      this.pageSize2 = size;
      this.page2 = 1;
      this.$refs.tableRef2.resetCurrentPage();
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    handleCurrentChange3(currentPage) {
      this.page3 = currentPage;
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    handleSizeChange3(size) {
      this.pageSize3 = size;
      this.page3 = 1;
      this.$refs.tableRef3.resetCurrentPage();
      this.handleCreateRelationGetData(this.nowRelationRow);
    }
  }
};
/* eslint-enable */
</script>

<style lang="scss" scoped>

</style>
