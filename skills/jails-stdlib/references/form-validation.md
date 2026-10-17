# form-validation

Validate and mask forms in Jails.

This is a component module with a default controller and `model`. Register the entire namespace and supply validation entities as dependencies.

```js
import * as formValidation from 'jails.stdlib/form-validation'

const required = {
    validate: (value) => Boolean(value),
    message: () => 'Required field'
}
jails.register('form-validation', formValidation, { required })
jails.start()
```

```html
<form novalidate>
    <form-validation>
        <input name="name" data-validation="required" html-value="form.values.name">
        <p html-if="form.errors.name" html-inner="form.errors.name"></p>
        <button type="submit">Submit</button>
    </form-validation>
</form>
```

In the example, `jails` is the instance/API already imported by the project. The component discovers its form through a descendant input/select/textarea; that control must exist and belong to a form. Entities provide synchronous `validate(value, input, form)` and `message(value, input, form)` methods; `mask(value, input, form)` is optional. `data-validation` separates names by whitespace. Unknown rules are ignored: supply every rule explicitly.

Model: `form.errors`, `values`, `touched`, `focused`, and `isValid`. Input events update values; focus marks touched/focused; blur clears focused; blur/change reveal the first error, while input updates errors already shown. Initialization assigns empty strings only to fields with validation. `elm.setValues(values)` merges state without validating or necessarily updating the DOM unless `html-value` is used.

Emitted events: `form-validation:submit` and `form-validation:valid` with `{ formData, data }`; `form-validation:error` with `{ errors }`. In delegated DOM handlers, read `event.detail` according to the project’s Jails contract. `valid` fires when one field passes, even if other fields are still invalid; do not treat it as a guarantee that the entire form is valid. Submit prevents native submission and triggers blur to validate; check state-update ordering in the Jails version in use.

Observed limitations: masks use `mask.split(/s/)`, not whitespace; avoid combining multiple names and check names containing `s`. State may capture the value before masking. Checkboxes return a value or an empty string; there is no general array/multi-select handling. `data` overwrites duplicate names, whereas `formData` retains entries. Reset/submit listeners on the form are not removed on unmount. Test mount/remount, reset, and the relevant fields and events before adopting this module in complex flows.

## Sources

Based on the review of `src/form-validation/index.ts`, `index.js`, `index.d.ts`, and `src/form-validation/readme.md` in the jails.stdlib 2.2.3 repository. Installed dependency files were also inspected for dependency aliases; confirm the version in the consuming project.
