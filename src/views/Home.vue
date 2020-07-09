<template>
    <el-container>
        <el-container>
            <el-aside style='width: 220px !important;float:left;background:rgb(0, 78, 145);'>
                <div class="logo">
                    <img src="static/images/logos.png"/>
                </div>
                <sidebar></sidebar>
            </el-aside>
            <el-main style="width:calc(100% - 220px);float:right;overflow:auto;margin-top:56px;">
                <div class="header">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <img class="userIcon" src="static/images/touxiang.png" />
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="'logout'">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import sidebar from '@/components/sideMenu.vue'

    export default {
        name: 'home',
        data () {
            return {
                userName: JSON.parse(sessionStorage.getItem('user')).username,
                orgName: sessionStorage.getItem('orgName'),
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
                    this.$router.push({path:'/login'});
                }
            },
        },
        components: {
            sidebar
        }
    }
</script>
<style lang="scss" scoped>
    .header{
        float:right;
        position: fixed;
        top:0;
        right:40px;
    }
    .supAttachmentsUpload {
        position: relative;

        /deep/.el-upload-dragger {
            display: none;
        }
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
        height: calc(100% - 60px);

        .logo {
            display: flex;
            align-items: center;
            padding: 10px;
            padding-right: 0px;
            height: 50px;
            line-height: 50px;
            box-sizing: border-box;
            img {
                margin-right: 20px;
            }
            span {
                font-weight: 600;
                font-size: 16px;
                color: #9E6B23;
            }
        }

        .header {
            display: flex;
            justify-content: space-between;
            padding-top: 20px;
            height: 86px;
            box-sizing: border-box;

            .searchWrap {
                display: inline-block;
            }

            .el-input /deep/ {
                width: 490px;
                height: 40px;

                .el-input__inner {
                    padding: 0 20px;
                    border: 0;
                    border-radius: 20px;
                }

                .el-input__suffix {
                    right: 14px;
                    font-weight: 600;
                    color: #8C8E90;
                }
            }

            .userIcon {
                margin-top: -10px;
                width: 40px;
                height: 40px;
                cursor: pointer;
                border-radius: 50%;
                box-shadow: 0px 8px 7px 0px rgba(0,0,0,0.1);

                +.el-icon-arrow-down {
                    display: none;
                }
            }
        }

        .el-container {
            // height: 100%;
            height: 100vh;

            .el-aside {
                height: 100%;
                // background-color: #324157;
                user-select: none;
                border-right:1px solid #E5E7EA !important;
            }

            .el-main {
                padding-top: 0;
                height: calc(100% - 60px);
                box-sizing: border-box;
                overflow: unset;
                background-color: #FAFBFF;
            }
        }
    }

    .el-dropdown-menu__item {
        letter-spacing: 0.2em;
    }

    .mainContent.boxShadow {
        box-shadow: unset;
        background: transparent;
        border-bottom-left-radius: 0px;
    }

</style>
