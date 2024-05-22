<script>
    import { onMount } from "svelte";

    let gondericihesapinput = "";
    let alicihesapnoinput = "";
    let miktarinput = "";
    export var hesaplar = [];
    export async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:4000/api/hesap/hesapkontrol",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Auth: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        HesapNo: alicihesapnoinput,
                    }),
                },
            );
            hesaplar = await response.json();
            if (response.status === 404) {
                window.alert("Gönderici hesabı bulunamadı.");
                return;
            }
            var message = "";
            const havale = await fetch(
                "http://localhost:4000/api/islem/yenihavale",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Auth: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        senderemail: gondericihesapinput,
                        receiverhesapno: alicihesapnoinput,
                        islemtutar: miktarinput,
                    }),
                },
            );
            const data = await havale.json();
            message = havale;
        } catch (error) {
            console.error(error);
        }
        window.alert(message);
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
            if (hesaplar.length === 0) {
                window.alert(
                    "Havale yapmanız için hesabınız bulunması gerekmektedir.",
                );
                throw new Error();
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

<div id="havale-container">
    <h2>Havale Yap</h2>
    <form on:submit={handleSubmit}>
        <div class="form-row">
            <label for="gonderici">Gönderen Hesap:</label>
            <select
                class="havale-input"
                id="gönderici"
                name="gonderici"
                bind:value={gondericihesapinput}
            >
                {#each hesaplar as hesap}
                    <option value={hesap.HesapNo}>{hesap.HesapNo}</option>
                {/each}
            </select>
        </div>
        <div class="form-row">
            <label for="alici">Alıcı Hesap Numarası:</label>
            <input
                class="havale-input"
                type="number"
                id="alici"
                name="alici"
                placeholder="Alıcı Hesap Numarası"
                bind:value={alicihesapnoinput}
            />
        </div>
        <div class="form-row">
            <label for="miktar">Havale Miktarı:</label>
            <input
                class="havale-input"
                type="number"
                id="miktar"
                name="miktar"
                placeholder="Havale Miktarı"
                bind:value={miktarinput}
            />
        </div>
        <button type="submit">Havale Yap</button>
    </form>
</div>

<style>
    #havale-container {
        width: 750px;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }

    #havale-container form {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    #havale-container h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    #havale-container .form-row {
        display: grid;
        grid-template-columns: 250px auto;
        align-items: start;
    }

    #havale-container label {
        font-weight: 800;
        padding-top: 10px;
        box-sizing: border-box;
    }

    #havale-container .havale-input {
        background-color: var(--container-background);
        padding: 10px;
        box-sizing: border-box;
        border: solid 1px var(--container-border);
        border-radius: 5px;
        color: var(--dark-color);
        font-family: var(--font-family);
        font-size: var(--font-size);
        line-height: var(--line-height);
        letter-spacing: var(--letter-spacing);
    }

    #havale-container .havale-input:not(textarea) {
        height: 44px;
    }

    #havale-container button {
        width: 100%;
        height: 44px;
        background-color: var(--accent-color);
        margin-top: 10px;
        padding: 10px;
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
