import * as co from "../data/constants.js"
import {fetchModels, fetchMakeModelYear} from "../static/scripts/carFetch.js"
import {Compare} from "../static/scripts/Form_Check_V3/Checker.js"
import {Form} from "../components/form/Form.js"
import {getLabelData} from "../data/data.js"

// This component is rendered when the form is erroneous
function BadForm() {
      return (
            <message-box class="error">
                  <h1>Appointment Not Created</h1>
                  <p>Your appointment could not be created.<br/>If this issue persists, please contact us.</p>
                  <button>
                        <span><a href="/schedule">Try Again</a></span>
                        <ArrowRightShortSVG/>
                  </button>
            </message-box>           
      )
}

// This component is rendered when the form is good
function GoodForm(props) {
      console.log(props.ID)
      return (
            <message-box class="good">
                  <h1>Appointment Created</h1>
                  <p>Your appointment ({props.ID}) has successfully been created.<br/>Thank you for using Waltronics.</p>
                  <button>
                        <span><a href="/find">Check Apppointment</a></span>
                        <ArrowRightSVG/>
                  </button>
            </message-box>
      )
}

class Schedule extends Form {
      constructor() {
            super()

            // State
            this.state = {
                  ...this.state,
                  good: null,
                  error: false,
                  modelNames: []
            }

            // # of Parts in Form
            this.size = 3
            this.lastFormIndex = this.size - 1

            // Readability
            this.SUBMITTED = -1
            this.PERSONAL = 0
            this.VEHICLE = 1
            this.SERVICES = 2
      }

      addListener(rootInput) {
            // Make
            if (rootInput.name === co.make) {
                  rootInput.addEventListener("change", () => {
                        fetchModels(rootInput.value).then((response) => {
                              this.setState({modelNames: response}, () => Compare[co.model] = response.map(x => x[1]))
                        })
                  })
            }
            // VIN
            else if (rootInput.name === co.VIN) {
                  rootInput.addEventListener("change", () => {
                        if (rootInput.value.length != 17) 
                              return

                        fetchMakeModelYear(rootInput.value).then((carData) => {
                              // Decoded Make/Model/Year
                              const {make, model, modelYear} = carData 

                              const inputMake = document.getElementsByName(co.make)[0]
                              const inputModel = document.getElementsByName(co.model)[0]
                              const inputYear = document.getElementsByName(co.year)[0]
                              
                              inputMake.value = make

                              fetchModels(inputMake.value).then((response) => {
                                    this.setState({modelNames: response}, () => {
                                          Compare[co.model] = response.map(x => x[1])

                                          inputModel.value = model
                                          inputYear.value = modelYear

                                          inputMake.dispatchEvent(new InputEvent("input", {bubbles:true}))
                                          inputModel.dispatchEvent(new InputEvent("input", {bubbles:true}))
                                          inputYear.dispatchEvent(new InputEvent("input", {bubbles:true}))
                                    })
                              })
                        })
                  })
            }
      }

      handleForm(action) {
            // Go Forward
            if (action) {
                  this.FC.check({handleError: true}).then((response) => {
                        this.setState({error: false}) // Reset

                        // Good Form
                        if (response[0]) {
                              // Submit Form
                              if (this.state.formIndex === this.lastFormIndex) {
                                    fetch("/schedule", {
                                          method: "POST", 
                                          headers: {"Content-Type": "application/json"},
                                          body: JSON.stringify(this.state.formData)
                                    })
                                    .then(response => response.json())
                                    .then(data => this.setState({good: [data.good, data.result.ID], formIndex: this.SUBMITTED}))
                              }
                              // Proceed
                              else this.goForward() 
                        }
                        // Bad Form
                        else this.setState({error: true})
                  })
            }
            // Go Back
            else this.goBack()
      }

      goForward() {
            this.setState({formIndex: Math.min(this.state.formIndex + 1, this.size - 1)}, () => super.updateRootInputs())
      }

      goBack() {
            this.setState({formIndex: Math.max(0, this.state.formIndex-1)}, () => super.updateRootInputs())
      }

      render() {
            return (
                  <div>
                        <Nav/>
                        <section id="main">
                              <section id="content">
                                    {this.state.formIndex === this.SUBMITTED && this.state.good[0] && 
                                          <GoodForm ID={this.state.good[1]}/>
                                    }
                                    {this.state.formIndex === this.SUBMITTED && !this.state.good[0] && 
                                          <BadForm/>
                                    }
                                    {this.state.formIndex !== this.SUBMITTED &&
                                          <header>
                                                <h1>Create Your<br/>Appointment</h1>
                                          </header>
                                    }
                                    {this.state.formIndex !== this.SUBMITTED &&
                                          <ProgressBar 
                                                error={this.state.error} 
                                                size={this.size} 
                                                done={this.state.formIndex+1} 
                                                labels={["Personal", "Vehicle", "Services"]}
                                          />
                                    }
                                    {this.state.formIndex === this.PERSONAL && 
                                          <form action={this.props.action} method={this.props.method}>
                                                <div className="leveled">
                                                      <Text 
                                                            label="First Name" 
                                                            inputName={co.fName} 
                                                            inputLabel="First name" 
                                                            inputRequirements="name"
                                                      />
                                                      <Text 
                                                            label="Last Name" 
                                                            inputName={co.lName} 
                                                            inputLabel="Last name" 
                                                            inputRequirements="name"
                                                      />
                                                </div>
                                                <Text 
                                                      label="Email Address" 
                                                      inputName={co.email} 
                                                      inputLabel="Email address" 
                                                      inputRequirements="email"
                                                />
                                                <Text 
                                                      label="Phone Number" 
                                                      inputName={co.phone} 
                                                      inputLabel="Phone number" 
                                                      inputRequirements="phone"
                                                />
                                                <Radio 
                                                      label="Contact Preference" 
                                                      inputName={co.contact} 
                                                      inputLabel="Contact preference" 
                                                      inputRequirements="contact" 
                                                      buttonLabels={getLabelData(co.contact)}                                                
                                                />
                                          </form>  
                                    }
                                    {this.state.formIndex === this.VEHICLE && 
                                          <form action={this.props.action} method={this.props.method}>
                                                <Text 
                                                      label="Vehicle Identification Number (VIN)" 
                                                      inputName={co.VIN}  
                                                      inputLabel="VIN" 
                                                      inputRequirements="VIN"
                                                />
                                                <Select 
                                                      label="Make" 
                                                      inputName={co.make} 
                                                      inputLabel="Make" 
                                                      inputRequirements="make" 
                                                      options={[["Make", ""], ...getLabelData(co.make)]}                                                
                                                />
                                                <Select 
                                                      label="Model" 
                                                      inputName={co.model} 
                                                      inputLabel="Model" 
                                                      inputRequirements="model"  
                                                      options={[["Model", ""], ...this.state.modelNames]}                                                
                                                />
                                                <Select 
                                                      label="Year" 
                                                      inputName={co.year} 
                                                      inputLabel="Year" 
                                                      inputRequirements="year" 
                                                      options={[["Year", ""], ...getLabelData(co.year)]}                                                
                                                />
                                          </form> 
                                    }
                                    {this.state.formIndex === this.SERVICES && 
                                          <form action={this.props.action} method={this.props.method}>
                                                <Checkboxes 
                                                      label="Services" 
                                                      inputName={co.services} 
                                                      inputLabel="Services" 
                                                      inputRequirements="services" 
                                                      checkboxLabels={getLabelData(co.services)}
                                                />
                                          </form> 
                                    }
                                    {this.state.formIndex !== this.SUBMITTED &&
                                          <button-container>
                                                <button id="continue" onClick={() => this.handleForm(true)}>Continue</button>
                                                <button id="back" onClick={() => this.handleForm(false)}>
                                                      <LeftArrowSVG/>
                                                      <span>Back</span>
                                                </button>
                                          </button-container>
                                    }
                              </section>
                        </section>
                  </div>
            )
      }
}
ReactDOM.render(<Schedule action="/schedule" method="POST"/>, document.querySelector("body"))