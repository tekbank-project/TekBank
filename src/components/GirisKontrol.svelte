<script>
    async function GirisKontrol() {
        try {
            const response = await fetch(
                "http://localhost:4000/api/kullanici/giriskontrol",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Auth": `Bearer ${localStorage.getItem('token')}`
                    }
                },
            );
            const data = await response.json();
            localStorage.setItem("email", emailInput);
            localStorage.setItem("token", data.token);
            localStorage.setItem("YetkiToken", data.YetkiToken);
            if (response.status === 200) {
                goto("/");
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
        }
    }
    onMount(() => {
        GirisKontrol();
    });
</script>
