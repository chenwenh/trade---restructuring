<template>
    <div class="sidebar">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            :text-color="textColor"
            unique-opened
            router
            :background-color="backgroundColor"
            ref='sidebar'
            @open="handleOpen"
            :default-openeds='openeds'
            :collapse="isCollapse"
        >
            <template v-for="item in menuList">
                <template v-if="item.subs.length">
                    <el-submenu :index="item.index" :key="item.index" v-if="item.subs.length">
                        <template slot="title">
                            <i class="sideBar"></i>
                            <i :class="['sideIcon', 'iconfont', item.icon]"></i>
                            {{ item.title }}
                        </template>
                        <div>
                            <el-menu-item
                              v-for="subItem in item.subs"
                              :key="subItem.index"
                              :index="subItem.index">
                                <i class="sideBar"></i>
                                {{
                                  subItem.title
                                }}
                            </el-menu-item>
                        </div>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" v-if="item.index !== 'assetSetting'" :key="item.index" class="noSub">
                        <i class="sideBar"></i>
                        <i :class="['sideIcon', 'iconfont', item.icon]"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
        <div id="fixedIcon">
            <el-tooltip class="item" effect="dark" content="点击收起侧导航" placement="right">
                <i class="el-icon-s-fold" v-show="!isCollapse" style="cursor:pointer;font-size:20px;" @click="foldClick"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="点击展开侧导航" placement="right">
                <i class="el-icon-s-unfold" v-show="isCollapse" style="cursor:pointer;font-size:20px;" @click="foldClick"></i>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-prototype-builtins */

import menuList from './menu.js'
import {mapMutations} from 'vuex'
  export default {
    name: 'sideBar',
    data () {
        return {
            isCollapse:false,
            menuList:[],
            openeds: [],
            roleType: [], // 当前企业 角色  核心企业  供应商  第三方
            orgId: sessionStorage.getItem("orgId"),
            nowBusinessScenarios: ''
        }
    },
    computed: {
        activeIndex () {
            return this.$route.path;
        },
        textColor() {
            if(currentCssStyle != 'defaultStyle'){
                return "#bfcbd9";
            }
        },
        backgroundColor() {
            if(currentCssStyle == 'defaultStyle'){
                return "white";
            }else{
                return "#004e91";
            }
        },
    },
    watch: {
    },
    methods: {
        ...mapMutations(['SET_MENULIST']),
        // 获取企业信息
        // async handleGetOrgInfo() {
        //     let url = `${this.$apiUrl.getOrgInfoByOrgId}${this.orgId}`
        //     let response = await this.$http.get(url);
        //     if(response.data.status === this.$appConst.status) {
        //         let arr = response.data.data;
        //         if(arr.length) {
        //             arr.map(val => {
        //                 this.roleType.push(val.orgRole)
        //             })
        //             this.nowBusinessScenarios = arr[0]["businessScenario"];
        //         }else{
        //             this.roleType.push("THIRD_PARTY_ENTERPRISE")
        //             this.nowBusinessScenarios = "THIRD_PARTY_ENTERPRISE"
        //         }
        //         sessionStorage.setItem("nowBusinessScenarios", this.nowBusinessScenarios)
        //         sessionStorage.setItem("authorizationRoleType", JSON.stringify(this.roleType))
        //         this.handleSetSideItem()
        //     }
        // },
        handleOpen(key) {
          var vm = this;
          this.menuList.forEach((item) =>{
            if(item.index == key){
              var isrouter = item.subs[0].index
              vm.$refs['sidebar'].activeIndex = isrouter;
              vm.$router.push({"path": isrouter});
            }
          })
        },
        foldClick() {
            this.isCollapse = !this.isCollapse;
            if(this.isCollapse){
                $('#aside').animate({"width":"51px !important;"},1000);
                $('#fixedIcon').animate({"width":"50px"},100);
            }else{
                setTimeout(() => {
                    $('#fixedIcon').animate({"width":"200px"},0);
                },500);
            }
        },
        // 匹配菜单
        handleSetSideItem() {
            this.menuList = JSON.parse(JSON.stringify(menuList));
            let roleType = JSON.parse(sessionStorage.getItem("authorizationRoleType")); // 核心企业  供应商  第三方
            let nowBusinessScenarios = this.$appConst.nowBusinessScenarios; // 当前用户简称
            let userRolesIsManager = sessionStorage.getItem("userRolesIsManager"); // 当前用户 是否是 企业管理员
            menuList.map((val, index) => {
                if(val.hasOwnProperty("subs")) {
                    this.menuList[index].subs = [];
                    let children = [...val.subs];
                    if (children && children.length > 0) {
                        for(let i=0; i< children.length; i++) {
                            let item = children[i]
                            let isHasEnterprise = item.hasOwnProperty("enterprise");
                            let isHasAuthRole = item.hasOwnProperty("authRole");
                            let isHasUserRole = item.hasOwnProperty("userRole");
                            // 不含 场景/授权/角色 限制
                            if(!isHasEnterprise && !isHasAuthRole && !isHasUserRole) {
                                this.menuList[index].subs.push(item)
                            }
                            // 包含场景/授权限制  不含角色限制
                            if(isHasEnterprise && isHasAuthRole && !isHasUserRole) {
                                let isHasnowBusinessScenarios = item["enterprise"].includes(nowBusinessScenarios)
                                let isHasNowAuthRole = false;
                                // 判断当前登录企业 授权角色  路由中是否可含有权限
                                roleType.map(v => {
                                    let arr = item["authRole"].filter(auth => auth === v)
                                    if(arr && arr.length) {
                                        isHasNowAuthRole = true
                                    }
                                })
                                if(item["path"] !== "/createAssetLinkageMap") {
                                    if(isHasnowBusinessScenarios && isHasNowAuthRole) {
                                        this.menuList[index].subs.push(item)
                                    }
                                }
                            }
                            // 包含 场景/授权/用户角色限制
                            if(isHasEnterprise && isHasAuthRole && isHasUserRole) {
                                let isHasnowBusinessScenarios = item["enterprise"].includes(nowBusinessScenarios)
                                // eslint-disable-next-line no-unused-vars
                                let isHasNowAuthRole = false;
                                // 判断当前登录企业 授权角色  路由中是否可含有权限
                                roleType.map(v => {
                                    let arr = item["authRole"].filter(auth => auth === v)
                                    if(arr && arr.length) {
                                        isHasNowAuthRole = true
                                    }
                                })
                                // 是当前业务场景 含授权角色 是企业管理员
                                if(isHasnowBusinessScenarios && userRolesIsManager === "true") {
                                    this.menuList[index].subs.push(item)
                                }
                            }
                        }
                    }
                }
            });
            this.SET_MENULIST(this.menuList);
        }
    },
    mounted () {
        $('#aside').css({"width":"220px !important"});
        $('#fixedIcon').css({"width":"200px"});
    },
    created() {
        this.handleSetSideItem();  
    }
  }
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.el-menu{
    border-right:none;
}
.el-menu-item.is-active {
    color: #ffc037;
}
.sideIcon {
    // color:hsla(0,0%,100%,.8)!important;
    font-size: 18px;
    padding-right:12px;
}
.el-submenu .el-menu-item{
    padding-left:55px !important;
}
#fixedIcon{
    position:fixed;
    background:white;
    height:40px;
    justify-content: center;
    align-items: center;
    display: flex;
    bottom:0;
}
</style>
