define(["settings"], function(settings) {

  var previousBuilding = [];

  var breakingBuildAudio = document.getElementById("build-breaking-audio");

  function playBrokenBuildSound() {
    if (!settings.playBrokenBuildSoundEnabled()) {
      return;
    }

    breakingBuildAudio.setAttribute("autoplay", 'autoplay')
    breakingBuildAudio.play();
  }

  function checkBrokenBuild(sick) {
    sick = sick || [];
    sick.forEach(function(d) {
      if (_.contains(previousBuilding, d.name)) {
        playBrokenBuildSound();
        return;
      }
    });
  }

  function updatePreviousBuilding(sickBuilding, healtyBuilding) {
    sickBuilding = sickBuilding || [];
    healtyBuilding = healtyBuilding || [];

    previousBuilding = _.pluck(sickBuilding.concat(healtyBuilding), "name");
  }

  function play(healthy, sick, sickBuilding, healtyBuilding) {
    checkBrokenBuild(sick);

    updatePreviousBuilding(sickBuilding, healtyBuilding)
  }

  return {
    play: play
  };

});