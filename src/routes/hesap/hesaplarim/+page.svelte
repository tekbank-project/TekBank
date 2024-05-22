<script>
    import { onMount } from "svelte";
    let gondericihesapinput = "";
    let alicihesapnoinput = "";
    let miktarinput = "";
    export var hesaplar = [];
    export async function handleSubmit(event) {
        event.preventDefault();
        if (!gondericihesapinput || !alicihesapnoinput || !miktarinput) {
            alert("Lütfen formu eksiksiz doldurunuz.");
            return;
        }
        try {
            const response = await fetch(
                "http://localhost:4000/api/hesap/hesapkontrol",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Auth: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: {
                        HesapNo: alicihesapnoinput,
                    },
                },
            );
            hesaplar = await response.json();
            if (response.status === 404) {
                alert("Gönderici hesabı bulunamadı.");
                return;
            }
        } catch (error) {
            console.error(error);
        }
    }
    export async function handleDelete(event) {
        event.preventDefault();
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
    onMount(async () => {
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
    });
</script>

<div id="hesaplar-container">
    <h2>Hesaplarım</h2>
    <div class="list-row header">
        <div class="list-cell">Hesap No</div>
        <div class="list-cell">Hesap Bakiyesi</div>
        <div class="list-cell last">Seçenekler</div>
    </div>
    {#each hesaplar as hesap}
        <div class="list-row">
            <div class="list-cell">{hesap.HesapNo}</div>
            <div class="list-cell">{hesap.Bakiye} TL</div>
            <div class="list-cell last">
                <button on:submit={handleDelete}>Hesabı Sil</button>
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
        grid-template-columns: 290px 290px 150px;
        align-items: start;
        column-gap: 10px;
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
    }
</style>