function ErrorMessage() {
      return (
            <error-message>
                        <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                        </svg>
                              <span>Error: </span>
                              <span class="error-message"></span>             
                        </span>
            </error-message>
      )
}

function HiddenInput(props) {
      const {data} = props
      return (
            <input
                  type="hidden"
                  className="rootInput" 
                  name={data.inputName}      
                  label={data.inputLabel}
                  requirements={data.inputRequirements}
            />
      )
}
 
function Text(props) {
      const {label, inputName, inputLabel, inputRequirements, inputValue, inputType} = props
      return (
            <input-field>
                  <label>{label}</label>
                  <input 
                        type={inputType===undefined?"text":inputType} 
                        className="rootInput" 
                        name={inputName} 
                        label={inputLabel} 
                        requirements={inputRequirements} 
                        defaultValue={inputValue}
                  />
                  <ErrorMessage/>
            </input-field>      
      )
}

function RadioButton(props) {
      const {inputName, inputValue, data} = props

      function handleClick(event) {
            const {name, value} = event.target

            const rootInput = document.querySelector(`.rootInput[name='${name}']`)
            const buttons = document.querySelectorAll(`button[name='${name}']`)

            for (const button of buttons)
                  button.classList.remove("selected")
            event.target.classList.add("selected")

            rootInput.value = value
            rootInput.dispatchEvent(new InputEvent("input", {bubbles:true}))
      }

      return (
            <button 
                  name={inputName} 
                  value={data[1]} 
                  onClick={e=>handleClick(e)} 
                  className={inputValue===data[1]?"selected":""} 
                  type="button">{data[0]}
            </button>   
      )
}

function Radio(props) {
      const {label, inputName, inputValue, buttonLabels} = props
      return (
            <input-field>
                  <label>{label}</label>
                  <input-segment>
                        {buttonLabels.map(buttonLabel => 
                              <RadioButton inputName={inputName} inputValue={inputValue} data={buttonLabel}/>
                        )}
                  </input-segment>
                  <ErrorMessage/>
                  <HiddenInput data={props}/>
            </input-field>
      )
}

function Select(props) {
      const {label, inputName, inputLabel, inputRequirements, inputValue, options} = props
      return (
            <input-field>
                  <label>{label}</label>
                  <select
                        className="rootInput" 
                        name={inputName} 
                        label={inputLabel} 
                        requirements={inputRequirements} 
                        value={inputValue}
                  >
                        {options.map(option => 
                              <option value={option[1]}>{option[0]}</option>
                        )}
                  </select>
                  <ErrorMessage/>
            </input-field>
      )
}

function Checkbox(props) {
      const {inputName, inputValue, data} = props

      function handleClick(event) {
            if (event.target.tagName === "CHECKBOX-BUTTON" || event.target.tagName === "CHECKBOX-LABEL") {
                  event.target.parentElement.dispatchEvent(new Event("click", {bubbles:true}))
                  return
            }

            const {name, value} = event.target
            const rootInput = document.querySelector(`.rootInput[name='${name}']`)

            if (rootInput.value === "" || rootInput.value === undefined)
                  rootInput.value = "[]"
            
            let valueJSON = JSON.parse(rootInput.value)
            
            event.target.classList.toggle("selected")
            event.target.classList.contains("selected") ? valueJSON.push(value) : valueJSON.splice(valueJSON.indexOf(value), 1)

            rootInput.value = JSON.stringify(valueJSON)
            rootInput.dispatchEvent(new InputEvent("input", {bubbles:true}))
      }

      return (
            <button 
                  type="button"
                  name={inputName} 
                  value={data[1]} 
                  onClick={e=>handleClick(e)} 
                  className={inputValue !== undefined && inputValue.includes(data[1])?"selected":""}
            >
                  <checkbox-button>
                        <CheckSVG/>
                  </checkbox-button>
                  <checkbox-label>{data[0]}</checkbox-label>
            </button>       
      )
}

function Checkboxes(props) {
      const {label, inputName, inputValue, checkboxLabels} = props
      return (
            <input-field>
                  <label>{label}</label>
                  <checkbox-container>
                        {checkboxLabels.map(checkboxLabel => 
                              <Checkbox inputName={inputName} inputValue={inputValue} data={checkboxLabel}/>
                        )}
                  </checkbox-container>
                  <ErrorMessage/>
                  <HiddenInput data={props}/>
            </input-field>
      )
}