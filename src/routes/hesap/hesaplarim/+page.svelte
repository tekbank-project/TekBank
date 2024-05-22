<script>
    import { onMount } from "svelte";
    export var hesaplar = [];
    export async function handleDelete() {
        try {
            const response = await fetch(
                "http://localhost:4000/api/hesap/hesapdetay",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Auth: `Bearer ${localStorage.getItem("token")}`,
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
                        Auth: `Bearer ${localStorage.getItem("token")}`,
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
                "http://localhost:4000/api/hesap/tumhesaplar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Auth: `Bearer ${localStorage.getItem("token")}`,
                    },
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
    <h2>Hesaplarım</h2>
    <div class="list-row header">
        <div class="list-cell">Hesap Adı</div>
        <div class="list-cell">Hesap No</div>
        <div class="list-cell">Hesap Bakiyesi</div>
        <div class="list-cell last">Seçenekler</div>
    </div>
    {#each hesaplar as hesap}
        <div class="list-row">
            <div class="list-cell">{hesap.HesapAdi}</div>
            <div class="list-cell">{hesap.HesapNo}</div>
            <div class="list-cell">{hesap.Bakiye} TL</div>
            <div class="list-cell last">
                <button on:submit|preventDefault={handleEdit}>Düzenle</button>
                <button on:submit|preventDefault={handleDelete}>Sil</button>
            </div>
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
        grid-template-columns: 165px 165px 165px 225px;
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

    button {
        width: fit-content;
        height: 34px;
        background-color: var(--accent-color);
        padding: 5px 10px;
        box-sizing: border-box;
        border: 0px;
        border-radius: 5px;
        color: var(--light-color);
        font-family: var(--font-family);
        font-size: var(--font-size);
        line-height: var(--line-height);
        letter-spacing: var(--letter-spacing);
    }
</style>