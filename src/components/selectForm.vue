<template>
<div>
    <el-form :inline="true" class="demo-form-inline searchIconp" size="medium">
            <el-form-item>
                <el-select v-model="queryTerm" placeholder="查询条件">
                    <el-option v-for="(val,key) in queryTerms" :key="key" :label="val" :value="key" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="queryTerm && queryTerm.indexOf('Date')!=-1 || queryTerm.indexOf('Time')!=-1">
                <el-date-picker
                    v-model="selectTerms[queryTerm]"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-else-if="queryTerm&&queryTerm.indexOf('amount')!=-1">
                <el-input type="number" v-model="selectTerms['minAmount']" placeholder="最低金额"  style="width:120px;"></el-input>
                <span style="margin-left:25px;margin-right:20px;"> —— </span>
                <el-input type="number"  v-model="selectTerms['maxAmount']" placeholder="最高金额"  style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item v-else-if="queryTerm">
                <el-input v-model="selectTerms[queryTerm]" :placeholder="queryTerms[queryTerm]" clearable=""></el-input>
            </el-form-item>
            <el-form-item style="margin-right:0;">
                <el-button class="primaryButton" @click="query" >查询</el-button>
                <el-tag
                    v-for="(tag,index) in dynamicTags"
                    :key="index"
                    closable
                    type="warning"
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag.name}}
            </el-tag>
            </el-form-item>
        </el-form>
</div>
</template>

<script>
export default {
    props:['queryTerms'],
    data(){
        return{
            queryTerm:"",
            selectTerms:{},
            dynamicTags: []
        }
    },
    watch:{
      'selectTerms.TradeContract_amount':{
        deep:true,
        handler:function(newV,oldV){
          return this.selectTerms.minAmount +　this.selectTerms.maxAmount;
        }
      }
    },
    methods:{
        handleClose(tag) {
            var vm = this;
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            var type = tag.type;
            vm.selectTerms[type] = "";
            //如果参数值为空，则不传递。
            if(type=='TradeContract_amount'){
                delete vm.selectTerms.minAmount;
                delete vm.selectTerms.maxAmount;
            }
            for(var param in vm.selectTerms){
                if(vm.selectTerms[param]==""){
                    delete vm.selectTerms[param];
                }
            }
            if(JSON.stringify(vm.selectTerms) === "{}"){
                vm.queryTerm = "";
            }
            vm.$emit("search",vm.selectTerms);
        },
        query(){
            var vm = this;
            var label = vm.queryTerms[vm.queryTerm];
            vm.commonOperation(vm.dynamicTags,vm.queryTerm,label);
            //如果参数值为空，则不传递。
            for(var param in vm.selectTerms){
                if(!vm.selectTerms[param]){
                    delete vm.selectTerms[param];
                }
            }
            if( Object.keys(vm.selectTerms).length != 0 ){
                vm.$emit("search",vm.selectTerms);
            }else {
                vm.$message.warning("查询内容不能为空！");
            }
        },
        getLabel(type){
            var vm = this;
            for(var i = 0;i<vm.status.length;i++){
                if(vm.status[i].value==type){
                    return vm.status[i].label;
                }
            }
        },
        commonOperation(arr,type,name){
            var vm = this;
            var label = "";
            label = vm.selectTerms[type];
            if(!vm.selectTerms[type]){
                label = "";
            }
            if (type==='TradeContract_amount') {
                label = this.selectTerms.minAmount +　'-' + this.selectTerms.maxAmount;            
            }
            if(vm.judgeIsHave(arr,type)){
                arr.find(function(item){
                    if(item.type==type){
                        item.name = name+": "+label;
                    }
                })
            }else{
                if(label != "") {
                    vm.dynamicTags.push({name:name+': '+label,type:type});
                }
            }
        },
        judgeIsHave(arr,type){
            //判断一个数组的对象是否含有某个属性。
            if(arr.filter(item => item['type']===type).length !== 0){
                //存在该属性值为type的。
                return true;
            }else{
                //不存在该属性值为type的。
                return false;
            }
        },
    }
}
</script>

<style scoped>
.el-tag{
    margin-left:10px;
}
</style>
