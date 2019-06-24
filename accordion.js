const TRIGGER_NAME = 'Accordion.Trigger';
const PANEL_NAME = 'Accordion.Panel';

class Accordion {
  constructor () {
    this.accordions.forEach(this.init.bind(this));
  }

  init (accordion) {
    const allowMultiple = accordion.hasAttribute('data-allow-multiple');
    const allowToggle = (allowMultiple) ? allowMultiple : accordion.hasAttribute('data-allow-toggle');
    const triggers = accordion.querySelectorAll(`[data-js="${TRIGGER_NAME}"]`);

    this.setInitialState(accordion, allowToggle);
    this.observeAccordionClicks({accordion, allowMultiple, allowToggle});
    triggers.forEach(this.observeTrigger.bind(this));
  }

  // observeAccordionKeypress (accordion) {
  //   accordion.addEventListener('keydown', this.handleAccordionKeypress.bind(this));
  // }

  observeAccordionClicks ({accordion, allowMultiple, allowToggle}) {
    accordion.addEventListener('click', this.handleAccordionClick.bind(
      this, {accordion, allowMultiple, allowToggle}
      )
    );
  }

  observeTrigger (trigger) {
    trigger.addEventListener('focus', this.toggleFocus.bind(this, trigger, true));
    trigger.addEventListener('blur', this.toggleFocus.bind(this, trigger, false));
    trigger.addEventListener('click', this.handleTriggerClick.bind(this, trigger));
  }

  handleTriggerClick (trigger) {
    console.log(trigger);
  }

  handleAccordionClick ({accordion, allowMultiple, allowToggle}, { target }) {
    if (this.isAccordionTrigger(target)) {
      const isExpanded = target.getAttribute('aria-expanded') === 'true';
      const active = accordion.querySelector('[aria-expanded="true"]');

      // If allowMultiple is not allowed and active exists and active is not the target
      if (!allowMultiple && active && active !== target) {
        this.toggleWithoutAllowMultiple({accordion, active, allowToggle});
      }

      // If the target element is not already expanded
      if (!isExpanded) {
        this.openPanel({accordion, target, allowToggle})
      // Else if toggling is allowed and the element is already open
      } else if (allowToggle && isExpanded) {
        this.toggleOpenPanel({accordion, target})
      }
      event.preventDefault();
    }
  }

  // handleAccordionKeypress ({target, which, ctrlKey}) {
  //   const key = which.toString();
  //   const isExpanded = target.getAttribute('aria-expanded') == 'true';
  //   const ctrlModifer = (ctrlKey && key.match(/33|34/));

  //   if (this.isAccordionTrigger(target)) {
  //     // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
  //     // 38 = Up, 40 = Down
  //     if (key.match(/38|40/) || ctrlModifier) {
  //       var index = triggers.indexOf(target);
  //       var direction = (key.match(/34|40/)) ? 1 : -1;
  //       var length = triggers.length;
  //       var newIndex = (index + length + direction) % length;

  //       triggers[newIndex].focus();

  //       event.preventDefault();
  //     }
  //     else if (key.match(/35|36/)) {
  //       // 35 = End, 36 = Home keyboard operations
  //       switch (key) {
  //         // Go to first accordion
  //         case '36':
  //           triggers[0].focus();
  //           break;
  //           // Go to last accordion
  //         case '35':
  //           triggers[triggers.length - 1].focus();
  //           break;
  //       }
  //       event.preventDefault();

  //     }
  //   }
  // }

  //
  // ACTIONS
  //

  toggleWithoutAllowMultiple ({accordion, active, allowToggle}) {
    active.setAttribute('aria-expanded', false);
    accordion.getElementById(active.getAttribute('aria-controls')).setAttribute('hidden', '');

    if (!allowToggle) {
      active.removeAttribute('aria-disabled');
    }
  }

  openPanel ({accordion, target, allowToggle}) {
    // Set the expanded state on the triggering element
    target.setAttribute('aria-expanded', 'true');
    // Hide the accordion sections, using aria-controls to specify the desired section
    accordion.querySelector(`#${target.getAttribute('aria-controls')}`).removeAttribute('hidden');

    // If toggling is not allowed, set disabled state on trigger
    if (!allowToggle) {
      target.setAttribute('aria-disabled', 'true');
    }
  }

  toggleOpenPanel ({accordion, target}) {
    // Set the expanded state on the triggering element
    target.setAttribute('aria-expanded', 'false');
    // Hide the accordion sections, using aria-controls to specify the desired section
    accordion.querySelector(`${target.getAttribute('aria-controls')}`).setAttribute('hidden', '');
  }

  toggleFocus(element, state) {
    element.setAttribute('data-focus', state);
  }

  //
  // HELPERS
  //

  isAccordionTrigger (element) {
    return element.getAttribute('data-js') === TRIGGER_NAME;
  }

  //
  // SETTERS & GETTERS
  //

  setInitialState(accordion, allowToggle) {
    if (!allowToggle) {
      // Get the first expanded/ active accordion
      const expanded = accordion.querySelector('[aria-expanded="true"]');
      // If an expanded/ active accordion is found, disable
      expanded && expanded.setAttribute('aria-disabled', 'true');
    }
  }

  get accordions() {
    return document.querySelectorAll('[data-js="Accordion"]');
  }
}

new Accordion();
