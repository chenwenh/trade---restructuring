<template>
    <div class="addFormClass">
        <br>
        <!-- 合同基本信息 -->
        <el-form :rules="rules" :model="form" ref="form" class="contractInfo" label-width="120px" style="float:left;">
            <!-- <div class="portlet-title">
                <div class="caption">
                    <i class="el-icon-edit"></i>
                    <span id="wizard-top" class="caption-subject font-purple bold uppercase">
			        	添加订单
			        <span class="step-title"></span></span>
                </div>
            </div>
            <br> -->
            <div>
                <el-col :span="24" class="elCol" v-for="(value,key) in formItem" :key="key">
                    <el-col :span="22">
                        <el-form-item :label="value" :prop="key" v-if="key=='startDate'||key==='endDate'||key==='inputDate'">
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
                        <el-form-item :label="value" :prop="key" v-else-if="key==='amount'">
                            <el-input type="text" class="elInput" v-model="form[key]"  @blur="handleAmount($event)" @change="change($event)"></el-input>
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
            <uploadFileComponent ref="uploadFileComponent" title="添加附件" titleShow="false"></uploadFileComponent>
        </div>
        <div style="text-align:center;padding-bottom:20px;">
            <!-- <el-button plain size="small" @click="back()">返回</el-button> -->
            <el-button type="primary" size="small" class="primaryButton" @click="handleNext('form')" style="width:300px;height:40px;">确定</el-button>
        </div>
    </div>
</template>
<script>
import mixin from '@/assets/js/mixin';
import uploadFileComponent from '@/components/uploadFileComponent';
    export default {
        mixins:[mixin],
        data () {
            return {
                submissionTime: "",
                serialList: [],
                // 为表单里面要展示的字段
                formItem:{
                    name: "订单名称",
                    entityNo: "订单单号",
                    deliveryType: "订单类型",
                    amount: "订单金额",
                    myRoleType: "我方角色",
                    buyer: "买方名称",
                    orderAddress: "订单地址",
                    unloadAddress: "下货地址",
                    seller: "卖方名称",
                    clientName: "客户名称",
                    startDate: "订单发起日期",
                    endDate: "订单结束日期",
                    inputDate: "订单录入日期",
                    remarks: "备注"
                },
                form: {},
                rules: {
                    "entityNo": [
                        {required: true, message: '请输入订单单号！', trigger: 'blur'}
                    ],
                    "name": [
                        {required: true, message: '请输入订单名称！', trigger: 'blur'}
                    ],
                    "buyer": [
                        {required: true, message: '请输入买方名称！', trigger: 'blur'}
                    ],
                    "orderAddress": [
                        {required: true, message: '请输入订单地址！', trigger: 'blur'}
                    ],
                    "seller": [
                        {required: true, message: '请输入卖方名称！', trigger: 'blur'}
                    ],
                    "amount": [
                        {required: true, message: '请输入订单金额！', trigger: 'blur'},
                        {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    ],
                    "signingDate": [
                        {required: true, message: '请输入合同签署时间！', trigger: 'blur'},
                    ],
                    "startDate": [
                        {required: true, message: '请输入订单发起日期！', trigger: 'blur'},
                    ],
                    "endDate": [
                        {required: true, message: '请输入订单结束日期！', trigger: 'blur'}
                    ],
                    "inputDate": [
                        {required: true, message: '请输入订单结束日期！', trigger: 'blur'}
                    ],
                    "myRoles": [
                        {required: true, message: '请输入我方角色！', trigger: 'change', type: "string"}
                    ]
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
            uploadFileComponent
        },
        methods: {
            change() {
                this.$forceUpdate();
            },
            back() {
                this.$bus.$emit('addClose');
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
            async handleNext (form) {
                const vm = this;
                this.$refs.form.validate(async (valid) => {
                    if (!valid) {
                        this.$message.error("您有必填项未填或填写有误！")
                    }else{
                        var params = Object.assign({},vm.form);
                        params["@class"] = "com.evisible.trade.core.domain.entity.TradeOrder";
                        params.attachments = vm.$refs.uploadFileComponent.getFile();
                        var response = await vm.$http.post(`${vm.$apiUrl.saveAsset.order}`,params);
                        if(response.data.status === vm.$appConst.status) {
                            vm.$message.success('添加成功');
                            vm.back();
                            vm.$emit('search');
                        }
                    }
                })
            },
            // 金额格式
            handleAmount (event) {
                let val = event.target.value;
                if (val) {
                    if (val.indexOf(".") === -1) {
                        val = val + ".00"
                    }
                    this.form.amount = this.$appConst.fmoney(val, 2)
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
