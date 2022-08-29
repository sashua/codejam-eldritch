import cardsTemplate from "../templates/cards.handlebars";

// === Cards view start ===
export class CardsView {
  #rootElem;
  #cardBack;
  #onCardClickHandler;

  constructor({ rootElem, cardBack }) {
    this.#rootElem = rootElem;
    this.#cardBack = cardBack;
    this.#onCardClickHandler = null;
    this.#bindEvents();
  }

  render(cardsData) {
    this.#rootElem.innerHTML = cardsTemplate({
      cards: cardsData.map((card) => ({
        ...card,
        cardBack: this.#cardBack,
      })),
    });
  }

  openCard(id) {
    const card = this.#rootElem.querySelector(`#${id}`);
    card.classList.add("card--opened");
    card.classList.toggle("card--zoomed");
  }

  set onCardClick(handler) {
    this.#onCardClickHandler = handler;
  }

  #onCardClick(event) {
    const card = event.target.closest(".card");
    if (!card) {
      return;
    }

    const zoomedCard = this.#getZoomedCard();
    if (zoomedCard && card !== zoomedCard) {
      return;
    }

    card.parentNode.appendChild(card);
    setTimeout(() => {
      this.openCard(card.id);
    });
    if (!card.classList.contains("card--opened")) {
      this.#onCardClickHandler?.(card.dataset.color);
    }
  }

  #bindEvents() {
    this.#rootElem.addEventListener("click", this.#onCardClick.bind(this));
  }

  #getZoomedCard() {
    return this.#rootElem.querySelector(".card--zoomed");
  }
}
// --- Cards view end ---

// === Cards model start ===
export class CardsModel {
  #cards;
  #onChangeHandler;

  constructor() {
    this.#cards = null;
    this.#onChangeHandler = null;
  }

  set cards(cards) {
    this.#cards = cards;
    this.#onChange();
  }

  set onChange(handler) {
    this.#onChangeHandler = handler;
  }

  #onChange() {
    this.#onChangeHandler?.(this.#cards);
  }
}
// --- Cards model end ---
