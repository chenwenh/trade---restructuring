<template>
<div style="width:100%;height:100%;">
        <div class="header">
            <img src="static/images/logos2.png" class="logoSrc"/>
            <span class="orgName">{{orgName}}</span>,<label style="color: #2A2A2A;font-size:16px;margin-left:10px;">欢迎您进入贸易系统</label>
            <div style="float:right;margin-right:40px;">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img class="user-logo" src="static/images/touxiang.png">
                        {{userName}}
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-container>
            <div class="el-aside" id="aside">
                <sidebar></sidebar>
            </div>
            <el-main class="el-main">
                <router-view></router-view>
            </el-main>
        </el-container>
</div>
</template>

<script>
    import sidebar from '@/components/sideMenu.vue'

    export default {
        name: 'home',
        data () {
            return {
                isRouterAlive: true,
                visible: true,
                roleType: [], // 当前企业 角色  核心企业  供应商  第三方
                userName: JSON.parse(sessionStorage.getItem('user')).username,
                orgName: JSON.parse(sessionStorage.getItem('user')).orgName,
            }
        },
        computed: {
            currentRouter () {
                return this.router
            },
        },
        watch: {

        },
        methods: {
            handleCommand (command) {
                if (command === 'logout') {
                    sessionStorage.clear()
                    localStorage.clear()
                    // this.$router.push({path:'/login'});
                    window.location.href = `${this.$appConst.loginNavigation}/login?logout=yes`
                }
            },
            
        },
        components: {
            sidebar
        }
    }
</script>
<style lang="scss" scoped>
    .el-aside{
        position: relative;
    }
    .logoSrc{
        border-right: 1px solid #EDEDED;
        position: relative;
        top: 10px;
        padding-right: 34px;
    }
    .header{
        width:100%;
        height:60px;
        background:white;
        img {
            margin-right: 20px;
            margin-left:40px;
        }
        span {
            font-weight: 600;
            font-size: 16px;
            color: #333333;
            font-family: "PingFang-SC-Regular";
        }
        .orgName{
            color: #2A2A2A;
        }

    }
    .el-aside{
        // width: 220px;
        float:left;
        background:rgb(0, 78, 145);
        overflow-x: hidden;
    }
    .el-main{
        width:calc(100% - 220px);
        float:right;
        overflow:auto;
        padding-top:0 !important;
        // background:white;
    }
    .user-logo{
        width:40px;
        height:40px;
        position: relative;
        top:10px;
    }
    .el-menu-item {
        width: 220px;
        text-align: left;
    }

    .el-submenu {
        text-align: left;
    }

    .el-submenu__title {
        width: 220px;
        text-align: left;
    }

    .el-container {
        width: 100%;
        height: calc(100% - 80px);
        margin-top:20px;

        .logo {
            align-items: center;
            padding: 10px;
            padding-right: 0px;
            height: 50px;
            line-height: 50px;
            box-sizing: border-box;
        }

        .header {
            height: 86px;
        }
    }

    .el-dropdown-menu__item {
        letter-spacing: 0.2em;
    }
</style>
