<template>
	<div>
		<el-col :span="24" >
			<el-col  
				:span="6" 
				v-for="(item, index) in content" 
				:key="item.id" 
				style="padding: 10px; box-sizing: border-box;">
				<el-card shadow="always" >
					<div style="display:flex;" >
						<div style="width: 100px; text-align:center; line-height: 53px;">
	                        <div 
	                        	:class="index%3===1?'counter-content-one':index%3===2?'counter-content-two':'counter-content-tree'" class="counter-content">
		                        <i class="el-icon-s-grid" style="font-size:30px;color:#974621;"></i>
	                        </div>
	                    </div>
				      	<div 
						  	:class="{cursor:isCursor}"
				      		style="flex: 1; position:relative;"
				      		@click="handleClick(item.assetType)">
				      		<h4>{{$appConst.dataType[item.assetType]}}：</h4>
					      	<div class="showData">
					      		合计：{{item.totalNum}} 条
					      	</div>
					      	<div class="showData">
					      		合计：{{item.totalAmount | MoneyFormat}} 元
					      	</div>
				      	</div>
					</div>
			    </el-card>
			</el-col>
		</el-col>
	</div>
</template>
<script>
    export default {
    	props: ['content','isCursor'],
    	data() {
    		return {}
    	},
        watch: {
        },
       	methods: {
            handleClick(type) {
				if(!this.isShow)return;
            	let assetType = type.replace("TRADE", "").toLowerCase()
            	let router = "/search" + assetType.substring(0, 1).toUpperCase() + assetType.substring(1)
            	console.log(router, type)
            	this.$router.push(router)
            }
        },
        mounted(){
			
        },
    }
</script>
<style scoped>
	.icon{
		color: #974621;
	}
	.cursor{
		cursor: pointer;
	}
	.dataRight {
		margin-left:20px; 
		height:400px;
	}
	.counter-content {
		width: 45px;
		height: 45px;
		border: 15px solid #ccc;
		border-bottom-color: #fff;
		border-radius: 50%;
	}
	.counter-content-one {
		border-color: #4d9fcf;
		border-bottom-color: #fff;
	}
	.counter-content-two {
		border-color: #AA7A53;
		border-bottom-color: #fff;
	}
	.counter-content-tree {
		border-color: #36c6d3;
		border-bottom-color: #fff;
	}
	.icon:nth-child(odd) {
		color: #974621;
	}
	.showData {
		font-size: 14px;
		margin-top: 3px;
	}
</style>
