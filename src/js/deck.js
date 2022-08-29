import { shuffle } from "lodash";

// === Deck start ===
export class Deck {
  #cards;

  constructor(cards) {
    this.#cards = shuffle(cards);
  }

  get cards() {
    return this.#cards;
  }

  forLevel({ level, num }) {
    const easyCards = this.withDifficulty("easy").cards;
    const normalCards = this.withDifficulty("normal").cards;
    const hardCards = this.withDifficulty("hard").cards;

    let cards = [];
    switch (level) {
      case "very easy":
        cards = [...easyCards, ...normalCards];
        break;
      case "easy":
        cards = shuffle([...easyCards, ...normalCards]);
        break;
      case "normal":
        cards = shuffle(this.cards);
        break;
      case "hard":
        cards = shuffle([...hardCards, ...normalCards]);
        break;
      case "very hard":
        cards = [...hardCards, ...normalCards];
        break;
    }

    return new Deck(cards.slice(0, num));
  }

  withDifficulty(value) {
    return new Deck(
      this.#cards.filter(({ difficulty }) => difficulty === value)
    );
  }

  popCard() {
    return this.#cards.pop();
  }

  popCards(num = 1) {
    return this.#cards.splice(-num, num);
  }

  popDeck(num = 1) {
    return new Deck(this.popCards(num));
  }
}
// --- Deck end ---
