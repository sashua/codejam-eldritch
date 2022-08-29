import "./sass/main.scss";

import ancients from "./data/ancients";
import difficulties from "./data/difficulties";
import { brownCards, blueCards, greenCards } from "./data/mythicCards";
import cardBack from "./assets/mythicCardBackground.png";

import Settings from "./js/settings";
import MythDeck from "./js/myths-deck";

const settings = new Settings({
  rootElem: document.querySelector(".js-settings"),
  ancients,
  difficulties,
});

const myth = new MythDeck({
  rootElem: document.querySelector(".js-deck"),
  allCards: { brownCards, blueCards, greenCards },
  cardBack,
});

settings.onSubmit = ({ ancientId, difficulty }) => {
  const ancient = ancients.find(({ id }) => id === ancientId);
  settings.hide();
  myth.init({ ancient, difficulty });
  setTimeout(() => myth.show(), 500);
};

myth.onReset = () => {
  myth.hide();
  settings.init();
  setTimeout(() => settings.show(), 500);
};

settings.init();
window.settings = settings;
window.myth = myth;
