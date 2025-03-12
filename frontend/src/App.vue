<template>

    <section>
        <Navbar /><br><br>
        <router-view></router-view><br><br>
        <Footer/>
    </section>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>
