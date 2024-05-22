<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    async function CikisYap() {
        var message = "";
        try {
            const response = await fetch(
                "http://localhost:4000/api/kullanici/cikis",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Auth": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        KullaniciEmail: localStorage.getItem("email")
                    })
                },
            );
            const data = await response.json();
            message = data.message;
            localStorage.clear();
            goto("/");
        } catch (error) {
            console.error(error);
        }
        window.alert(message);
    }
    onMount(() => { CikisYap() });
</script>

<h3>Anasayfaya yönlendiriliyorsunuz.</h3>

<style>
    h3 {
        margin: 20px auto 0px auto;
    }
</style>