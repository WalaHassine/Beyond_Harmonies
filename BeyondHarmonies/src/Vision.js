import { Master } from "tone";

let hidden, visibilityChange; // var pour gestion de visibilité de page
if (typeof document.hidden !== "undefined") {
  // propriété supportée dans le navigateur ?
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  // verification pour Microsoft Egde
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  // verification pour webkit
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

// verification si l'API de visibilté de page et addEventListener est supporté
if (
  typeof document.addEventListener !== "undefined" &&
  typeof document.hidden !== "undefined"
) {
  let wasMuted = false; // var etat de sourdine
  document.addEventListener(
    visibilityChange,
    () => {
      // event listener pour changement de visiblité de page
      if (document[hidden]) {
        // page masquée
        //hide
        wasMuted = Master.mute;
        Master.mute = true; // mise en sourdine du volume
      } else {
        //show
        Master.mute = wasMuted; // page affiché + etablissement de l'etat precendante de sourdine
      }
    },
    false,
  );
}
