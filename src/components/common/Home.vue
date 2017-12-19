<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <v-crumb></v-crumb>
            <div class="router-box">
                <transition name="fade" mode="out-in"><router-view></router-view></transition>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vCrumb from "./Crumb.vue";
export default {
  components: {
    vHead,
    vSidebar,
    vCrumb
  }
};
</script>
