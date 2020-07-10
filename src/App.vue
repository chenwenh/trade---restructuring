<template>
  <div id="app">
    <router-view></router-view>
    <div style="width:100%;height:100%;position:fixed;top:0;left:0;z-index:10;background:rgba(0,0,0,0.6)" v-show="progressShow">
      <el-progress type="circle" :percentage="percentage"  style="position:absolute;left:45%;top:30%;color:green;"></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return{
      progressShow:false,
      percentage:0
    }
  },
  components: {
    
  },
  mounted() {
    const vm = this;
    vm.$bus.$on('showProgress',function(value){
      vm.progressShow = true;
      vm.percentage = value;
    })
    vm.$bus.$on('hideProgress',function(){
      vm.progressShow = false;
    })
  },
}
</script>

<style>
.el-progress__text{
  color:green !important;
  font-size:25px !important;
}
</style>
