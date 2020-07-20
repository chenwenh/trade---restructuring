<template>
    <div>
        <div>
            <h3>平台</h3>
            <data-statistics
                :isCursor="!isCursor"
                :content="content2">
            </data-statistics>
            <h3>{{orgName}}</h3>
            <!-- 统计 -->
            <data-statistics
                :isCursor="isCursor"
                :content="content">
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
                var response = await this.$http.get(`${this.$apiUrl.getStatistic}`);
                if (response.data.status == this.$appConst.status){
                    var result = response.data.data;
                    vm.content = result.filter(item=>this.subMenuList.indexOf(item.assetType)!=-1);
                }
                var response2 = await this.$http.get(`${this.$apiUrl.getStatistic}?isEffOrg=false`);
                if (response2.data.status == this.$appConst.status){
                    var result2 = response2.data.data;
                    vm.content2 = result2.filter(item=>this.subMenuList.indexOf(item.assetType)!=-1);
                }
            }
        },
        mounted() {
            var menuList = this.menuList;
            var vm = this;
            menuList[2].subs.map(item=>{
                if(item.index==='/contractQuery'){
                    vm.subMenuList.push('TRADECONTRACT');
                }
                if(item.index==='/orderQuery'){
                    vm.subMenuList.push('TRADEORDER');
                }
                if(item.index==='/invoiceQuery'){
                    vm.subMenuList.push('TRADEINVOICE');
                }
                if(item.index==='/delvgoodsQuery'){
                    vm.subMenuList.push('TRADEDLVRGOODS');
                }
                if(item.index==='/revcgoodsQuery'){
                    vm.subMenuList.push('TRADERECVGGOODS');
                }
                if(item.index==='/settlementQuery'){
                    vm.subMenuList.push('TRADESETTLEMENT');
                }
            });
            this.init();
        },
    }
</script>
<style lang="scss">
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
</style>
