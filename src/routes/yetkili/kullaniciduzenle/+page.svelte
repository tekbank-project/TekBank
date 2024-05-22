<script>
    import { goto } from "$app/navigation";
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
    let adinputsearch = "";
    let soyadinputsearch = "";
    let annebabaadiinputsearch = "";
    let tckninputsearch = "";
    let emailinputsearch = "";
    let sifreinputsearch = "";
    let sifre2inputsearch = "";
    let dogumtarihiinputsearch = "";
    let telefoninputsearch = "";
    let adresinputsearch = "";
    let subeinputsearch = "";
    let kullaniciidinput = "";
    export async function handleSubmit(event) {
        if (sifreinput !== sifre2input) {
            window.alert("Girdiğiniz şifreler eşleşmiyor.");
            return;
        }
        var message = "";
        try {
            const response = await fetch(
                "http://localhost:4000/api/kullanici/guncelle",
                {
                    method: "PATCH",
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
    export async function handleSearch() {
        var message = "";
        try {
            const response = await fetch(
                "http://localhost:4000/api/kullanici/kullanicidetay",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Auth": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        KullaniciId: kullaniciidinput
                    }),
                },
            );
            const data = await response.json();
            message = data.message;
            adinputsearch = data.message.KullaniciAd;
            soyadinputsearch = data.message.KullaniciSoyad;
            tckninputsearch = data.message.KullaniciTCKN;
            sifreinputsearch = data.message.KullaniciSifre;
            emailinputsearch = data.message.KullaniciEmail;
            adresinputsearch = data.message.KullaniciAdres;
            telefoninputsearch = data.message.KullaniciTelefon;
            subeinputsearch = data.message.KullaniciSube;
            if (response.ok) {
                goto("/");
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(error);
        }
        alert(message);
    }
    export async function handleDelete() {
        
    }
</script>

<main id="content">
    <div id="hesapduzenle-container">
        <h1>Hesap Düzenle</h1>
        <form id="searchbox" on:submit|preventDefault={handleSearch}>
            <input
                type="text"
                class="hesapduzenle-input full"
                placeholder="Kullanıcı ID"
                bind:value={kullaniciidinput}
            />
            <button class="btn" on:canplay={handleSearch}>Kullanıcıyı Ara</button>
            <button class="btn" on:click={handleDelete}>Hesabı Sil</button>
        </form>
        <form on:submit={handleSubmit}>
            <div class="form-cell">
                <label for="ad">Adı:</label>
                <input
                    type="text"
                    class="hesapduzenle-input"
                    name="ad"
                    placeholder="{adinputsearch}"
                    bind:value={adinput}
                />
            </div>
            <div class="form-cell">
                <label for="soyad">Soyadı:</label>
                <input
                    type="text"
                    class="hesapduzenle-input"
                    name="soyad"
                    placeholder="{soyadinputsearch}"
                    bind:value={soyadinput}
                />
            </div>
            <div class="form-cell">
                <label for="annebabaadi">Anne/Baba Adı:</label>
                <input
                    type="text"
                    class="hesapduzenle-input"
                    name="annebabaadi"
                    placeholder="{annebabaadiinputsearch}"
                    bind:value={annebabaadiinput}
                />
            </div>
            <div class="form-cell">
                <label for="tckimlikno">TC Kimlik NO:</label>
                <input
                    type="number"
                    class="hesapduzenle-input"
                    name="tckimlikno"
                    placeholder="{tckninputsearch}"
                    bind:value={tckninput}
                />
            </div>
            <div class="form-cell">
                <label for="eposta">E-Posta Adresi:</label>
                <input
                    type="email"
                    class="hesapduzenle-input"
                    name="eposta"
                    placeholder="{emailinputsearch}"
                    bind:value={emailinput}
                />
            </div>
            <div class="form-cell">
                <label for="dogumtarihi">Doğum Tarihi:</label>
                <input
                    type="date"
                    class="hesapduzenle-input"
                    name="dogumtarihi"
                    placeholder="{dogumtarihiinputsearch}"
                    bind:value={dogumtarihiinput}
                />
            </div>
            <div class="form-cell">
                <label for="telefon">Telefon Numarası:</label>
                <input
                    type="tel"
                    class="hesapduzenle-input"
                    name="telefon"
                    placeholder="{telefoninputsearch}"
                    bind:value={telefoninput}
                />
            </div>
            <div class="form-cell">
                <label for="sube">Hesap Şubesi:</label>
                <select
                    class="hesapduzenle-input"
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
                <label for="adres">Adres:</label>
                <textarea
                    class="hesapduzenle-input"
                    name="adres"
                    placeholder="Ev veya İş Adresiniz"
                    bind:value={adresinput}
                ></textarea>
            </div>
            <div class="form-cell larger">
                <div class="form-cell">
                    <label for="sifre1">Şifre:</label>
                    <input
                        type="password"
                        class="hesapduzenle-input"
                        name="sifre1"
                        placeholder="Şifreniz"
                        bind:value={sifreinput}
                    />
                </div>
                <div class="form-cell">
                    <label for="sifre2">Şifre (Tekrar)</label>
                    <input
                        type="password"
                        class="hesapduzenle-input"
                        name="sifre2"
                        placeholder="Şifreniz (Tekrar)"
                        bind:value={sifre2input}
                    />
                </div>
            </div>
            <button class="btn full" type="submit">Değişiklikleri Kaydet</button>
        </form>
    </div>
</main>

<style>
    #hesapduzenle-container {
        width: 720px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #hesapduzenle-container h1 {
        text-align: center;
        margin-bottom: 30px;
    }

    #hesapduzenle-container form {
        width: 720px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        flex-direction: row;
        column-gap: 20px;
        row-gap: 20px;
    }

    #hesapduzenle-container .form-cell {
        width: 350px;
        height: 73px;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }

    #hesapduzenle-container .form-cell.larger {
        height: 166px !important;
        row-gap: 20px !important;
    }

    #hesapduzenle-container .form-cell.larger.single-cell {
        height: 166px !important;
        row-gap: 5px !important;
    }

    #hesapduzenle-container .form-cell.larger.single-cell textarea {
        min-height: 135px;
        resize: none;
    }

    #hesapduzenle-container .form-cell label {
        display: block;
        font-weight: 800;
    }

    .hesapduzenle-input {
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

    .full {
        width: 720px !important;
    }

    #searchbox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        column-gap: 20px;
        margin-bottom: 20px;
        border-bottom: solid 1px var(--dark-color);
        padding-bottom: 20px;
        box-sizing: border-box;
    }

    #hesapduzenle-container button {
        width: 350px;
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
</style>
