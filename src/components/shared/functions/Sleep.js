/**
 * Form for generating, validating and submitting different types of inputs, based on sent props
 * In the component from which you open this form, please add an appropriate FormElements.js, in which you export functions that return the properties for this form.
 * @param {number} milliseconds How many milliseconds to wait for the delay
 */

 export function sleep (milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  