<template>
    <div>
        <div style="background:white;padding-bottom:50px;">
            <div style="margin-bottom:50px;padding-top:20px;">
                <span :class="{'active':currentShow}" class="spanName" @click="currentClick">{{orgName}}<label v-show="currentShow"></label></span>
                <span :class="{'active':!currentShow}" class="spanName" @click="currentClick">平台<label v-show="!currentShow"></label></span>
            </div>
            <!-- 统计 -->
            <data-statistics
                v-show="currentShow"
                :isCursor="isCursor"
                :content="content">
            </data-statistics>
            <data-statistics
                v-show="!currentShow"
                :isCursor="!isCursor"
                :content="content2">
            </data-statistics>
        </div>
    </div>
</template>
<script>
    import dataStatistics from "@/components/dataStatistics";
    import{mapState} from 'vuex';

    export default {
        name: 'home',
        data () {
            return {
                currentShow:true,
                isCursor:true,
                content:[],
                content2:[],
                orgName:JSON.parse(sessionStorage.getItem('user')).orgName,
                userName: JSON.parse(sessionStorage.getItem('user')).username,
                subMenuList:[]
            }
        },
        computed: {
            ...mapState(['menuList'])
        },
        components: {
            dataStatistics
        },
        methods: {
            async init() {
                var vm = this;
                if(this.currentShow){
                    var response = await this.$http.get(`${this.$apiUrl.getStatistic}`);
                    if (response.data.status == this.$appConst.status){
                        var result = response.data.data;
                        vm.content = result.filter(item=>this.subMenuList.indexOf(item.assetType)!=-1);
                    }
                    return;
                }
                var response2 = await this.$http.get(`${this.$apiUrl.getStatistic}?isEffOrg=false`);
                if (response2.data.status == this.$appConst.status){
                    var result2 = response2.data.data;
                    vm.content2 = result2.filter(item=>this.subMenuList.indexOf(item.assetType)!=-1);
                }
            },
            currentClick() {
                this.currentShow = !this.currentShow;
                this.init();
            }
        },
        mounted() {
            var menuList = this.menuList;
            var vm = this;
            menuList[2].subs.map(item=>{
                if(item.index==='/contractQuery'){
                    vm.subMenuList.push('TRADECONTRACT');
                }
                if(item.index.indexOf('TRADEORDER')!=-1){
                    vm.subMenuList.push('TRADEORDER');
                }
                if(item.index==='/invoiceQuery'){
                    vm.subMenuList.push('TRADEINVOICE');
                }
                if(item.index.indexOf('TRADEDLVRGOODS')!=-1){
                    vm.subMenuList.push('TRADEDLVRGOODS');
                }
                if(item.index.indexOf('TRADERECVGGOODS')!=-1){
                    vm.subMenuList.push('TRADERECVGGOODS');
                }
                if(item.index.indexOf('TRADESETTLEMENT')!=-1){
                    vm.subMenuList.push('TRADESETTLEMENT');
                }
            });
            this.init();
        },
    }
</script>
<style lang="scss" scoped>
    .welcome{
        top: 30px;
        left: 3px;
        color: #666666;
        font-size: 16px;
        font-weight: 500;
        span{
            color: #333333;
            font-weight: 600;
        }
    }
    .spanName{
        font-size: 18px;
        letter-spacing: 0;
        margin-right:20px;
        margin-left:20px;
        color: #999999;
        cursor: pointer;
        position: relative;
    }
    .spanName label{
        position: absolute;
        width: 30px;
        height: 4px;
        color: #FF5701;
        background: #FF5701;
        left: 50%;
        margin-left:-13px;
        bottom: -6px;
    }
    .spanName.active{
        color: #333333;
        font-weight: bold;
    }
</style>
