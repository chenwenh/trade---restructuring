<template>
    <div style="background: #FFF; width: 100%; overflow:hidden;">
        <div v-if="dialogVisible" class="f-l">
              <div  class="relationlist"
                      v-for="group in assetTypeOptions"
                      :key="group.label"
                      >
                  <p class="titLabel">{{ group.label }}</p>
                  <p class="texItem"
                          v-for="item in group.options"
                          :key="item.value"
                          :value="item.value"
                          :class="{'liColor': item.active}"
                          @click="sureRelation(item.value)">
                          {{ item.label }}
                  </p>
              </div>
        </div>
        <!-- 创建关联之后的tabs -->
        <div v-if="assetRelationTabsShow" class="f-r" style="margin-top: 20px; position: relative;">
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
                      :selectable="selectable"
                      :loading="loading"
                      :currentPage="page"
                      :pageSize="pageSize"
                      :totalCount="totalCount"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange"
                      :showPagination="true"
                      :height2="height2()">
                </Table>
              </el-tab-pane>
              <el-tab-pane label="属于当前合同（待关联）" name="second">
                  <Table
                        ref="tableRef2"
                        :mainTable="mainTable"
                        :selected="true"
                        :selectable="selectable"
                        :loading="loading"
                        :pageSize="pageSize2"
                        :currentPage="page2"
                        :totalCount="totalCount"
                        @handleSizeChange="handleSizeChange2"
                        @handleCurrentChange="handleCurrentChange2"
                        :showPagination="true"
                        :height2="height2()">
                  </Table>
              </el-tab-pane>
          </el-tabs>
          <div style="position: absolute; bottom: 84px; font-size: 14px; left: 10px;" v-if="nowSelectInvoice.length>0">
              <span>合计：共 <b class="redColor">{{nowSelectInvoice.length}}</b> 条</span>
              <span  style="margin-right: 10px; margin-left: 10px;">共 <b class="redColor">{{$appConst.fmoney(totalAmount, 2)}}</b> 元</span>
          </div>
            <div style="text-align: center;margin: 20px 0">
                <el-button type="warning" @click="handlePrev()">上一步</el-button>
                <el-button type="primary" @click="handleRelateSure('confirm')" class="primaryButton" style="width: 84px;">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Table from '@/components/Table.vue';
import { tabHeader } from './tabHeader.js';

export default {
  name: '',
  data() {
    return {
      totalAmount: 0,
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
        typename: ''
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
        tableHeader: {},
        tableData: [],
        // tableWidth: {}
      },
      totalCount: 0, // 数据总数
      page: 1,
      page2: 1,
      page3: 1,
      pageSize: 10,
      pageSize2: 10,
      pageSize3: 10,
      loading: false,
      text: '', // 关联或者取消关联提示文字
      multipleSectionParams: [], // 关联或取消关联选中的数据uuid
      sendUrl: '' // 关联或取消关联请求的url
    };
  },
  components: {
    Table
  },
    watch: {
    'selectAssetType': function a() {
      const vm = this;
      if (vm.selectAssetType.includes('TRADEDLVRGOODS')) { // 贸易发货单下
        vm.mainTable.tableHeader = tabHeader.delvTabHead;
      } else if (vm.selectAssetType.includes('TRADERECVGGOODS')) { // 贸易收货单下
        vm.mainTable.tableHeader = tabHeader.recvTabHead;
      } else if (vm.selectAssetType.includes('TRADECONTRACT')) { // 合同上
        vm.mainTable.tableHeader = tabHeader.contractTabHead;
      } else if (vm.selectAssetType.includes('TRADEORDER')) { // 订单上
        vm.mainTable.tableHeader = tabHeader.orderTabHead;
      } else if (vm.selectAssetType.includes('TRADESETTLEMENT')) { // 结算单下
        vm.mainTable.tableHeader = tabHeader.settlementTabHead;
      }
    }
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
      // console.log(vm.assetsUidList, vm.nowSelectInvoice, '选中')
      vm.totalAmount = 0;
      vm.nowSelectInvoice.forEach(val => {
        vm.totalAmount += val.amount;
      });
    })
  },
  methods: {
    height2() {
      var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      return height - 370;
    },
    selectable (row) {
      if (row.lockState) {
        return false
      } else {
        return true
      }
    },
    handlePrev() {
      this.nowSelectInvoice = [];
      this.assetRelationTabsShow = false;
      this.dialogVisible = false;
      this.$emit('openTabs', true);
    },
    handleClick(tab) {
      this.activeName = tab.name;
      this.$refs.tableRef.clearSelection();
      this.$refs.tableRef2.clearSelection();
      this.handleCreateRelationGetData(this.nowRelationRow);
    },
    show(row, isCreateRelation, typeParam) {
      this.selectAssetType = '';
      this.nowRelationRow = row;
      this.$emit('openTabs', false); // 隐藏父组件
      this.dialogVisible = true;
      this.assetRelationTabsShow = true;
      this.isCreateOrCancelRelation = isCreateRelation;
      this.nowSelectPatternNode.typename = typeParam;
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
            this.assetTypeOptions[index]["options"] = [];
            if (val.data.status === this.$appConst.status) {
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
                console.log(this.assetTypeOptions, 'assetTypeOptions下拉列表');
                if (this.nowSelectPatternNode.typename === 'TRADESETTLEMENT' && this.isCreateOrCancelRelation === "cancelRelation") {
                  this.assetTypeOptions = this.assetTypeOptions.slice(0, 1);//截取第一个
                } else if (this.nowSelectPatternNode.typename === 'TRADECONTRACT' && this.isCreateOrCancelRelation === "cancelRelation") {
                  this.assetTypeOptions = this.assetTypeOptions.slice(1, 2);
                }
                let defaultSelet = this.assetTypeOptions[0].options;
                if (defaultSelet.length > 0) {
                  this.sureRelation(defaultSelet[0].value);// 默认显示第一条
                }
              }
            }
          })
        }
      }

    },
    sureRelation(val) {
      if (this.assetTypeOptions.length > 0) { // 点击的那行高亮显示
        this.assetTypeOptions.forEach( group => {
          group.options.forEach(item => {
            item.active = false;
            if (val === item.value) {
              item.active = true;
            }
          })
        })
      }
      if (val) {
        this.selectAssetType = val;
        this.handleCreateRelationGetData(this.nowRelationRow);
      } else {
        this.selectAssetType = '';
      }
      this.$emit('openTabs', false); // 隐藏父组件
      this.dialogVisible = true;
      this.assetRelationTabsShow = true;
      // console.log(this.assetTypeOptions, '点击弹框里面确认第一层', this.selectAssetType, '隔开', this.nowRelationRow)
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
          if (res.data.status === this.$appConst.status) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
            this.mainTable.tableData.map(item => {
              if (this.selectAssetType.includes('TRADECONTRACT')) {
                item.businessType = this.$appConst.businessTypes[item.buzType];
                item.cType = this.$appConst.cTypes[item.type];
              } else if (this.selectAssetType.includes('TRADEDLVRGOODS')) {
                item.recvgStatusFlag = item.recvgStatus === 'false' || item.recvgStatus === "FALSE"? '未收货':'收货完成';
              }
            });
          }
        })
        return;
      }

      if (this.activeName === 'first') {
        this.$http.post(autoUrl, params).then(res => {
          this.loading = false;
          if (res.data.status === this.$appConst.status) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
            this.mainTable.tableData.map(item => {
              if (this.selectAssetType.includes('TRADEDLVRGOODS')) {
                item.recvgStatusFlag = item.recvgStatus === 'false' || item.recvgStatus === "FALSE"? '未收货':'收货完成';
              }
            });
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
          if (res.data.status === this.$appConst.status) {
            this.mainTable.tableData = res.data.data.content;
            this.totalCount = res.data.data.totalElements;
            this.mainTable.tableData.map(item => {
              if (this.selectAssetType.includes('TRADEDLVRGOODS')) {
                item.recvgStatusFlag = item.recvgStatus === 'false' || item.recvgStatus === "FALSE"? '未收货':'收货完成';
              }
            });
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
      this.dialogVisible = false;
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
        url = `${this.$apiUrl.assetGraphStart}/${assetGraphUuid}/connect/to/${assetUuid}/${this.nowSelectPatternNode.typename}/from/${targetAssetType}`;
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
      this.multipleSectionParams = params;
      this.sendUrl = url;
      this.handleSaveConfirmData(0);
    },
    // 关联 处理数据
    handleSaveConfirmData (n) {
      console.log(this.multipleSectionParams, 'multipleSectionParams')
      if (this.multipleSectionParams.length) {
        this.$bus.$emit('showProgress',0); 
        this.common(0, this.multipleSectionParams, this.$appConst.everySendNum);
      } else {
        this.$message.warning("至少选择一条，请选择！");
      }
    },
    async common(i,allIds,everyNumber) {
      var vm = this;
      var allNumber = Math.ceil(allIds.length/everyNumber); 
      var everyIds = allIds.slice(i * everyNumber,(i+1) * everyNumber); 
      try{
        let response = await this.$http.post(this.sendUrl,everyIds);
        if(response.data.status == 200) {
          i = i+1;
          vm.$bus.$emit('showProgress',(i/allNumber)*100);
          if (i==allNumber){
            setTimeout(()=> {
              vm.$bus.$emit('hideProgress');
              vm.assetRelationTabsShow = false;
              vm.dialogVisible = false;
              vm.handlRestData();
              vm.$message.success(vm.text + "成功！");
              vm.$emit('openTabs', true);
              // vm.$refs.tableRef.clearSelection();
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
    handlRestData () {
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
.f-l {
  float: left;
  width: 15%;
  max-height: calc(100vh - 166px);
  height: calc(100vh - 166px);
  border-right: 1px solid rgba(225,229,239,1);
    .relationlist {
      .titLabel {
        padding-left: 10px;
        height:27px;
        // width: 48px;
        font-size:12px;
        color:rgba(102,102,102,1);
        line-height:27px;
      }

      .texItem{
        padding-left: 20px;
        color:rgba(51,51,51,1);
        height: 36px;
        line-height:36px;
        cursor: pointer;
      }
    }
}
.f-r {
  float: left;
  margin-left: 0.5%;
  width: 84%;
}
.liColor {
  background:rgba(241,244,245,1);
  box-shadow:0px 1px 0px 0px rgba(0,0,0,0.05);
}
</style>
