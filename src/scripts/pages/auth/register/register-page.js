import RegisterPresenter from "./register-presenter";
import * as StoryAPI from "../../../data/api";
export default class RegisterPage {
    #presenter = null

    render() {
        return `
       <div class="container-register">
            <div class="register-form">
                <h2>Register</h2>
                <form id="register-form">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input id="register-name" type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="register-email" type="email"  name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input id="register-password" type="password" name="password" required>
                    </div>
                    <div class="form-group">
                        <button id="register-button" type="submit">Register</button>
                    </div>
                </form>
                <div id="register-message" class="message"></div>
            </div>
        </div>               
        `;
    }
    async afterRender() {
        this.#presenter = new RegisterPresenter({
            view: this,
            model: StoryAPI,
        });
        this.#setupForm();
    }

    #setupForm() {
        const form = document.getElementById('register-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            await this.#presenter.getRegister({ name, email, password });
        });
    }

    registerSuccess(message) {
        location.hash = '/login';
    }
    registerFailed(message) {
        alert(message);
    }

    showSubmitLoaderButton() {
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Loading...';
        submitButton.setAttribute('disabled', true);
    }

    hideSubmitLoaderButton() {
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Register';
        submitButton.removeAttribute('disabled');
    }
  
}