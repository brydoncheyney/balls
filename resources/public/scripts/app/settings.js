define(['store', 'jquery', 'lodash'], function (store) {

  var repulsionFactorKey = "repulsionFactor";
  var attractionFactorKey = "attractionFactor";
  var redAlertThresholdKey = "redAlertThreshold";
  var glitchEffectThresholdKey = "glitchEffectThreshold";

  var repulsionFactorField = $('#repulsion-factor');
  var attractionFactorField = $('#attraction-factor');

  var redAlertThresholdField = $('#red-alert-threshold');
  var glitchEffectThresholdField = $('#glitch-effect-threshold');

  var preferencesField = $('#preferences');

  var soundMap = {
    brokenBuildSound: $('#broken-build-sound-list'),
    brokenToHealthySound: $('#sick-to-healthy-build-sound-list')
  };

  var checkedPreferences = {
    rotateNonGreenText: $('#rotate-non-green-text')
  };

  function checkedToStoreVal(jqElm) {
    return jqElm.is(':checked') ? 'on' : 'off';
  }

  function getRepulsionFactor() {
    var v = store.get(repulsionFactorKey);
    return v ? parseInt(v) : 1;
  }

  function getAttractionFactor() {
    var v = store.get(attractionFactorKey);
    return v ? parseInt(v) / 100 : 0.01;
  }

  (function setFieldValues() {
    repulsionFactorField.val(getRepulsionFactor());
    attractionFactorField.val(getAttractionFactor() * 100);

    var v = store.get(redAlertThresholdKey);
    if (v) { redAlertThresholdField.val(v) }

    v = store.get(glitchEffectThresholdKey);
    if (v) { glitchEffectThresholdField.val(v) }

    _.each(soundMap, function(field, storeKey) {
      var previousSelection = store.get(storeKey);
      if (!_.isEmpty(previousSelection)) {
        field.val(previousSelection);
      }
    });

    _.each(checkedPreferences, function (field, storeKey) {
      if (store.get(storeKey) === 'off') {
        field.prop('checked', false);
      }
    });
  })();

  (function bindEvents() {
    _.each(soundMap, function(field, storeKey) {
      field.on('change', function() {
        store.save(storeKey, field.val());
      })
    });

    $('#preferences-control-btn').on('click', function () {
      preferencesField.toggle(250);
    });

    repulsionFactorField.on('change mousemove', function () {
      store.save(repulsionFactorKey, repulsionFactorField.val());
    });

    attractionFactorField.on('change mousemove', function () {
      store.save(attractionFactorKey, attractionFactorField.val());
    });

    glitchEffectThresholdField.on('change', function() {
      store.save(glitchEffectThresholdKey, glitchEffectThresholdField.val())
    });

    redAlertThresholdField.on('change', function() {
      store.save(redAlertThresholdKey, redAlertThresholdField.val())
    });

    _.each(checkedPreferences, function (field, storeKey) {
      field.on('click', function () {
        store.save(storeKey, checkedToStoreVal(field));
      });
    });
  })();

  function effectsThreshold(field) {
    if (field.length > 0) {
      return field.val();
    }
  }

  return {
    repulsionFactor: getRepulsionFactor,
    attractionFactor: getAttractionFactor,
    rotateNonGreenText: function() { return checkedPreferences.rotateNonGreenText.is(':checked'); },
    selectedBrokenBuildSound: function() { return soundMap.brokenBuildSound.val(); },
    seletedBrokenToHealtySound: function() { return soundMap.brokenToHealthySound.val(); },
    glitchEffectThreshold: function() { return effectsThreshold(glitchEffectThresholdField); },
    redAlertThreshold: function() { return effectsThreshold(redAlertThresholdField); }
  }

});