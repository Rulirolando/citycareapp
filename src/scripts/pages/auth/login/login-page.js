import LoginPresenter from "./login-presenter";
import * as StoryAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";
export default class LoginPage {    
    #presenter = null;

    async render() {
        return `
            <div class="login-page">
                <h1 class="title-login">Login</h1>
                <form id="login-form" class="login-form">
                    <label for="email-input" id="email-login">Email</label>
                    <input type="text" id="email-input" placeholder="Email" required />
                    <label for="password" id="password-login">Password</label>
                    <input type="password" id="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
            </div>
        `;

    }
    
    async afterRender() {
        this.#presenter = new LoginPresenter({
            view: this,
            model: StoryAPI
        });

        this.#setupForm();

    }

    #setupForm() {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password').value;
            await this.#presenter.getLogin({ email, password });
        });
    }

    loginSuccess() {
        alert('Login Berhasil');

        location.hash = "/"
    }

    loginFailed() {
        alert('Login Gagal');
    }

    showSubmitLoaderButton() {
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Loading...';
        submitButton.setAttribute('disabled', true);
    }

    hideSubmitLoaderButton() {
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Login';
        submitButton.removeAttribute('disabled');
    }
  
}
