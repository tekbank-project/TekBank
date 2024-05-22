<script>
    import { goto } from "$app/navigation";
    let hesapadiinput = "";
    var message = "";
    export async function handleSubmit(event) {
        event.preventDefault();
        if (!hesapadiinput) {
            alert("Lütfen formu eksiksiz doldurunuz.");
        }
        try {
            const response = await fetch(
                "http://localhost:4000/api/hesap/yenihesap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Auth: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        HesapAdi: hesapadiinput,
                    }),
                },
            );
            const data = await response.json();
            message = data.message;
            goto("/hesap/hesaplarim");
        } catch (error) {
            console.error(error);
        }
        alert(message);
    }
</script>

<div id="yenihesap-container">
    <h2>Yeni Hesap Oluştur</h2>
    <form on:submit={handleSubmit}>
        <div class="form-row">
            <label for="hesapadi">Hesap Adı:</label>
            <input
                class="hesapadi-input"
                type="text"
                id="hesapadi"
                name="hesapadi"
                placeholder="Hesap Adı"
                bind:value={hesapadiinput}
            />
        </div>
        <button type="submit">Yeni Hesap Oluştur</button>
    </form>
</div>

<style>
    #yenihesap-container {
        width: 750px;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }

    #yenihesap-container form {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    #yenihesap-container h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    #yenihesap-container .form-row {
        display: grid;
        grid-template-columns: 250px auto;
        align-items: start;
    }

    #yenihesap-container label {
        font-weight: 800;
        padding-top: 10px;
        box-sizing: border-box;
    }

    #yenihesap-container .hesapadi-input {
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

    #yenihesap-container .hesapadi-input {
        height: 44px;
    }

    #yenihesap-container button {
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
