<template>
    <el-tabs type="border-card" @tab-click="handleTabClick">
            <el-tab-pane label="企业授权" value="data">
                <div class="baseInfo">
                    <el-col :span="4">&nbsp;</el-col>
                    <el-col class="orgInfo" :span="16" style="border: 1px solid #eef1f5; padding: 20px;margin-left:20%;">
                        <div>
                            <protle-title-component>
                                <span>授权企业信息</span>
                            </protle-title-component>
                        </div>
                        <div style="padding: 20px;">
                            <el-row
                                    v-for="item in enterprise"
                                    :key="item.key"
                                    class="enterpriseItem">
                                <el-col :span="5">
                                    <div class="tit">
                                        <el-col v-if="item.key === 'orgFullName'" :span="1" style="color: red;">
                                            *
                                        </el-col>
                                        <el-col v-else :span="1" style="color: red;">
                                            &nbsp;
                                        </el-col>

                                        {{item.item}}：
                                    </div>
                                </el-col>
                                <el-col :span="18">
                                    <div>
                                        <el-input
                                                :disabled="item.key !== 'orgFullName'"
                                                v-model="otherEnterprise[item.key]"
                                                class="elInput"
                                                :key="item.key"
                                                :placeholder="item.key === 'orgFullName'?'请输入企业全称，Enter查询':''"
                                                @change="handleChange($event, item)"
                                                @keyup.enter.native="handleEnter($event, item)"
                                        >
                                        </el-input>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col class="orgInfo" :span="24">&nbsp;</el-col>
                    <div style="clear:both;">

                    </div>
                </div>
                <el-col :span="24" class="btnCenter">
                    <el-button
                            :loading="authBtnLoading"
                            type="primary"
                            size="small"
                            @click="handleAuthEnterprise">
                        授权
                    </el-button>
                </el-col>
            </el-tab-pane>
            <el-tab-pane label="已授权企业" value="enterprise">
                <div class="authorization">
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
                        height2="500">
                    </Table>
                </div>
            </el-tab-pane>
        </el-tabs>
</template>

<script>
import protleTitleComponent from "@/components/protleTitleComponent";
import Table from '@/components/Table.vue';
import mixin from '@/assets/js/mixin.js';
export default {
    mixins: [mixin],
    data() {
        return{
            authBtnLoading:false,
            // 表格数据
            mainTable: {
                tableHeader: {
                    fromOrgName: "所属企业",
                    toOrgName: "授权企业",
                    detailed_orgNameRoleType: "授权企业角色",
                    createTime: "创建时间",
                },
                tableData: [],
                tableWidth: {
                }
            },
            totalCount: 0, // 数据总数
            page: 1,
            pageSize: 10,
            loading: false,
            enterprise: [
                {
                    item: "企业全称",
                    key: "orgFullName",
                    val: ""
                },
                {
                    item: "企业地址",
                    key: "addr",
                    val: ""
                },
                {
                    item: "单位负责人",
                    key: "legalPerson",
                    val: ""
                },
                {
                    item: "统一社会信用码",
                    key: "creditCode",
                    val: ""
                },
            ],
            user: JSON.parse(sessionStorage.getItem('user')),
            otherEnterprise: {orgFullName: "", addr: "", legalPerson: "", creditCode: ""},
        }
    },
    components:{
        protleTitleComponent,
        Table
    },
    methods: {
        handleTabClick (tab) {
            if (tab.label === "已授权企业") {
              this.handleGetTabData();
            }
        },
        handleGetTabData() {
            this.mainTable.tableData = [];
            const params = {
                page: this.page,
                pageSize: this.pageSize
            };
            this.loading = true;
            const url = `${this.$apiUrl.tradeAuthQuery}`;
            this.$http.get(url,{params})
                .then(res => {
                    if (res.data.status !== 200) return;
                    this.totalCount = res.data.data.totalElements;
                    this.mainTable.tableData = res.data.data.content;
                    this.mainTable.tableData.map(item => {
                        item.detailed_orgNameRoleType = this.$appConst.businessRoleTypes[item.authType];
                    });
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                    this.$message.warning(err.message || '服务器错误，请稍后再试!');
                });
        },
        handleChange (e, item) {
            if (item.key !== "orgFullName") {
                return
            } else {
            if (!this.otherEnterprise.orgFullName.length) {
                for (let i in this.otherEnterprise) {
                this.otherEnterprise[i] = ""
                }
            }
            }
        },
        async handleEnter (e, item) {
            if (item.key !== "orgFullName") {
                return
            } else {
                let val = this.otherEnterprise.orgFullName;
                if (val.length) {
                    if (val == this.user.orgName) {
                        this.$message.error("禁止授权给自己")
                    } else {
                       this.otherEnterprise = await this.getOrgInfo({orgName:val});
                       if (Object.keys(this.otherEnterprise).length === 0) {
                           this.$message.error('企业不存在，请重新输入！');
                       }
                    }
                }
            }
        },
        handleAuthEnterprise () {
            let orgName = this.otherEnterprise.orgFullName;
            let orgId = this.otherEnterprise.orgId;
            if (!orgName.length) {
                this.$message.error("企业名称不能为空，请输入")
                return
            }
            if (!orgId || !orgId.length) {
                this.$message.error("企业不存在，请重新输入！")
                return
            }
            let json = {
                authType: "SUPPLIER",
                fromOrgName: this.user.orgName,
                toOrgName: this.otherEnterprise.orgName
            }
            this.handleSaveAuthorization(json);
        },
        // 保存授权企业
        async handleSaveAuthorization (data) {
            let orgId = this.user.orgId;
            let url = `${this.$apiUrl.businessAuthorize}/auth/to/${this.otherEnterprise.orgId}/from/${orgId}`;
            let response = {};
            let params = data;
            this.authBtnLoading = true;
            response = await this.$http.post(url, params);
            if (response.data.status === this.$appConst.status) {
                this.$message.success("企业授权成功！");
                this.authBtnLoading = false;
                for (let i in this.otherEnterprise) {
                    this.otherEnterprise[i] = ""
                }
            } else {
                this.$message.error("企业授权失败，请稍后重试！");
                this.authBtnLoading = false;
            }
        },
        // 分页
        handleCurrentChange(currentPage) {
            this.page = currentPage;
            this.handleGetTabData();
        },
        handleSizeChange(size){
            this.pageSize = size;
            this.page = 1;
            this.$refs.tableRef.resetCurrentPage();
            this.handleGetTabData();
        }
    }
}
</script>

<style>

</style>
