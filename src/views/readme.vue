<template>
    <div>
        <div class="welcome"><span>{{userName}}，</span>欢迎您进入贸易系统</div>
    </div>
</template>
<script>
    import sidebar from '@/components/sideMenu.vue'

    export default {
        name: 'home',
        data () {
            return {
                userName: JSON.parse(sessionStorage.getItem('user')).username,
            }
        },
    }
</script>
<style lang="scss">
    .welcome{
        float: left;
        position: relative;
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
