<template>
    <div class="addFormClass">
        <br>
        <!-- 合同基本信息 -->
        <el-form :rules="rules" :model="form" ref="form" class="contractInfo" label-width="230px" style="float:left;">
            <div class="portlet-title">
                <div class="caption">
                    <i class="el-icon-edit"></i>
                    <span id="wizard-top" class="caption-subject font-purple bold uppercase">
			        	合同基本信息
			            <span class="step-title"></span></span>
                </div>
            </div>
            <br>
            <div style="margin-left:13%;">
            <!-- 合同类型： -->
            <el-col :span="24" class="elCol" v-if="formItem.indexOf('type')>=0">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item prop="type" label="合同类型：">
                        <el-select class="elSelect" style="width:100%;" @change="handleContractType()"
                                   v-model="form.type" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-col>


            <!-- 我方角色： -->
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item prop="myRoles" label="我方角色：">
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
                </el-col>
            </el-col>

            <!-- 业务类型： -->
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item label="业务类型：" prop="buzType">
                        <el-select class="elSelect" style="width:100%;" v-model="form.buzType" placeholder="请选择">
                            <el-option
                                v-for="item in businessType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-col>
            <!-- 合同编号 -->
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item prop="entityNo" label="合同编号：">
                        <el-input class="elInput serialInput" v-model="form.entityNo"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
            <!-- 合同名称 -->
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item label="合同名称：" prop="name">
                        <el-input class="elInput" v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
            <!-- 客户名称 -->
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item label="客户名称：" prop="clientName">
                        <el-input class="elInput" v-model="form.clientName"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item label="合同金额（元）：" prop="amount">
                        <el-input class="elInput" v-model="form.amount" @blur="handleAmount($event)"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item
                        label="合同签署时间："
                        prop="signingDate">
                        <el-date-picker style="width:100%;" value-format="yyyy-MM-dd" class="elPiker subTime"
                                        v-model="form.signingDate" type="date"
                                       ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-col>
            <!-- 合同约定生效时间 -->
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item label="合同约定生效时间：" prop="startDate">
                        <el-date-picker style="width:100%;" value-format="yyyy-MM-dd" class="elPiker effTime"
                                        v-model="form.startDate" type="date"
                                       ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-col>
            <!-- 合同约定到期时间 -->
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item label="合同约定到期时间：" prop="endDate">
                        <el-date-picker style="width:100%;" value-format="yyyy-MM-dd" class="elPiker expTime"
                                        v-model="form.endDate" type="date"
                                       ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item label="合同内容：" prop="contractContent">
                        <el-input type="textarea" class="elInput" v-model="form.contractContent"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="4">
                    &nbsp;
                </el-col>
                <el-col :span="14">
                    <el-form-item label="备注：" prop="remarks">
                        <el-input type="textarea" class="elInput" v-model="form.remarks"></el-input>
                    </el-form-item>
                </el-col>
            </el-col>

            <div style="clear:both;"></div>
            </div>
        </el-form>
        <!-- 我方合同 -->
        <div class="contractInfo entryInfo" style="width: 48%; float:left;">
            <el-col :span="24" style="margin-bottom:15px;">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="el-icon-edit"></i>
                        <span id="wizard-top" class="caption-subject font-purple bold uppercase">
				        	我方企业信息
				            <span class="step-title"></span></span>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    企业全名：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="myEnterpriseInfo.orgFullName" disabled></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    企业住所：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="myEnterpriseInfo.addr" disabled></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    单位负责人：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="myEnterpriseInfo.legalPerson" disabled></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    统一社会信用码：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="myEnterpriseInfo.creditCode" disabled></el-input>
                </el-col>
            </el-col>


            <div style="clear:both;"></div>
        </div>
        <!-- 对方信息 -->
        <div class="contractInfo entryInfo" style="width:48%; float:right;">
            <el-col :span="24" style="margin-bottom: 15px;">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="el-icon-edit"></i>
                        <span id="wizard-top" class="caption-subject font-purple bold uppercase">
				        	对方企业信息
				            <span class="step-title"></span></span>
                    </div>
                </div>
            </el-col>
            <div>
                <el-col :span="24" class="elCol" v-if="!entryInfoEdit">
                    <el-col class="elLable" :span="7">
                        <i style="color:#ff4949">&nbsp;</i>
                        合同参与方：
                    </el-col>
                    <el-col :span="10" style="position:relative;">
                        <el-input
                            class="elInput otherInfo"
                            v-model="otherEnterpriseInfo.orgFullName"
                            prop="fullName"
                            @keyup.enter.native="handleOtherInfo()">
                        </el-input>
                    </el-col>
                </el-col>

                <el-col :span="24" class="elCol" v-if="entryInfoEdit">
                    <el-col class="elLable" :span="7">
                        <i style="color:#ff4949">*</i>
                        合同参与方：
                    </el-col>
                    <el-col :span="10" style="position:relative;">
                        <el-input
                            class="elInput otherInfo"
                            v-model="otherEnterpriseInfo.orgFullName"
                            prop="fullName"
                            placeholder="请输入企业全称，Enter查询"
                            @keyup.enter.native="handleOtherInfo()">
                        </el-input>
                    </el-col>
                </el-col>
            </div>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    企业住所：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="otherEnterpriseInfo.addr"
                              :disabled="sellInfo==false?true:false"></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    单位负责人：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="otherEnterpriseInfo.legalPerson"
                              :disabled="sellInfo==false?true:false"></el-input>
                </el-col>
            </el-col>
            <el-col :span="24" class="elCol">
                <el-col class="elLable" :span="7">
                    统一社会信用码：
                </el-col>
                <el-col :span="10">
                    <el-input class="elInput" v-model="otherEnterpriseInfo.creditCode"
                              :disabled="sellInfo==false?true:false"></el-input>
                </el-col>
            </el-col>

            <div style="clear:both;"></div>
        </div>
        <div style="clear:both;"></div>
        <div style="text-align:center;">
            <el-button plain size="small" @click="back()">返回</el-button>
            <el-button type="primary" size="small" @click="handleNext('form')">下一步</el-button>
        </div>
    </div>
</template>
<script>
import mixin from '@/assets/js/mixin';
    export default {
        mixins:[mixin],
        data () {
            return {
                submissionTime: "",
                serialList: [],
                // 为表单里面要展示的字段
                formItem:["type",
                "buzType"
                ],
                form: {
                    // type: "", // 合同类型
                    // buzType: "", // 业务类型
                    // otherRole: "",
                    // myRoles: "",
                    // entityNo: "",
                    // clientName: "",//客户名称
                    // name: "", // 合同名称
                    // amount: "0.00",
                    // contractContent: "", // 合同内容
                    // currency: "CNY",
                    // signingDate: "", //合同签署时间
                    // startDate: "", // 合同生效时间
                    // endDate: "", // 合同到期时间
                    // attachments: [
                    //     {"description": "合同文本电子版"},
                    // ],
                    // buyer: "", // 买方
                    // buyerId: "", // 卖方orgId
                    // seller: "", // 卖方
                    // sellerId: "", // 买方orgId
                    remarks: "", //备注
                    contractOrgId: sessionStorage.getItem("orgId"),
                },
                rules: {
                    "type": [
                        {required: true, message: '请输入合同类型！', trigger: 'change', type: "string"}
                    ],
                    "entityNo": [
                        {required: true, message: '请输入合同编号！', trigger: 'blur'}
                    ],
                    "buzType": [
                        {required: true, message: '请输入业务类型！', trigger: 'change'}
                    ],
                    "name": [
                        {required: true, message: '请输入合同名称！', trigger: 'blur'}
                    ],
                    "amount": [
                        {required: true, message: '请输入合同金额！', trigger: 'blur'},
                        {pattern: /^\d{1,3}(,?\d{3})*(\.\d{1,2})?$/g, message: '金额格式不正确'}
                    ],
                    "dataEffectiveParticipant": [
                        {required: true, message: '请输入合同有效方！', trigger: 'change'}
                    ],
                    "signingDate": [
                        {required: true, message: '请输入合同签署时间！', trigger: 'blur'},
                    ],
                    "startDate": [
                        {required: true, message: '请输入合同约定生效时间！', trigger: 'blur'},
                    ],
                    "endDate": [
                        {required: true, message: '请输入合同约定到期时间！', trigger: 'blur'}
                    ],
                    "contractContent": [
                        {required: true, message: '请输入合同内容！', trigger: 'blur'}
                    ],
                    "fullName": [
                        {required: true, message: '请输入合同参与方！', trigger: 'blur'}
                    ],
                    "myRoles": [
                        {required: true, message: '请输入我方角色！', trigger: 'change', type: "string"}
                    ]
                },
                myEnterpriseInfo: {
                    id: "",
                    addr: "",
                    orgId: "",
                    orgFullName: "",
                    legalPerson: "",
                    creditCode: "",
                },
                otherEnterpriseInfo: {
                    id: "",
                    orgId: "",
                    orgFullName: "",
                    addr: "",
                    legalPerson: "",
                    creditCode: ""
                },
                options: [
                    {
                        value: 'SALE',
                        label: '销售合同'
                    },
                    {
                        value: 'PURCHASE',
                        label: '采购合同'
                    },
                    {
                        value: 'SALE_SINGLE_PARTY',
                        label: '单方提交销售合同'
                    }, {
                        value: 'PURCHASE_SINGLE_PARTY',
                        label: '单方提交采购合同'
                    }
                ],
                businessType: [
                    {
                        value: 'FIRST_GOODS_AFTER_MONEY',
                        label: '先货后款'
                    },
                    {
                        value: 'FIRST_MONEY_AFTER_GOODS',
                        label: '先款后货'
                    },
                    {
                        value: 'FIRST_GOODS_AFTER_MONEY_PLEDGE_PURCHASE',
                        label: '先货后款质押采购'
                    }, {
                        value: 'FIRST_MONEY_AFTER_GOODS_PLEDGE_PURCHASE',
                        label: '先款后或质押销售'
                    }
                ],
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
                contractParticipant: [],
                sellInfo: false,
                entryInfoEdit: true,
                orgName: sessionStorage.getItem("orgName"),
                orgId: sessionStorage.getItem("orgId"),
                user: JSON.parse(sessionStorage.getItem('user')),
                flag:'add',//代表添加还是编辑
            }
        },
        computed: {

        },
        methods: {
            back() {
                this.$bus.$emit('back');
                this.$refs.form.resetFields();
            },
            async init(flag,row) {
                this.flag = flag;
                if (flag == 'edit') {
                    this.form = row;
                    if(this.form.sellerId === this.user.orgId) {
                        this.form.myRoles = 'SELLER';
                    }
                    this.otherEnterpriseInfo = await this.getOrgInfo({orgId:this.form.buyerId});
                }
                // 获取我方企业信息
                this.myEnterpriseInfo = await this.getOrgInfo({orgId:this.user.orgId});
            },
            // 合同类型变化时会关系到是否需要对方企业信息
            handleContractType () {
                let type = this.form.type;
                if (type === "SALE" || type === "SALE_SINGLE_PARTY") {
                    this.form.otherRole = "BUYER";
                    if (type === "SALE") {
                        this.sellInfo = false;
                        this.entryInfoEdit = true;
                    } else {
                        this.sellInfo = true;
                        this.entryInfoEdit = false;
                    }
                } else if (type === "PURCHASE" || type === "PURCHASE_SINGLE_PARTY") {
                    this.form.otherRole = "SELLER";
                    if (type === "PURCHASE_SINGLE_PARTY" || type === "PURCHASE_SINGLE_PARTY") {
                        this.sellInfo = true;
                        this.entryInfoEdit = false;
                    } else {
                        this.sellInfo = false;
                        this.entryInfoEdit = true;
                    }
                }
                this.handleEmptyOtherInfo()
            },
            // 清空对方企业信息
            handleEmptyOtherInfo () {
                Object.keys(this.otherEnterpriseInfo).forEach(key => {
                    this.otherEnterpriseInfo[key] = ""
                })
            },
            async handleOtherInfo () {
                let fullName = this.otherEnterpriseInfo.orgFullName;
                let myFullName = this.myEnterpriseInfo.orgFullName;
                if (fullName !== myFullName) {
                    this.otherEnterpriseInfo = await this.getOrgInfo({orgName:fullName});
                } else {
                    this.$message.error("与我方信息相同，请重新填写！");
                }
            },
            async handleNext (form) {
                // 保存买卖双方名称 id
                this.$refs.form.validate(async (valid) => {
                    if (!valid) {
                        this.$message.error("您有必填项未填或填写有误！")
                    }else{
                        if(this.entryInfoEdit && !this.otherEnterpriseInfo.orgId){
                            this.$message.error('对方企业信息合同参与方不能为空');
                            return;
                        }
                        await this.handleSellBuyOrgName();
                        this.$emit("contractStep", this.form);
                    }
                })
            },
            handleSellBuyOrgName () {
                // 对方为卖方
                if (this.form.otherRole === "SELLER") {
                    this.form.buyerSignedTime = this.form.signingDate;
                } else {
                    this.form.sellerId = this.myEnterpriseInfo.orgId;
                }
                if (this.form.myRoles === "BUYER") {
                    this.form.buyer = this.myEnterpriseInfo.orgFullName;
                    this.form.buyerId = this.myEnterpriseInfo.orgId;
                    this.form.seller = this.otherEnterpriseInfo.orgFullName;
                    this.form.sellerId = this.otherEnterpriseInfo.orgId;
                } else {
                    this.form.buyer = this.otherEnterpriseInfo.orgFullName;
                    this.form.buyerId = this.otherEnterpriseInfo.orgId;
                    this.form.seller = this.myEnterpriseInfo.orgFullName;
                    this.form.sellerId = this.myEnterpriseInfo.orgId;
                }
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
           
        },
        destroy () {
           
        },
    }
</script>
<style scoped>
</style>
