import stagesTemplate from "../templates/stages.handlebars";

// === Stages view start ===
export class StagesView {
  #rootElem;
  #stageNames;

  constructor(rootElem) {
    this.#rootElem = rootElem;
    this.#stageNames = ["Этап I", "Этап II", "Этап III"];
  }

  render(stagesData) {
    const stages = stagesData.map((data, i) => ({
      ...data,
      name: this.#stageNames[i],
    }));
    this.#rootElem.innerHTML = stagesTemplate({ stages });
  }
}
// --- Stages view end ---

// === Stages model start ===
export class StagesModel {
  #stages;
  #onChangeHandler;

  constructor() {
    this.#stages = null;
    this.#onChangeHandler = null;
  }

  set stages({ firstStage, secondStage, thirdStage }) {
    this.#stages = [firstStage, secondStage, thirdStage];
    this.#onChange();
  }

  getValue(index, color) {
    return this.#stages[index][`${color}Cards`];
  }

  getCardsNumber(color) {
    return this.#stages.reduce(
      (acc, card) => (acc += card[`${color}Cards`]),
      0
    );
  }

  removeCard(color) {
    let index = 0;
    while (this.#isStageEmpty(index)) {
      index += 1;
      if (index >= this.#stages.length) {
        return;
      }
    }
    this.#stages[index][`${color}Cards`] -= this.#stages[index][`${color}Cards`]
      ? 1
      : 0;
    this.#onChange();
  }

  set onChange(handler) {
    this.#onChangeHandler = handler;
  }

  #onChange() {
    const stagesData = this.#stages?.map((stage, i) => ({
      ...stage,
      isEmpty: this.#isStageEmpty(i),
    }));

    this.#onChangeHandler?.(stagesData);
  }

  #isStageEmpty(index) {
    return !Object.values(this.#stages[index]).some((value) => value > 0);
  }
}
// --- Stages model end ---
