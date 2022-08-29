import ancientsTemplate from "../templates/ancients.handlebars";
import difficultiesTemplate from "../templates/difficulties.handlebars";

// === Settings controller start ===
export default class Settings {
  #view;
  #ancients;
  #difficulties;

  constructor({ rootElem, ancients, difficulties }) {
    this.#ancients = ancients;
    this.#difficulties = difficulties;
    this.#view = new SettingsView(rootElem);
    this.show();
  }

  init() {
    this.#view.render({
      ancients: this.#ancients,
      difficulties: this.#difficulties,
    });
  }

  show() {
    this.#view.show();
  }

  hide() {
    this.#view.hide();
  }

  set onSubmit(handler) {
    this.#view.onSubmit = handler;
  }
}
// --- Settings controller end ---

// === Settings view start ===
class SettingsView {
  #refs;
  #onSubmitHandler;

  constructor(rootElem) {
    this.#refs = this.#getRefs(rootElem);
    this.#onSubmitHandler = null;
    this.#bindEvents();
  }

  render({ ancients, difficulties }) {
    this.#refs.ancients.innerHTML = ancientsTemplate({ ancients });
    this.#refs.difficulties.innerHTML = difficultiesTemplate({ difficulties });
  }

  show() {
    this.#refs.root.classList.remove("is-hidden");
  }

  hide() {
    this.#refs.root.classList.add("is-hidden");
  }

  set onSubmit(handler) {
    this.#onSubmitHandler = handler;
  }

  #bindEvents() {
    this.#refs.root.addEventListener("submit", this.#onSubmit.bind(this));
  }

  #onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const ancientId = data.get("ancient");
    const difficulty = data.get("difficulty");
    if (ancientId && difficulty) {
      this.#onSubmitHandler?.({ ancientId, difficulty });
    }
  }

  #getRefs(rootElem) {
    return {
      root: rootElem,
      ancients: rootElem.querySelector(".js-ancients"),
      difficulties: rootElem.querySelector(".js-difficulties"),
      submit: rootElem.querySelector(".js-submit"),
    };
  }
}
// --- Settings view end ---
