import EmojiFile from '../emoji-file.js';

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').then(function(reg){
    console.log('Registration complete with scope', reg.scope);
  }).catch(function(err){
    console.log('Registration failed', err);
  })
}

const come = document.getElementById('in');
come.value = 'i need a doctor to bring me back to life';
const go = document.getElementById('out');
come.addEventListener('input', mostImportantFunction);
document.getElementById('copyBtn').addEventListener('click', copy);
mostImportantFunction();

function mostImportantFunction(){
  let inContent = come.value;
  go.innerHTML = '';
  let linesSplit = inContent.trim().split('\n');
  for(let lineNumber = 0; lineNumber < linesSplit.length; lineNumber++){
    if(linesSplit[lineNumber] == ''){ // Can't do anything if its a blank line
      continue;
    }
    let wordsSplit = linesSplit[lineNumber].split(' ');
    for(let i = 0; i < wordsSplit.length; i++){
      let translated = EmojiFile.translateAndHTML(wordsSplit[i]);
      go.appendChild(translated);
    }
    go.appendChild(document.createElement('br'));
  }
}
function copy(){
  let generateString = getString();
  document.getElementById('hidden').textContent = generateString;

  let e = window.getSelection();
  let n = document.createRange();

  n.selectNodeContents(document.getElementById('hidden'));
  e.removeAllRanges();
  e.addRange(n);
  let s = false;
  let message = '';
  try{
    s = document.execCommand("copy");
    message = 'Copied to Clipboard !';
  }
  catch(err){
    console.error(err);
    messag = 'Could not be copied !';
  }

  let snackContainer = document.getElementById('snack-contain');
  snackContainer.MaterialSnackbar.showSnackbar({
    message: message,
    timeout: 2000
  });
  e.removeAllRanges();
  return s;
}

function getString(){
  let v = '';
  let childArray = Array.from(go.children);
  childArray.map(child => {
    if(child.tagName == 'SELECT'){
      v += child.options[child.selectedIndex].textContent;
    }
    else if(child.tagName == 'BR'){
      v += '\n';
    }
    else if(child.tagName == 'SPAN'){
      v += child.textContent;
    }
  })
  return v;
}


let componentHandler = {
  upgradeDom: function(optJsClass, optCssClass) {},
  upgradeElement: function(element, optJsClass) {},
  upgradeElements: function(elements) {},
  upgradeAllRegistered: function() {},
  registerUpgradedCallback: function(jsClass, callback) {},
  register: function(config) {},
  downgradeElements: function(nodes) {}
};

componentHandler = (function() {
  'use strict';
  let registeredComponents_ = [];
  let createdComponents_ = [];
  let componentConfigProperty_ = 'mdlComponentConfigInternal_';

  function findRegisteredClass_(name, optReplace) {
    for(let i = 0; i < registeredComponents_.length; i++) {
      if (registeredComponents_[i].className === name) {
        if (typeof optReplace !== 'undefined') {
          registeredComponents_[i] = optReplace;
        }
        return registeredComponents_[i];
      }
    }
    return false;
  }
  function getUpgradedListOfElement_(element) {
    let dataUpgraded = element.getAttribute('data-upgraded');
    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
  }
  function isElementUpgraded_(element, jsClass) {
    let upgradedList = getUpgradedListOfElement_(element);
    return upgradedList.indexOf(jsClass) !== -1;
  }
  function createEvent_(eventType, bubbles, cancelable) {
    if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
      return new CustomEvent(eventType, {
        bubbles: bubbles,
        cancelable: cancelable
      });
    } else {
      let ev = document.createEvent('Events');
      ev.initEvent(eventType, bubbles, cancelable);
      return ev;
    }
  }
  function upgradeDomInternal(optJsClass, optCssClass) {
    if (typeof optJsClass === 'undefined' &&
        typeof optCssClass === 'undefined') {
      for (let i = 0; i < registeredComponents_.length; i++) {
        upgradeDomInternal(registeredComponents_[i].className,
            registeredComponents_[i].cssClass);
      }
    } else {
      let jsClass = /** @type {string} */ (optJsClass);
      if (typeof optCssClass === 'undefined') {
        let registeredClass = findRegisteredClass_(jsClass);
        if (registeredClass) {
          optCssClass = registeredClass.cssClass;
        }
      }
      let elements = document.querySelectorAll('.' + optCssClass);
      for (let n = 0; n < elements.length; n++) {
        upgradeElementInternal(elements[n], jsClass);
      }
    }
  }
  function upgradeElementInternal(element, optJsClass) {
    // Verify argument type.
    if (!(typeof element === 'object' && element instanceof Element)) {
      throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    // Allow upgrade to be canceled by canceling emitted event.
    let upgradingEv = createEvent_('mdl-componentupgrading', true, true);
    element.dispatchEvent(upgradingEv);
    if (upgradingEv.defaultPrevented) {
      return;
    }

    let upgradedList = getUpgradedListOfElement_(element);
    let classesToUpgrade = [];
    // If jsClass is not provided scan the registered components to find the
    // ones matching the element's CSS classList.
    if (!optJsClass) {
      let classList = element.classList;
      registeredComponents_.forEach(function(component) {
        // Match CSS & Not to be upgraded & Not upgraded.
        if (classList.contains(component.cssClass) &&
            classesToUpgrade.indexOf(component) === -1 &&
            !isElementUpgraded_(element, component.className)) {
          classesToUpgrade.push(component);
        }
      });
    } else if (!isElementUpgraded_(element, optJsClass)) {
      classesToUpgrade.push(findRegisteredClass_(optJsClass));
    }

    // Upgrade the element for each classes.
    for (let i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
      registeredClass = classesToUpgrade[i];
      if (registeredClass) {
        // Mark element as upgraded.
        upgradedList.push(registeredClass.className);
        element.setAttribute('data-upgraded', upgradedList.join(','));
        let instance = new registeredClass.classConstructor(element);
        instance[componentConfigProperty_] = registeredClass;
        createdComponents_.push(instance);
        // Call any callbacks the user has registered with this component type.
        for (let j = 0, m = registeredClass.callbacks.length; j < m; j++) {
          registeredClass.callbacks[j](element);
        }

        if (registeredClass.widget) {
          // Assign per element instance for control over API
          element[registeredClass.className] = instance;
        }
      } else {
        throw new Error(
          'Unable to find a registered component for the given class.');
      }

      let upgradedEv = createEvent_('mdl-componentupgraded', true, false);
      element.dispatchEvent(upgradedEv);
    }
  }
  function upgradeElementsInternal(elements) {
    if (!Array.isArray(elements)) {
      if (elements instanceof Element) {
        elements = [elements];
      } else {
        elements = Array.prototype.slice.call(elements);
      }
    }
    for (let i = 0, n = elements.length, element; i < n; i++) {
      element = elements[i];
      if (element instanceof HTMLElement) {
        upgradeElementInternal(element);
        if (element.children.length > 0) {
          upgradeElementsInternal(element.children);
        }
      }
    }
  }
  function registerInternal(config) {
    let widgetMissing = (typeof config.widget === 'undefined' &&
        typeof config['widget'] === 'undefined');
    let widget = true;

    if (!widgetMissing) {
      widget = config.widget || config['widget'];
    }
    let newConfig = /** @type {componentHandler.ComponentConfig} */ ({
      classConstructor: config.constructor || config['constructor'],
      className: config.classAsString || config['classAsString'],
      cssClass: config.cssClass || config['cssClass'],
      widget: widget,
      callbacks: []
    });

    registeredComponents_.forEach(function(item) {
      if (item.cssClass === newConfig.cssClass) {
        throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
      }
      if (item.className === newConfig.className) {
        throw new Error('The provided className has already been registered');
      }
    });

    if (config.constructor.prototype
        .hasOwnProperty(componentConfigProperty_)) {
      throw new Error(
          'MDL component classes must not have ' + componentConfigProperty_ +
          ' defined as a property.');
    }

    let found = findRegisteredClass_(config.classAsString, newConfig);

    if (!found) {
      registeredComponents_.push(newConfig);
    }
  }
  function registerUpgradedCallbackInternal(jsClass, callback) {
    let regClass = findRegisteredClass_(jsClass);
    if (regClass) {
      regClass.callbacks.push(callback);
    }
  }
  function upgradeAllRegisteredInternal() {
    for (let n = 0; n < registeredComponents_.length; n++) {
      upgradeDomInternal(registeredComponents_[n].className);
    }
  }
  function deconstructComponentInternal(component) {
    if (component) {
      let componentIndex = createdComponents_.indexOf(component);
      createdComponents_.splice(componentIndex, 1);
      let upgrades = component.element_.getAttribute('data-upgraded').split(',');
      let componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
      upgrades.splice(componentPlace, 1);
      component.element_.setAttribute('data-upgraded', upgrades.join(','));

      let ev = createEvent_('mdl-componentdowngraded', true, false);
      component.element_.dispatchEvent(ev);
    }
  }
  function downgradeNodesInternal(nodes) {
    let downgradeNode = function(node) {
      createdComponents_.filter(function(item) {
        return item.element_ === node;
      }).forEach(deconstructComponentInternal);
    };
    if (nodes instanceof Array || nodes instanceof NodeList) {
      for (let n = 0; n < nodes.length; n++) {
        downgradeNode(nodes[n]);
      }
    } else if (nodes instanceof Node) {
      downgradeNode(nodes);
    } else {
      throw new Error('Invalid argument provided to downgrade MDL nodes.');
    }
  }
  return {
    upgradeDom: upgradeDomInternal,
    upgradeElement: upgradeElementInternal,
    upgradeElements: upgradeElementsInternal,
    upgradeAllRegistered: upgradeAllRegisteredInternal,
    registerUpgradedCallback: registerUpgradedCallbackInternal,
    register: registerInternal,
    downgradeElements: downgradeNodesInternal
  };
})();
componentHandler.ComponentConfigPublic;  // jshint ignore:line
componentHandler.ComponentConfig;  // jshint ignore:line
componentHandler.Component;  // jshint ignore:line
componentHandler['upgradeDom'] = componentHandler.upgradeDom;
componentHandler['upgradeElement'] = componentHandler.upgradeElement;
componentHandler['upgradeElements'] = componentHandler.upgradeElements;
componentHandler['upgradeAllRegistered'] =
    componentHandler.upgradeAllRegistered;
componentHandler['registerUpgradedCallback'] =
    componentHandler.registerUpgradedCallback;
componentHandler['register'] = componentHandler.register;
componentHandler['downgradeElements'] = componentHandler.downgradeElements;
window.componentHandler = componentHandler;
window['componentHandler'] = componentHandler;

window.addEventListener('load', function() {
  'use strict';
  if ('classList' in document.createElement('div') &&
      'querySelector' in document &&
      'addEventListener' in window && Array.prototype.forEach) {
    document.documentElement.classList.add('mdl-js');
    componentHandler.upgradeAllRegistered();
  } else {
    componentHandler.upgradeElement = function() {};
    componentHandler.register = function() {};
  }
});
if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    };
    Date['now'] = Date.now;
}
let vendors = [
    'webkit',
    'moz'
];
for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    let vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
    window['requestAnimationFrame'] = window.requestAnimationFrame;
    window['cancelAnimationFrame'] = window.cancelAnimationFrame;
}
if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    let lastTime = 0;
    window.requestAnimationFrame = function (callback) {
        let now = Date.now();
        let nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
            callback(lastTime = nextTime);
        }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
    window['requestAnimationFrame'] = window.requestAnimationFrame;
    window['cancelAnimationFrame'] = window.cancelAnimationFrame;
}
let MaterialSnackbar = function MaterialSnackbar(element) {
    this.element_ = element;
    this.textElement_ = this.element_.querySelector('.' + this.cssClasses_.MESSAGE);
    this.actionElement_ = this.element_.querySelector('.' + this.cssClasses_.ACTION);
    if (!this.textElement_) {
        throw new Error('There must be a message element for a snackbar.');
    }
    if (!this.actionElement_) {
        throw new Error('There must be an action element for a snackbar.');
    }
    this.active = false;
    this.actionHandler_ = undefined;
    this.message_ = undefined;
    this.actionText_ = undefined;
    this.queuedNotifications_ = [];
    this.setActionHidden_(true);
};
window['MaterialSnackbar'] = MaterialSnackbar;
MaterialSnackbar.prototype.Constant_ = {
    ANIMATION_LENGTH: 250
};
MaterialSnackbar.prototype.cssClasses_ = {
    SNACKBAR: 'mdl-snackbar',
    MESSAGE: 'mdl-snackbar__text',
    ACTION: 'mdl-snackbar__action',
    ACTIVE: 'mdl-snackbar--active'
};
MaterialSnackbar.prototype.displaySnackbar_ = function () {
    this.element_.setAttribute('aria-hidden', 'true');
    if (this.actionHandler_) {
        this.actionElement_.textContent = this.actionText_;
        this.actionElement_.addEventListener('click', this.actionHandler_);
        this.setActionHidden_(false);
    }
    this.textElement_.textContent = this.message_;
    this.element_.classList.add(this.cssClasses_.ACTIVE);
    this.element_.setAttribute('aria-hidden', 'false');
    setTimeout(this.cleanup_.bind(this), this.timeout_);
};
MaterialSnackbar.prototype.showSnackbar = function (data) {
    if (data === undefined) {
        throw new Error('Please provide a data object with at least a message to display.');
    }
    if (data['message'] === undefined) {
        throw new Error('Please provide a message to be displayed.');
    }
    if (data['actionHandler'] && !data['actionText']) {
        throw new Error('Please provide action text with the handler.');
    }
    if (this.active) {
        this.queuedNotifications_.push(data);
    } else {
        this.active = true;
        this.message_ = data['message'];
        if (data['timeout']) {
            this.timeout_ = data['timeout'];
        } else {
            this.timeout_ = 2750;
        }
        if (data['actionHandler']) {
            this.actionHandler_ = data['actionHandler'];
        }
        if (data['actionText']) {
            this.actionText_ = data['actionText'];
        }
        this.displaySnackbar_();
    }
};
MaterialSnackbar.prototype['showSnackbar'] = MaterialSnackbar.prototype.showSnackbar;
MaterialSnackbar.prototype.checkQueue_ = function () {
    if (this.queuedNotifications_.length > 0) {
        this.showSnackbar(this.queuedNotifications_.shift());
    }
};
MaterialSnackbar.prototype.cleanup_ = function () {
    this.element_.classList.remove(this.cssClasses_.ACTIVE);
    setTimeout(function () {
        this.element_.setAttribute('aria-hidden', 'true');
        this.textElement_.textContent = '';
        if (!Boolean(this.actionElement_.getAttribute('aria-hidden'))) {
            this.setActionHidden_(true);
            this.actionElement_.textContent = '';
            this.actionElement_.removeEventListener('click', this.actionHandler_);
        }
        this.actionHandler_ = undefined;
        this.message_ = undefined;
        this.actionText_ = undefined;
        this.active = false;
        this.checkQueue_();
    }.bind(this), this.Constant_.ANIMATION_LENGTH);
};
MaterialSnackbar.prototype.setActionHidden_ = function (value) {
    if (value) {
        this.actionElement_.setAttribute('aria-hidden', 'true');
    } else {
        this.actionElement_.removeAttribute('aria-hidden');
    }
};
componentHandler.register({
    constructor: MaterialSnackbar,
    classAsString: 'MaterialSnackbar',
    cssClass: 'mdl-js-snackbar',
    widget: true
});
