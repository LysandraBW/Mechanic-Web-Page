import {Error} from "../../static/scripts/Form_Check_V3/Error.js"
import {FormCheck} from "../../static/scripts/Form_Check_V3/FormCheck.js"

class Form extends React.Component {
      constructor(props) {
            super(props)

            this.state = {
                  formData: {},
                  formIndex: 0
            }

            this.FC = new FormCheck()
            this.FC.getName = node => node.getAttribute("name")
            this.FC.getRequirements = node => node.getAttribute("requirements")
            this.FC.getData = name => document.querySelector(`.rootInput[name='${name}']`).value
            this.FC.getLabel = name => document.querySelector(`.rootInput[name='${name}']`).getAttribute("label")
            this.FC.delError = name => document.querySelector(`.rootInput[name='${name}']`).closest("input-field").classList.remove("error")
            this.FC.addError = ({name, inputData, inputLabel, errorCodes}) => {
                  let field = document.querySelector(`.rootInput[name='${name}']`).closest("input-field")
                  field.classList.add("error")
                  field.querySelector(".error-message").textContent = Error.ErrorMessage({"inputData": inputData, "inputLabel": inputLabel, "errorCodes": errorCodes})
            }

            this.rootInputs = []
      }

      initializeRootInputs() {
            this.rootInputs = []

            const rootInputs = document.getElementsByClassName("rootInput")
            
            for (let i = 0; i < rootInputs.length; i++) {
                  rootInputs[i].addEventListener("input", (e) => this.handleChange(e))
                  this.addListener(rootInputs[i])
                  this.rootInputs.push(rootInputs[i])
            }
      }

      updateRootInputs() {
            this.initializeRootInputs()
            this.FC.DOMLoad({inputs: this.rootInputs})
      }

      handleChange(event) {
            const {name, value, type, checked} = event.target
            this.setState(state => ({
                  formData: {...state.formData, [name]: value}
            }), () => console.log(this.state.formData))
      }

      componentDidMount() {
            this.updateRootInputs()
      }
      
      handleForm(action) {}
      addListener(rootInput) {}
      render() {}
}

export {Form}