import { putAccessToken } from "../../../utils/auth";

export default class LoginPresenter {
    #view;
    #authModel;
    #model;

    constructor({ view, authModel, model }) {
        this.#view = view;
        this.#model = model;

    }

    async getLogin({email, password}) {
        this.#view.showSubmitLoaderButton();
        try {
            console.log('Login attempt:', email, password);
           const data = await this.#model.getLogin({email, password});
            console.log("Data: ", data);

            if (data.error) {
                this.#view.loginFailed(data.message || 'Login failed');
                return;
            }

            if(data.loginResult?.token){
                putAccessToken(data.loginResult.token);
                this.#view.loginSuccess('Login successful');
            }else {
                this.#view.loginFailed(data.message ||'Login failed data tidak ditemukan');
            }
  

        } catch (error) {
            console.error(error);
            this.#view.loginFailed(error.message || 'Login failed');
        }finally {
            this.#view.hideSubmitLoaderButton();
        }
    }

}