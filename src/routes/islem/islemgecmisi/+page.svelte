<script>
    import { onMount } from "svelte";
    export var islemler = [];
    export async function handleDelete() {
        try {
            const response = await fetch(
                "http://localhost:4000/api/hesap/hesapdetay",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Auth": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: {
                        HesapNo: HesapNo
                    }
                },
            );
            const data = await response.json();
            if (data.Bakiye > 0) {
                alert("Hesabı silmek için bakiyesinin 0 olması gerekmektedir.");
                return;
            }
        } catch (error) {
            console.error(error);
        }
        try {
            const response = await fetch(
                "http://localhost:4000/api/hesap/hesapsil",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Auth": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: {
                        HesapNo: HesapNo
                    }
                },
            );
            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
    }
    export async function handleEdit() {
        
    }
    async function HesaplariYukle() {
        try {
            const response = await fetch(
                "http://localhost:4000/api/islem/islemgecmisi",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Auth": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        KullaniciEmail
                    })
                },
            );
            hesaplar = await response.json();
            console.log(hesaplar);
            if (hesaplar.length === 0) {
                window.alert(
                    "Havale yapmanız için hesabınız bulunması gerekmektedir.",
                );
                return;
            }
        } catch (error) {
            console.error(error);
        }
    }
    onMount(() => { HesaplariYukle() });
</script>

<div id="hesaplar-container">
    <h2>Geçmiş İşlemler</h2>
    <div class="list-row header">
        <div class="list-cell">Gönderen Hesap</div>
        <div class="list-cell">Alıcı Hesap</div>
        <div class="list-cell">Tür</div>
        <div class="list-cell last">Tutar</div>
    </div>
    {#each islemler as islem}
        <div class="list-row">
            <div class="list-cell">{islem.GondericiHesapNo}</div>
            <div class="list-cell">{islem.AliciHesapNo}</div>
            <div class="list-cell">{islem.IslemTuru}</div>
            <div class="list-cell last">{islem.IslemTutari} TL</div>
        </div>
    {/each}
</div>

<style>
    #hesaplar-container {
        width: 750px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    #hesaplar-container h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    #hesaplar-container .list-row {
        display: grid;
        grid-template-columns: 250px 250px 100px 120px;
        align-items: start;
        column-gap: 10px;
        align-items: center;
    }

    #hesaplar-container .list-row.header {
        font-weight: 800;
        border-bottom: solid 1px var(--dark-color);
    }

    .list-cell {
        padding: 5px 0px;
        box-sizing: border-box;
    }

    .list-cell.last {
        display: flex;
        flex-direction: row;
        align-self: center;
        justify-content: end;
        column-gap: 5px;
    }
</style>