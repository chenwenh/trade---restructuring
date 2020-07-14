<template>
    <div class="addFormClass">
        <br>
        <!-- 合同基本信息 -->
        <el-form :rules="rules" :model="form" ref="form" class="contractInfo" label-width="230px" style="float:left;">
            <div class="portlet-title">
                <div class="caption">
                    <i class="el-icon-edit"></i>
                    <span id="wizard-top" class="caption-subject font-purple bold uppercase">
                        添加结算单
                    <span class="step-title"></span></span>
                </div>
            </div>
            <br>
            <div style="margin-left:13%;">
                <el-col :span="24" class="elCol" v-for="(value,key) in formItem" :key="key">
                    <el-col class="elLable" :span="4">
                        &nbsp;
                    </el-col>
                    <el-col :span="14">
                        <el-form-item :label="value" :prop="key" v-if="key=='startDate'||key==='endDate'||key==='settleDate'">
                            <el-date-picker style="width:100%;" value-format="yyyy-MM-dd" class="elPiker expTime"
                                            v-model="form[key]" type="date" @change="change($event)"
                                        ></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="myRoles" label="我方角色：" v-else-if="key==='myRoleType'">
                            <el-select class="elSelect" style="width:100%;" @change="handleContractType()"
                                    v-model="form.myRoles" placeholder="请选择">
                                <el-option
                                    v-for="item in rolesOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="value" :prop="key" v-else-if="key==='settlePrice'||key==='totalAmount'||key==='paidAmount'||key==='balanceAmount'">
                            <el-input type="text" class="elInput" v-model="form[key]"  @blur="handleAmount($event,key)" @change="change($event)"></el-input>
                        </el-form-item>
                        <el-form-item label="明细录入" v-else-if="key==='detailEntry'">
							<el-tag v-show="form.goods.length>0">已录</el-tag>
							<el-button type="warning" size="mini"  @click="handleDetailEntry()">
								明细录入
							</el-button>
                        </el-form-item>
                        <el-form-item :label="value" :prop="key" v-else>
                            <el-input type="text" class="elInput" v-model="form[key]" @change="change($event)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <div style="clear:both;"></div>
            </div>
        </el-form>
        <div style="clear:both;"></div>
        <div class="contractInfo attachment" style="padding-bottom:30px;">
            <uploadFileComponent ref="uploadFileComponent" title="添加附件"></uploadFileComponent>
        </div>
        <div style="text-align:center;">
            <el-button plain size="small" @click="back()">返回</el-button>
            <el-button type="primary" size="small" @click="handleNext('form')">确定</el-button>
        </div>
        <!-- 查看合同详情 -->
        <dialogCommonComponent ref="dialogCommonComponent" title="明细录入" width="80%">
            <detailEntry ref="detailEntry" @getGoods="getGoods"></detailEntry>
        </dialogCommonComponent>
    </div>
</template>
<script>
import mixin from '@/assets/js/mixin';
import uploadFileComponent from '@/components/uploadFileComponent';
import dialogCommonComponent from '@/components/dialogCommonComponent';
import detailEntry from '@/components/detailEntry';
    export default {
        mixins:[mixin],
        data () {
            return {
                submissionTime: "",
                serialList: [],
                // 为表单里面要展示的字段
                formItem:{
                    entityNo: "结算单单号",
                    name: "结算单名称",
                    settlePrice: "结算单价",
                    totalAmount: "结算单总金额",
                    paidAmount: "结算单支付金额",
                    balanceAmount: "余额",
                    startDate: "结算开始日期",
                    endDate: "结算结束日期",
                    settleDate: "结算日期",
                    myRoleType: "我方角色",
                    buyer: "买方名称",
                    seller: "卖方名称",
                    settleCompany: "结算单位",
                    detailEntry: "明细录入",
                },
                form: {
                    goods:[]
                },
                rules: {
                    "name": [
                        {required: true, message: '请输入结算单名称！', trigger: 'blur'}
                    ],
                    "settlePrice": [
                        {required: true, message: '请输入结算单价！', trigger: 'blur'},
                        {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    ],
                    "totalAmount": [
                        {required: true, message: '请输入结算单总金额！', trigger: 'blur'},
                        {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    ],
                    "paidAmount": [
                        {required: true, message: '请输入结算单支付金额！', trigger: 'blur'},
                        {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    ],
                    "balanceAmount": [
                        {required: true, message: '请输入余额！', trigger: 'blur'},
                        {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    ],
                    "buyer": [
                        {required: true, message: '请输入买方名称！', trigger: 'blur'}
                    ],
                    "seller": [
                        {required: true, message: '请输入卖方名称！', trigger: 'blur'}
                    ],
                    "settleCompany": [
                        {required: true, message: '请输入结算单位！', trigger: 'blur'}
                    ],
                    "startDate": [
                        {required: true, message: '请输入结算开始日期！', trigger: 'blur'},
                    ],
                    "endDate": [
                        {required: true, message: '请输入结算结束日期！', trigger: 'blur'},
                    ],
                    "settleDate": [
                        {required: true, message: '请输入结算日期！', trigger: 'blur'},
                    ],
                    "myRoles": [
                        {required: true, message: '请输入我方角色！', trigger: 'change', type: "string"}
                    ],
                },
                rolesOptions: [
                    {
                        value: 'BUYER',
                        label: '买方'
                    },
                    {
                        value: 'SELLER',
                        label: '卖方'
                    }
                ],
                orgName: sessionStorage.getItem("orgName"),
                orgId: sessionStorage.getItem("orgId"),
                user: JSON.parse(sessionStorage.getItem('user'))
            }
        },
        computed: {

        },
        components: {
            uploadFileComponent,
            dialogCommonComponent,
            detailEntry
        },
        methods: {
            getGoods(value) {
                this.form.goods = value;
            },
            // 明细录入弹出框
            handleDetailEntry() {
                this.$refs.dialogCommonComponent.show();
            },
            change() {
                this.$forceUpdate();
            },
            back() {
                this.$bus.$emit('back');
                this.$refs.form.resetFields();
                this.$refs.uploadFileComponent.resetFileList();
            },
            // 我方角色变化时会关系到是否需要对方企业信息
            handleContractType () {
                this.$forceUpdate();
                let type = this.form.myRoles;
                if (type === "SELLER") {
                    this.form.seller = this.user.orgName;
                    this.form.buyer = '';
                    this.form.sellerId = this.user.orgId;
                }else{
                    this.form.buyer = this.user.orgName;
                    this.form.seller = '';
                    this.form.buyerId = this.user.orgId;
                }
            },
            async handleNext () {
                const vm = this;
                this.$refs.form.validate(async (valid) => {
                    if (!valid) {
                        this.$message.error("您有必填项未填或填写有误！")
                    }else{
                        var params = Object.assign({},vm.form);
                        params["@class"] = "com.evisible.trade.core.domain.entity.TradeSettlement";
                        params.attachments = vm.$refs.uploadFileComponent.getFile();
                        var response = await vm.$http.post(`${vm.$apiUrl.saveAsset.settlement}`,params);
                        if(response.data.status === vm.$appConst.status) {
                            vm.$message.success('添加成功');
                            vm.back();
                            vm.$emit('search');
                        }
                    }
                })
            },
            // 金额格式
            handleAmount (event,key) {
                let val = event.target.value;
                if (val) {
                    if (val.indexOf(".") === -1) {
                        val = val + ".00"
                    }
                    this.form[key] = this.$appConst.fmoney(val, 2)
                }
            },
        },
        mounted () {
           
        }
    }
</script>
<style>
    .attachment .upload-demo{
        width:60%;
        margin:0 auto;
    }

</style>
