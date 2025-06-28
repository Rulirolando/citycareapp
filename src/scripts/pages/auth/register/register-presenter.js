export default class RegisterPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async getRegister({ name, email, password }) {
        this.#view.showSubmitLoaderButton();
        try {
            const response = await this.#model.getRegister({ name, email, password });
            if (!response.ok) {
                this.#view.registerFailed();
                return;
            }
            this.#view.registerSuccess(response.message);
        } catch (error) {
            console.error(error);
            this.#view.registerFailed();
        } finally {
            this.#view.hideSubmitLoaderButton();
        }
    }
}