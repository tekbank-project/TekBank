<script>
    import { onMount } from "svelte";
    let subeadiinput = "";
    let subeadresiinput = "";
    export async function handleSubmit() {}
    export async function handleDelete() {}
    export async function handleEdit() {}
    export var subeler = [];
    onMount(async () => {
        try {
            const response = await fetch(
                "http://localhost:4000/api/sube/tumsubeler",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            subeler = await response.json();
        } catch (error) {
            console.error(error);
        }
    });
</script>

<div id="subeekle-container">
    <h2>Şube İşlemleri</h2>
    <form on:submit={handleSubmit}>
        <div class="form-row">
            <label for="subeadi">Şube Adı:</label>
            <input
                class="subeekle-input"
                type="text"
                id="subeadi"
                name="subeadi"
                placeholder="Şube Adı"
                bind:value={subeadiinput}
            />
        </div>
        <div class="form-row">
            <label for="subeadresi">Şube Adresi:</label>
            <input
                class="subeekle-input"
                type="text"
                id="subeadresi"
                name="subeadresi"
                placeholder="Şube Adresi"
                bind:value={subeadresiinput}
            />
        </div>
        <button type="submit">Şube Ekle</button>
    </form>
</div>
<div id="hesaplar-container">
    <div class="list-row header">
        <div class="list-cell">Şube Adı</div>
        <div class="list-cell">Şube Adresi</div>
        <div class="list-cell last">Seçenekler</div>
    </div>
    {#each subeler as sube}
        <div class="list-row">
            <div class="list-cell">{sube.SubeAd}</div>
            <div class="list-cell">{sube.SubeKonum}</div>
            <div class="list-cell last">
                <button class="small" on:submit|preventDefault={handleEdit}>Düzenle</button>
                <button class="small" on:submit|preventDefault={handleDelete}>Sil</button>
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

    #hesaplar-container .list-row {
        display: grid;
        grid-template-columns: 150px 330px 200px;
        align-items: start;
        column-gap: 30px;
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
        width: 100%;
        height: 44px;
        background-color: var(--accent-color);
        padding: 10px;
        box-sizing: border-box;
        border: 0px;
        border-radius: 5px;
        color: var(--light-color);
        font-family: var(--font-family);
        font-size: var(--font-size);
        line-height: var(--line-height);
        letter-spacing: var(--letter-spacing);
        margin-bottom: 40px;
    }

    button.small {
        width: fit-content;
        height: 34px;
        padding: 5px 10px;
        box-sizing: border-box;
    }

    #subeekle-container {
        width: 750px;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }

    #subeekle-container form {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    #subeekle-container h2 {
        text-align: center;
    }

    #subeekle-container .form-row {
        display: grid;
        grid-template-columns: 250px auto;
        align-items: start;
    }

    #subeekle-container label {
        font-weight: 800;
        padding-top: 10px;
        box-sizing: border-box;
    }

    #subeekle-container .subeekle-input {
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

    #subeekle-container .subeekle-input:not(textarea) {
        height: 44px;
    }
</style>
