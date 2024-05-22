<script>
    import "./styles.css";
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
        } else {
            setTimeout(() => {
                goto("/hesap/hesaplarim");
            }, 1);
        }
    });
</script>