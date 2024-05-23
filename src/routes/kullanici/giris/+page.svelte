<script>
    import { goto } from "$app/navigation";
    import "./styles.css";
    let emailInput = "";
    let passwordInput = "";
    export async function handleSubmit(event) {
        event.preventDefault();
        var message = "";
        try {
            const response = await fetch(
                "http://localhost:4000/api/kullanici/giris",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        KullaniciEmail: emailInput,
                        KullaniciSifre: passwordInput,
                    }),
                },
            );
            const data = await response.json();
            localStorage.setItem("email", emailInput);
            localStorage.setItem("token", data.token);
            localStorage.setItem("YetkiToken", data.YetkiToken);
            message = data.message;
            if (response.status === 200 || response.status === 201) {
                goto("/");
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
        }
        alert(message);
    }
</script>

<svelte:head>
    <title>Giriş - TekBank</title>
</svelte:head>

<section id="login-container">
    <img id="logo" src="/logo.jpeg" alt="TekBank-Logo" />
    <h2>TekBank'a Hoşgeldiniz</h2>
    <form on:submit={handleSubmit}>
        <div class="form-row">
            <label for="email">E-Posta</label>
            <input
                type="email"
                id="email"
                name="email"
                bind:value={emailInput}
                required
            />
        </div>
        <div class="form-row">
            <label for="password">Şifre</label>
            <input
                type="password"
                id="password"
                name="password"
                bind:value={passwordInput}
                required
            />
        </div>
        <button type="submit">Giriş Yap</button>
    </form>
    <div id="bottom-texts">
        <a href="/kullanici/yenikayit">Yeni hesap oluşturun</a>
    </div>
</section>

<style>
    #login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        row-gap: 20px;
        width: fit-content;
        background-color: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        margin: 20px 0px;
        padding: 20px;
        box-sizing: border-box;
    }

    #login-container #logo {
        width: 250px;
        height: 250px;
    }

    #login-container form {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 10px;
    }

    #login-container .form-row {
        display: grid;
        grid-template-columns: 100px auto;
        align-items: center;
    }

    label {
        font-weight: 800;
    }

    #login-container input {
        width: 350px;
        height: 44px;
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

    #login-container button:not(#show-password) {
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
    }

    #login-container #bottom-texts {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
</style>
