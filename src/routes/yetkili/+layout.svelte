<script>
    import "../styles.css";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    var eposta;
    var isAuth = true;
    function checkAuth() {
        const token = localStorage.getItem("token");
        if (token === null) { isAuth = false; }
    }
    onMount(() => {
        checkAuth();
        if (!isAuth) {
            setTimeout(() => {
                goto("/kullanici/giris");
            }, 1);
        }
        eposta = localStorage.getItem("email");
    });
</script>

<aside id="sidebar">
    <div id="title">
        <div id="logo"></div>
        <h1 id="name">TekBank</h1>
    </div>
    <div id="userinfo">
        <span id="usermail">{eposta}</span>
    </div>
    <ul id="menu">
        <li class="section-header">Hesap</li>
        <li><a href="/hesap/hesaplarim" class="menu-btn">Hesaplarım</a></li>
        <li><a href="/hesap/yenihesap" class="menu-btn">Yeni Hesap Oluştur</a></li>
        <li class="section-header">İşlemler</li>
        <li><a href="/islem/yenihavale" class="menu-btn">Havale Yap</a></li>
        <li><a href="/islem/islemgecmisi" class="menu-btn">İşlem Geçmişi</a></li>
        <li class="section-header">Seçenekler</li>
        <li><a href="/kullanici/kullaniciduzenle" class="menu-btn">Kullanıcı Güncelle</a></li>
        <li><a href="/yetkili/sube" class="menu-btn">Şube İşlemleri</a></li>
        <li><a href="/kullanici/cikis" class="menu-btn">Çıkış Yap</a></li>
    </ul>
</aside>
<main id="content">
    <slot></slot>
</main>

<style>
    #sidebar {
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        width: 300px;
        min-width: 300px;
        height: 100vh;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        background-color: var(--accent-color);
        color: var(--light-color);
    }

    #title {
        display: flex;
        justify-content: start;
        align-items: center;
        column-gap: 15px;
    }

    #title #logo {
        background-image: url("/logo.jpeg");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        width: 54px;
        height: 54px;
        border-radius: 10px;
    }

    .section-header {
        padding: 15px 0px 5px 0px;
        box-sizing: border-box;
        color: var(--transparent-light-color);
    }

    .section-header:first-child {
        padding: 0px 0px 5px 0px !important;
        box-sizing: border-box;
    }

    #menu {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    #menu li a.menu-btn {
        display: block;
        text-decoration: none;
        background-color: var(--transparent-dark-background);
        color: var(--light-color);
        padding: 10px 20px;
        box-sizing: border-box;
        border-radius: 10px;
        margin-bottom: 5px;
    }

    #userinfo {
        background-color: var(--transparent-dark-background);
        color: var(--light-color);
        border-radius: 10px;
        padding: 10px 20px;
        box-sizing: border-box;
    }

    #usermail {
        color: var(--transparent-light-color);
        font-size: var(--smaller-font-size);
    }

    #content {
        width: calc(100% - 300px);
        min-width: calc(100% - 300px);
        height: 100vh;
        padding: 40px;
        box-sizing: border-box;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    @media only screen and (max-width: 1130px) {
        #content {
            min-width: unset;
            overflow-x: auto;
            align-self: flex-start;
            justify-self: start;
        }
    }
</style>