<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <Breadcrumb class="crumbs" separator=">">
                <BreadcrumbItem to="/"><Icon type="android-home"></Icon> 首页</BreadcrumbItem>
                <BreadcrumbItem to="/">会员档案管理</BreadcrumbItem>
                <BreadcrumbItem>健康档案</BreadcrumbItem>
            </Breadcrumb>
            <div class="router-box">
                <transition name="move" mode="out-in"><router-view></router-view></transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        }
    }
</script>
