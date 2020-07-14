<template>
	<div>
		<el-table 
			ref="multipleTable" 
			tooltip-effect="dark" 
			border
			stripe 
			class="detailEntry"
			:data="tabData"
			>
			<el-table-column fixed type="index" width="65" center >
		    </el-table-column>

		    <el-table-column 
		    	v-for="(item, key) in formItem" 
		    	:prop="key" 
		    	:column-key="key" 
		    	:label="item" 
		    	align="center" 
		    	:key="key" 
		    	:show-overflow-tooltip="true" 
		    	>
		    	<template slot="header" slot-scope="scope">
			        <div  v-if="key == 'quantity'|| key == 'unitPrice'|| key == 'taxRate'" class="table-head" style="width: 100%;">
			        	<i style="color: #f56c6c;">*</i>
			        	{{item}}
			        </div>
			        <div v-else>
			        	{{item}}
			        </div>
			    </template>
		    	<template slot-scope="scope">
  					<el-input
  						v-if="key !== 'currency'" 
  						v-model="scope.row[key]"
  						class="editInput"
  						:keyVal="key"
  					    :index="scope.$index"
  						:val="scope.row[key]"
  						@blur="handleDetailBlur($event, scope.row, key, scope.$index)"
  						>
  					</el-input>
  					<span v-else>
  						{{scope.row[key]}}
  					</span>
			    </template>
		    </el-table-column>

		     <el-table-column
		      	fixed="right"
		      	label="操作"
		      	width="120">
			    <template slot-scope="scope">
			        <el-button
			        	type="success"
			          	size="mini"
			          	@click.native.prevent="handleDeleteRow(scope.$index, key)">
			          	删除
			        </el-button>
			    </template>
		    </el-table-column>
		</el-table> 
		
		<!-- 合计 -->
		<div style="float:right;margin-top:20px;overflow:hidden;width:100%;">
            <el-col :span="18">&nbsp;</el-col>
            <el-col :span="6" style="line-height: 36px;float:right;">
                <el-col :span="3">
                    <span class="elInput">合计：</span>
                </el-col>
                <el-col :span="8">共 <span class="elInput">{{num}}</span>条</el-col>
                <el-col :span="12">共<span style="width:70%; padding:0; display:inline-block; border-bottom:1px solid #ccc;text-indent:10px;" class="elInput">{{amount}}</span>
                    元
                </el-col>
            </el-col>
        </div>

			<el-button 
				type="warning" 
				size="mini" @click="handleDetailAdd()">
				添加
			</el-button>

        <div style="text-align:center;">
            <el-button plain size="small" @click="close()">取消</el-button>
            <el-button type="primary" size="small" @click="sure()">确认</el-button>
        </div>
	</div>
</template>
<script>
	export default {
		props: [],
		data() {
			return {
                amount:'',
                tabData:[],
				refEle: [],
                formItem:{
                    skuId: "货品编号",
                    goodsName: "货品名称",
                    remarks: "货品描述",
                    spec: "商品规格",
                    quantity: "数量",
                    unit: "单位",
                    manufacturer: "制造商",
                    unitPrice: "单价",
                    taxRate: "税率(%)",
                    totalAmount: "货品合计（元）"
                }
			}
		},
        computed:{
            num() {
                return this.tabData.length;
            }
        },
		methods: {
            close() {
                this.$bus.$emit('closeDialog');
            },
			sure() {
                if (!this.handleValidateAll())return;
                this.$emit('getGoods',this.tabData);
                this.$bus.$emit('closeDialog');
            },
       		// 添加行
       		handleDetailAdd() {
                var json = {};
                for(var key in this.formItem){
                    json[key] = '';
                }
       			this.tabData.push(json);
       		},
       		// 删除 行
       		handleDeleteRow(index) {
       			this.tabData.splice(index,1);
       		},
       		// target
       		handleDetailBlur(event, row, key, index) {
       			this.refEle = $(event.target);
       			if(key === "quantity" || key === "unitPrice" || key === "taxRate") {
       				let val = event.target.value;
       				this.handleValidate(event.target.value, this.refEle, index)
       			}
                this.amount = 0;
                for(var i =0;i<this.tabData.length;i++){
                    this.amount+= this.tabData[i].quantity * this.tabData[i].unitPrice;
                }          
       		},
       		handleValidate(val, ele, index) {
       			if(!isNaN(Number(val)) && val) {
       				$(ele).css("border-color", "#dcdfe6");
       				return true
       			}else if(isNaN(Number(val)) && val) {
       				$(ele).css("border-color", "#f56c6c")
       				this.$message.error("只能填写数字，请重新输入！");
       				return false;
       			}else if(!val) {
       				$(ele).css("border-color", "#f56c6c")
       				this.$message.error("此项为必填项，请重新输入！");
       				return false
       			}
       		},
            handleValidateAll() {
                var flag = true;
                for(var i =0;i<this.tabData.length;i++){
                    if(!this.tabData[i]['quantity'] ||　isNaN(Number(this.tabData[i]['quantity']))) {
                        $('.detailEntry input').eq(4+i*10).css("border-color", "#f56c6c");
                        flag = false;
                        return flag;
                    }
                    if(!this.tabData[i]['unitPrice'] ||　isNaN(Number(this.tabData[i]['unitPrice']))) {
                        $('.detailEntry input').eq(7+i*10).css("border-color", "#f56c6c");
                        flag = false;
                        return flag;
                    }
                    if(!this.tabData[i]['taxRate'] ||　isNaN(Number(this.tabData[i]['taxRate']))) {
                        $('.detailEntry input').eq(8+i*10).css("border-color", "#f56c6c");
                        flag = false;
                        return flag;
                    }
                }
                return flag;
            }
		},
		mounted() {
			
		},
		components: {
			
		}
	}
</script>