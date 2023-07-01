import * as co from "../data/constants.js"
import {getLabelFromData} from "../data/data.js"
import {Form} from "../components/form/Form.js"

function Report(props) {
      return (
            <div>
                  <header>
                        <h3>User Report</h3>
                        <span>{props.data[co.ID]}</span>
                  </header>
                  <table id="info">
                        <thead>
                              <tr>
                                    <td>What</td>
                                    <td>Description</td>
                              </tr>
                        </thead>
                        <tbody>
                              <tr>
                                    <td>Name</td>
                                    <td>{props.data[co.fName]} {props.data[co.lName]}</td>
                              </tr>
                              <tr>
                                    <td>Vehicle</td>
                                    <td>{props.data[co.year]} {getLabelFromData(co.make, props.data[co.make])} {props.data[co.model]}</td>
                              </tr>
                              <tr>
                                    <td>Status</td>
                                    <td>{getLabelFromData(co.status, props.data[co.status])}</td>
                              </tr>
                              <tr>
                                    <td>Date & Time</td>
                                    <td>{props.data[co.date] === null || props.data[co.time] === null ? "N/A" : `${props.data[co.date]} ${props.data[co.time]}`}</td>
                              </tr>
                              <tr>
                                    <td>Services</td>
                                    <td>
                                          <ul>{JSON.parse(props.data[co.services]).map(service => <li>{service}</li>)}</ul>
                                    </td>
                              </tr>
                              <tr>
                                    <td>Cost</td>
                                    <td>{props.data[co.cost] === null ? "N/A" : `${props.data[co.cost]}`}</td>
                              </tr>
                        </tbody>
                  </table>
            </div>
      )
}

function Default() {
      return (
            <div>
                  <header>
                        <h3>User Report</h3>
                        <span></span>
                  </header>
                  <p class="wait">
                        <ThreeDotsSVG/>
                        <span>Fill out the form to see your appointment.</span>
                  </p>
            </div>
      )
}

function Error() {
      return (
            <div>
                  <header>
                        <h3>User Report</h3>
                        <span></span>
                  </header>
                  <p class="error">
                        <ExclamationTriangleSVG/>
                        <span>Appointment Not Found</span>
                        <span>Please try again.</span>
                  </p>
            </div>
      )
}

class Find extends Form {
      constructor() {
            super()
            this.state = {
                  ...this.state,
                  good: null,
                  error: false
            }
            this.size = 2
      }

      handleForm() {
            this.FC.check({handleError: true}).then((response) => {
                  if (response[0]) {
                        fetch("/find", {
                              method: "POST", 
                              headers: {"Content-Type": "application/json"},
                              body: JSON.stringify(this.state.formData)
                        })
                        .then(response => response.json())
                        .then(data => {
                              this.setState({good: [data.good, data.result.appointment]}, () => {
                                    if (this.state.good[0]) 
                                          this.setState({formIndex: 1, error: false})
                                    else 
                                          this.setState({formIndex: 0, error: true})
                              })
                        })
                  }
                  else this.setState({formIndex: 0, error: true})
            })
      }

      render() {
            return (
                  <div>
                        <Nav/>
                        <section id="main">
                              <section id="content">
                                    <header>
                                          <h1>Find Your<br/>Appointment</h1>
                                    </header>
                                    <ProgressBar 
                                          error={this.state.error} 
                                          size={this.size} 
                                          done={this.state.formIndex+1} 
                                          labels={["Complete Information", "Done"]}
                                    />
                                    <form>
                                          <Text 
                                                label="Appointment ID" 
                                                inputName={co.ID} 
                                                inputLabel="Appointment ID" 
                                                inputRequirements="ID"
                                          />
                                          <Text 
                                                label="Email Address" 
                                                inputName={co.email} 
                                                inputLabel="Email address" 
                                                inputRequirements="email"
                                          />
                                    </form>
                                    <button-container>
                                          <button id="check" onClick={() => this.handleForm()}>
                                                <span>Find Appointment</span>
                                                <ArrowRightShortSVG/>
                                          </button>
                                          <span id="redirect">Haven't made an appointment? <a href="/schedule">Schedule one.</a></span>
                                    </button-container>
                              </section>
                              <section id="results">
                                    <div id="info-box">
                                          {this.state.good === null &&  
                                                <Default/>
                                          }
                                          {(this.state.good !== null && this.state.good[0]) && 
                                                <Report data={this.state.good[1]}/>
                                          }
                                          {(this.state.good !== null && !this.state.good[0]) && 
                                                <Error/>
                                          }
                                    </div>
                              </section>
                        </section>
                  </div>
            )
      }
}
ReactDOM.render(<Find action="/schedule" method="POST"/>, document.querySelector("body"))