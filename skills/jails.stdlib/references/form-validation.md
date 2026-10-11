# form-validation

Validar e mascarar formulários em Jails.

É um módulo de componente: default controller e `model`. Registre o namespace completo e forneça entidades de validação como dependencies.

```js
import * as formValidation from 'jails.stdlib/form-validation'

const required = {
    validate: (value) => Boolean(value),
    message: () => 'Campo obrigatório'
}
jails.register('form-validation', formValidation, { required })
jails.start()
```

```html
<form novalidate>
    <form-validation>
        <input name="name" data-validation="required" html-value="form.values.name">
        <p html-if="form.errors.name" html-inner="form.errors.name"></p>
        <button type="submit">Enviar</button>
    </form-validation>
</form>
```

`jails` no exemplo é a instância/API já importada pelo projeto. O componente descobre o form por um input/select/textarea descendente; precisa existir e estar associado a um form. Entidades têm `validate(value, input, form)` e `message(value, input, form)` síncronos; `mask(value, input, form)` é opcional. `data-validation` separa nomes por whitespace. Regras desconhecidas são ignoradas: forneça todas explicitamente.

Model: `form.errors`, `values`, `touched`, `focused`, `isValid`. Input atualiza valores; focus marca touched/focused; blur remove focused; blur/change revelam o primeiro erro, input atualiza erros já mostrados. Inicialização preenche com strings vazias apenas campos com validação. `elm.setValues(values)` mescla o estado, sem validar nem necessariamente mudar o DOM sem `html-value`.

Eventos emitidos: `form-validation:submit` e `form-validation:valid` com `{ formData, data }`; `form-validation:error` com `{ errors }`. Em handlers DOM delegados, leia `event.detail` conforme o contrato de Jails do projeto. `valid` é emitido quando um campo passa, mesmo que outros ainda sejam inválidos; não o trate como garantia do formulário inteiro. Submit previne envio nativo e aciona blur para validar; verifique a ordem de atualização do estado na versão Jails usada.

Limites observados: máscaras usam `mask.split(/s/)`, não whitespace; evite compor vários nomes e verifique nomes contendo `s`. Estado pode capturar valor anterior à máscara. Checkbox retorna valor ou string vazia; não há tratamento geral para arrays/multi-select; `data` sobrescreve nomes repetidos, enquanto `formData` conserva entradas. Os listeners de reset/submit no form não são removidos no unmount. Teste mount/remount, reset, campos e eventos relevantes antes de adotar em fluxos complexos.

## Origem

Reconhecimento de `src/form-validation/index.ts`, `index.js`, `index.d.ts` e `src/form-validation/readme.md` no repositório jails.stdlib 2.2.3. Para aliases de dependências, foram consultados também os arquivos locais instalados; confirme a versão no projeto consumidor.
