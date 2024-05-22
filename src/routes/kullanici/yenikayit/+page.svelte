<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import "./styles.css";
    let adinput = "";
    let soyadinput = "";
    let annebabaadiinput = "";
    let tckninput = "";
    let emailinput = "";
    let sifreinput = "";
    let sifre2input = "";
    let dogumtarihiinput = "";
    let telefoninput = "";
    let adresinput = "";
    let subeinput = "";
    export async function handleSubmit(event) {
        event.preventDefault();
        if (
            !adinput ||
            !soyadinput ||
            !annebabaadiinput ||
            !tckninput ||
            !emailinput ||
            !sifreinput ||
            !dogumtarihiinput ||
            !telefoninput ||
            !adresinput ||
            !subeinput
        ) {
            window.alert("Lütfen formu eksiksiz doldurunuz.");
            return;
        }
        if (sifreinput !== sifre2input) {
            window.alert("Girdiğiniz şifreler eşleşmiyor.");
            return;
        }
        var message = "";
        try {
            const response = await fetch(
                "http://localhost:4000/api/kullanici/yenikayit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        KullaniciAd: adinput,
                        KullaniciSoyad: soyadinput,
                        KullaniciTCKN: tckninput,
                        KullaniciSifre: sifreinput,
                        KullaniciEmail: emailinput,
                        KullaniciAdres: adresinput,
                        KullaniciTelefon: telefoninput,
                        KullaniciSube: subeinput,
                    }),
                },
            );
            const data = await response.json();
            localStorage.setItem("email", emailinput);
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

<main id="content">
    <div id="yenihesap-container">
        <img id="logo" src="/logo.jpeg" alt="TekBank-Logo" />
        <h1>TekBank Hesabı Oluştur</h1>
        <form on:submit={handleSubmit}>
            <div class="form-cell">
                <label for="ad">Adınız:</label>
                <input
                    type="text"
                    class="yenihesap-input"
                    name="ad"
                    placeholder="Adınız"
                    bind:value={adinput}
                />
            </div>
            <div class="form-cell">
                <label for="soyad">Soyadınız:</label>
                <input
                    type="text"
                    class="yenihesap-input"
                    name="soyad"
                    placeholder="Soyadınız"
                    bind:value={soyadinput}
                />
            </div>
            <div class="form-cell">
                <label for="annebabaadi">Anne/Baba Adı:</label>
                <input
                    type="text"
                    class="yenihesap-input"
                    name="annebabaadi"
                    placeholder="Anne veya Baba Adı"
                    bind:value={annebabaadiinput}
                />
            </div>
            <div class="form-cell">
                <label for="tckimlikno">TC Kimlik NO:</label>
                <input
                    type="number"
                    class="yenihesap-input"
                    name="tckimlikno"
                    placeholder="TC Kimlik Numaranız"
                    bind:value={tckninput}
                />
            </div>
            <div class="form-cell">
                <label for="eposta">E-Posta Adresiniz:</label>
                <input
                    type="email"
                    class="yenihesap-input"
                    name="eposta"
                    placeholder="E-Posta Adresiniz"
                    bind:value={emailinput}
                />
            </div>
            <div class="form-cell">
                <label for="dogumtarihi">Doğum Tarihiniz:</label>
                <input
                    type="date"
                    class="yenihesap-input"
                    name="dogumtarihi"
                    placeholder="Doğum Tarihiniz (GG.AA.YYYY)"
                    bind:value={dogumtarihiinput}
                />
            </div>
            <div class="form-cell">
                <label for="telefon">Telefon Numaranız:</label>
                <input
                    type="tel"
                    class="yenihesap-input"
                    name="telefon"
                    placeholder="Telefon Numaranız"
                    bind:value={telefoninput}
                />
            </div>
            <div class="form-cell">
                <label for="sube">Hesap Şubesi:</label>
                <select
                    class="yenihesap-input"
                    name="sube"
                    placeholder="Hesabın açılacağı şube"
                    bind:value={subeinput}
                >
                    {#each subeler as sube}
                        <option value={sube.SubeAd}>{sube.SubeAd}</option>
                    {/each}
                </select>
            </div>
            <div class="form-cell larger single-cell">
                <label for="adres">Adresiniz:</label>
                <textarea
                    class="yenihesap-input"
                    name="adres"
                    placeholder="Ev veya İş Adresiniz"
                    bind:value={adresinput}
                ></textarea>
            </div>
            <div class="form-cell larger">
                <div class="form-cell">
                    <label for="sifre1">Şifreniz:</label>
                    <input
                        type="password"
                        class="yenihesap-input"
                        name="sifre1"
                        placeholder="Şifreniz"
                        bind:value={sifreinput}
                    />
                </div>
                <div class="form-cell">
                    <label for="sifre2">Şifreniz (Tekrar)</label>
                    <input
                        type="password"
                        class="yenihesap-input"
                        name="sifre2"
                        placeholder="Şifreniz (Tekrar)"
                        bind:value={sifre2input}
                    />
                </div>
            </div>
            <button class="btn">Hesap Oluştur</button>
        </form>
        <a href="/kullanici/giris">Zaten hesabınız var mı? Hemen giriş yapın</a>
    </div>
</main>

<style>
    #yenihesap-container {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
        width: 760px;
        margin: 20px;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #yenihesap-container #logo {
        width: 150px;
        height: 150px;
    }

    #yenihesap-container h1 {
        text-align: center;
        margin-bottom: 30px;
    }

    #yenihesap-container form {
        width: 720px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        flex-direction: row;
        column-gap: 20px;
        row-gap: 20px;
    }

    #yenihesap-container .form-cell {
        width: 350px;
        height: 73px;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }

    #yenihesap-container .form-cell.larger {
        height: 166px !important;
        row-gap: 20px !important;
    }

    #yenihesap-container .form-cell.larger.single-cell {
        height: 166px !important;
        row-gap: 5px !important;
    }

    #yenihesap-container .form-cell.larger.single-cell textarea {
        min-height: 135px;
        resize: none;
    }

    #yenihesap-container .form-cell label {
        display: block;
        font-weight: 800;
    }

    #yenihesap-container .form-cell .yenihesap-input {
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

    #yenihesap-container button {
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

    #yenihesap-container a {
        display: block;
        margin-top: 10px;
        text-align: center;
    }
</style>
