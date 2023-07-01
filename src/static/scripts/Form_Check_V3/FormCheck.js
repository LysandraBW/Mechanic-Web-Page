import {Require} from "./Require.js"
import "./Configure.js"

export class FormCheck {
      #inputRequirements = {}

      #FCIdentifier = null
      #getName = (node) => {}
      #getRequirements = (node) => {}
      #getData = (name) => {}
      #getLabel = (name) => {}
      #addError = ({name, inputData, inputLabel, errorCodes}) => {}
      #delError = (name) => {}

      constructor() {}

      DOMLoad(p = {}) {
            this.#inputRequirements = {}

            let load = (T = this) => {
                  const parent = p.parent === undefined ? document : p.parent
                  const inputs = p.inputs === undefined ? parent.querySelectorAll(T.#FCIdentifier) : p.inputs

                  for (let i = 0; i < inputs.length; i++) {
                        let name = T.#getName(inputs[i])
                        let requirements = T.#getRequirements(inputs[i])
                        requirements = (requirements === "" || requirements === undefined || requirements === null) ? null : evaluateRequirements(requirements)
                        T.#inputRequirements[name] = requirements
                  }
            }
            load()
      }

      baseLoad(inputRequirements) {
            this.#inputRequirements = inputRequirements
      }

      async check(p = {}) {
            const handleError = p.handleError === undefined ? false : p.handleError
            const inputRequirements = p.inputRequirements === undefined ? this.#inputRequirements : p.inputRequirements
            const inputData = p.inputData === undefined ? (name) => {return this.#getData(name)} : (name) => {return p.inputData[name]}

            const errors = {}
            let hasError = false

            if (p.strict !== undefined && p.strict === true) {
                  for (const [name, data] of Object.entries(p.inputData)) {
                        if (inputRequirements[name] === null)
                              continue
                        
                        let requirements = inputRequirements[name]

                        console.log(name, requirements)
                        for (let requirement of requirements) {
                              if (requirement === null) 
                                    return

                              let result = null
                              if (Array.isArray(requirement))
                                    result = await Require.run(requirement[0], [data].concat(requirement[1]), true)
                              else
                                    result = await Require.run(requirement, data)

                              if (!Object.hasOwn(errors, name)) 
                                    errors[name] = []
                              
                              console.log(result)
                              result.forEach(errorCode => {
                                    if (!errors[name].includes(errorCode))
                                          errors[name].push(errorCode)
                                    hasError = true
                              })
                        }
                  }
            }
            else {
                  for (const [name, requirements] of Object.entries(inputRequirements)) {
                        if (requirements === null) 
                              continue
      
                        for (let requirement of requirements) {
                              if (requirement === null) 
                                    return
      
                              let result = null
                              if (Array.isArray(requirement))
                                    result = await Require.run(requirement[0], [inputData(name)].concat(requirement[1]), true)
                              else
                                    result = await Require.run(requirement, inputData(name))
      
                              if (!Object.hasOwn(errors, name)) 
                                    errors[name] = []
      
                              result.forEach(errorCode => {
                                    if (!errors[name].includes(errorCode))
                                          errors[name].push(errorCode)
                                    hasError = true
                              })
                        }
                  }
            }
            
            if (handleError) {
                  for (const [name, errorCodes] of Object.entries(errors)) {
                        if (errorCodes.length === 0)
                              this.#delError(name)
                        else
                              this.#addError({"name": name, "inputData": inputData(name), "inputLabel": this.#getLabel(name), "errorCodes": errorCodes})
                  }
            }
            
            return [!hasError, errors]
      }      

      set FCIdentifier(identifier) {
            this.#FCIdentifier = identifier
      }

      set getData(f) {
            this.#getData = f
      }

      set getName(f) {
            this.#getName = f
      }

      set getRequirements(f) {
            this.#getRequirements = f
      }

      set getLabel(f) {
            this.#getLabel = f
      }

      set addError(f) {
            this.#addError = f
      }

      set delError(f) {
            this.#delError = f
      }
}

function evaluateRequirements(requirements) {
      requirements = requirements.split(" ")
      requirements = requirements.map(r => {
            r = r.replace(/\s/g, '')

            const leftParantheses = r.indexOf("(")
            const rightParentheses = r.indexOf(")")
            
            if (leftParantheses === -1 || rightParentheses === -1)
                  return r
            return [r.slice(0, leftParantheses), (r.slice(leftParantheses + 1, rightParentheses)).split(",")]
      })
      return requirements
}