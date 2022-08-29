import { Deck } from "./deck";
import { StagesModel, StagesView } from "./stages";
import { CardsModel, CardsView } from "./cards";

// === Myths deck controller start ===
export default class MythDeck {
  #view;
  #model;

  constructor({ rootElem, allCards, cardBack }) {
    this.#view = new MythsDeckView({ rootElem, cardBack });
    this.#model = new MythsDeckModel(allCards);

    this.#bindEvents();
  }

  init({ difficulty, ancient }) {
    this.#model.init({ difficulty, ancient });
  }

  show() {
    this.#view.show();
  }

  hide() {
    this.#view.hide();
  }

  set onReset(handler) {
    this.#view.onReset = handler;
  }

  #bindEvents() {
    this.#model.handlers = {
      onChangeHandler: this.#view.render.bind(this.#view),
      onStagesChangeHandler: this.#view.renderStages.bind(this.#view),
      onCardsChangeHandler: this.#view.renderCards.bind(this.#view),
    };
    this.#view.onCardClick = this.#model.openCard.bind(this.#model);
  }
}
// === Myths deck controller end ===

// === Myths deck view start ===
class MythsDeckView {
  #refs;
  #stages;
  #cards;
  #onResetHandler;

  constructor({ rootElem, cardBack }) {
    this.#refs = this.#getRefs(rootElem);
    this.#stages = new StagesView(this.#refs.stages);
    this.#cards = new CardsView({ rootElem: this.#refs.cards, cardBack });

    this.#onResetHandler = null;
    this.#bindEvents();
  }

  render({ difficulty, ancient }) {
    this.#refs.name.textContent = ancient.name;
  }

  show() {
    this.#refs.root.classList.remove("is-hidden");
  }

  hide() {
    this.#refs.root.classList.add("is-hidden");
  }

  renderStages(stagesData) {
    this.#stages.render(stagesData);
  }

  renderCards(cardsData) {
    this.#cards.render(cardsData);
  }

  set onCardClick(handler) {
    this.#cards.onCardClick = handler;
  }

  set onReset(handler) {
    this.#onResetHandler = handler;
  }

  #bindEvents() {
    this.#refs.reset.addEventListener("click", this.#onReset.bind(this));
  }

  #onReset() {
    this.#onResetHandler?.();
  }

  #getRefs(rootElem) {
    return {
      root: rootElem,
      stages: rootElem.querySelector(".js-stages"),
      cards: rootElem.querySelector(".js-cards"),
      name: rootElem.querySelector(".js-name"),
      reset: rootElem.querySelector(".js-reset"),
    };
  }
}
// --- Myths deck view end ---

// === Myths deck model start ===
class MythsDeckModel {
  #allCards;
  #difficulty;
  #ancient;
  #stages;
  #cards;
  #onChangeHandler;

  constructor(allCards) {
    this.#allCards = allCards;

    this.#stages = new StagesModel();
    this.#cards = new CardsModel();

    this.#difficulty = null;
    this.#ancient = null;
    this.#onChangeHandler = null;
  }

  init({ difficulty, ancient }) {
    this.#difficulty = difficulty;
    this.#ancient = ancient;

    this.#stages.stages = ancient;
    this.#cards.cards = this.#makeDeck({
      difficulty,
      stages: this.#stages,
      cards: this.#allCards,
    });

    this.#onChange();
  }

  openCard(color) {
    this.#stages.removeCard(color);
  }

  set handlers({
    onChangeHandler,
    onStagesChangeHandler,
    onCardsChangeHandler,
  }) {
    this.#onChangeHandler = onChangeHandler;
    this.#stages.onChange = onStagesChangeHandler;
    this.#cards.onChange = onCardsChangeHandler;
  }

  #onChange() {
    this.#onChangeHandler?.({
      difficulty: this.#difficulty,
      ancient: this.#ancient,
    });
  }

  #makeDeck({ difficulty, stages, cards }) {
    const { greenCards, brownCards, blueCards } = cards;

    let greenDeck = new Deck(greenCards).forLevel({
      level: difficulty,
      num: stages.getCardsNumber("green"),
    });
    let brownDeck = new Deck(brownCards).forLevel({
      level: difficulty,
      num: stages.getCardsNumber("brown"),
    });
    let blueDeck = new Deck(blueCards).forLevel({
      level: difficulty,
      num: stages.getCardsNumber("blue"),
    });

    const stage1Deck = new Deck([
      ...greenDeck.popCards(stages.getValue(0, "green")),
      ...brownDeck.popCards(stages.getValue(0, "brown")),
      ...blueDeck.popCards(stages.getValue(0, "blue")),
    ]);
    const stage2Deck = new Deck([
      ...greenDeck.popCards(stages.getValue(1, "green")),
      ...brownDeck.popCards(stages.getValue(1, "brown")),
      ...blueDeck.popCards(stages.getValue(1, "blue")),
    ]);
    const stage3Deck = new Deck([
      ...greenDeck.popCards(stages.getValue(2, "green")),
      ...brownDeck.popCards(stages.getValue(2, "brown")),
      ...blueDeck.popCards(stages.getValue(2, "blue")),
    ]);

    return [...stage3Deck.cards, ...stage2Deck.cards, ...stage1Deck.cards];
  }
}
// --- Myths deck model end ---
