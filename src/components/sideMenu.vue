<template>
    <div class="sidebar">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            text-color="#bfcbd9"
            unique-opened
            router
            background-color="#004e91"
            ref='sidebar'
            :default-openeds='openeds'
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
                    <el-menu-item :index="item.index" v-if="item.index !== 'assetSetting'" :key="item.index">
                        <i class="sideBar"></i>
                        <i :class="['sideIcon', 'iconfont', item.icon]"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
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
        }
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
    },
    created() {
        this.handleSetSideItem();  
    }
  }
</script>

<style scoped lang="scss">
.el-menu{
    border-right:none;
}
.el-menu-item.is-active {
    color: #ffc037!important;
}
.sideIcon {
    color:hsla(0,0%,100%,.8)!important;
    font-size: 18px;
    padding-right:12px;
}
.el-submenu .el-menu-item{
    padding-left:55px !important;
}
    // .el-menu-vertical-demo
    // /deep/ .el-menu--inline {
    //     .el-menu-item {
    //         position: relative;
    //         width: auto !important;
    //         font-size: 12px !important;
    //         color: #666 !important;
    //     }
    // }

    // .sideBar {
    //     display: none;
    //     position: absolute;
    //     left: 0;
    //     top: 20px;
    //     width: 4px;
    //     height: 19px;
    //     background: #E59D28;
    // }

    // .el-aside {
    //     position: relative;
    //     background: #fff;
        
    //     .sideIcon {
    //         display: inline-block;
    //         margin-top: -3px;
    //         margin-right: 8px;
    //         font-size: 18px;
    //         color: #B7C2D1 !important;
    //     }

    //     .el-menu-item.is-active /deep/,
    //     .el-menu-item.is-active:hover {
    //         color: #4A3718 !important;
    //         background: #FFF1DB !important;

    //         .sideIcon {
    //             color: #E79C2A !important;
    //         }

    //         .sideBar {
    //             display: block;
    //         }
    //     }

    //     .el-menu-item:hover /deep/ {
    //         color: #E59D28 !important;
    //         background: transparent !important;

    //         .sideIcon {
    //             color: #E79C2A !important;
    //         }
    //     }

    //     .sidebar {
    //         width:100%;
    //         padding-top: 9px;
    //         ul {
    //             border-right:none !important;
    //         }
    //         .sideConfig {
    //             position: absolute;
    //             bottom: 0;
    //             left: 0;
    //             width: 220px;
    //             height: 45px;
    //             border-top: 1px solid #E7EFF7;
    //             text-align: center;
    //             line-height: 45px;
    //             font-size: 14px;
    //             color: #B7C2D1;
    //             cursor: not-allowed;

    //             .iconfont {
    //                 // margin-right: 12px;
    //             }
    //         }
    //         .active, .active:hover {
    //             color: #333;
    //             cursor: pointer;
    //             // .iconfont {
    //             //     color: #228BF7;
    //             // }
    //         }
    //     }
    // }
</style>
