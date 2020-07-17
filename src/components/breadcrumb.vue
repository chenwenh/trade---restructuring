<template>
    <el-breadcrumb class="box" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: "",
    props: ['breadcrumbList'],
    data() {
        return {
          breadcrumbs: []
        }
    },
    components: {},
    methods: {},
    created() {
      this.breadcrumbs = this.breadcrumbList;
    }
}
</script>

<style lang="scss" scoped>
  .box {
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);
    height: 44px;
    line-height: 44px;
    margin: 15px 0 18px;
    padding-left: 15px;
    color: #343957;
  }
  .active {
    color: #333333;
    font-weight: Medium;
  }
</style>
