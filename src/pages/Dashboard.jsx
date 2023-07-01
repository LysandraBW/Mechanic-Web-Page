import * as co from "../data/constants.js"
import {getLabelData, getLabelFromData} from "../data/data.js"
import {Form} from "../components/form/Form.js"
import {fetchModels, fetchMakeModelYear} from "../static/scripts/carFetch.js"
import {Compare} from "../static/scripts/Form_Check_V3/Checker.js"

function formatDateTime(dt) {
      let datetime = new Date(dt).toLocaleString()
      datetime = datetime.split(" ")
      let date = new Date(datetime[0]).toDateString()
      let time = formatTime(datetime[1])
      return date + " " + time
}

function formatDate(d) {
      if (d === null)
            return "N/A"
      return new Date(d).toDateString()
}

function formatTime(t) {
      if (t === null)
            return "N/A"
      
      let time = t.split(":")
      
      let formattedTime = ""
      
      if (time[0] == "00") 
            formattedTime += "12"
      else if (Number(time[0]) > 12) 
            formattedTime += "0" + (Number(time[0]) - 12)
      else 
            formattedTime += (time[0].length === 1) ? "0" + time[0] : time[0]
    
      formattedTime += ":" + time[1] + " " + (Number(time[0]) >= 12 ? "PM" : "AM")
  
      return formattedTime
}

function Banner() {
      return (
            <section id="page-banner" class="blur">
                  <img-logo>
                        <img src=""/>
                  </img-logo>
                  <header>
                        <div id="intro">
                              <h1>Hello, Name</h1>
                              <p>It's time to work.</p>
                        </div>
                        <header-profile>
                              <header-profile-links>
                                    <BellSVG/>
                                    <GearSVG/>
                                    <QuestionSVG/>
                              </header-profile-links>
                              <profile-picture>
                              </profile-picture>
                              <contact-information>
                                    <span>Name Name</span>
                                    <span>Email Address</span>
                              </contact-information>
                        </header-profile>
                  </header>
            </section>
      )
}

function Navbar() {
      return (
            <nav>
                  <a class="primary-button">
                        <CreateSVG/>
                        <span>Create Appointment</span>
                  </a>
                  <ul-links>
                        <ul>
                              <a class="selected">
                                    <DashboardSVG/>
                                    <span>Dashboard</span>
                              </a>
                        </ul>
                        <ul>
                              <a>
                                    <SettingsSVG/>
                                    <span>Settings</span>
                              </a>
                              <a>
                                    <LogoutSVG/>
                                    <span>Logout</span>
                              </a>
                        </ul>
                  </ul-links>
            </nav>
      )
}

function Tabs(props) {
      const {tabs, selectedTab} = props

      return (
            <dashboard-tabs>
                  {tabs.map((tab, index) => {
                        let selected = selectedTab.toLowerCase() === tab[0].toLowerCase()
                        return (
                              <a className={selected ? "selected" : ""} tabValue={tab[1]} onClick={e => props.clickHandler(e)}>
                                    {selected ? <OpenFolderSVG/> : <ClosedFolderSVG/>}
                                    <span>{tab[0]}</span>
                              </a>
                        )
                  })}
            </dashboard-tabs>
      )
}

class Dashboard extends Form {
      constructor(props) {
            super(props)

            this.state = {
                  ...this.state,
                  selectedTab: "all",
                  appointments: [],
                  selectedAppointment: null,
                  editorMode: this.VIEW,
                  modelNames: []
            }

            this.selectAppointment = this.selectAppointment.bind(this)

            // When an appointment is opened, the stored make/model/year are loaded in
            this.initializeMMY = false
            this.initializeDashboard = true

            // Stores the appointments that have been checked
            this.selectedAppointments = []

            // Actions
            this.VIEW = "view"
            this.EDIT = "edit"
            this.SAVE = "SAVE"
            this.DELETE = "DELETE"
            this.CANCEL = "CANCEL"
            this.UPDATE = "UPDATE"
            this.DELETE_MULTIPLE = "DELETE_MULTIPLE"
            this.MARK = "MARK"
            this.SEEN = "SEEN"
      }

      addListener(rootInput) {
            if (rootInput.name === co.make) {
                  rootInput.addEventListener("change", () => {
                        fetchModels(document.getElementsByName(co.make)[0].value).then((response) => {
                              this.setState({modelNames: response}, () => {
                                    Compare[co.model] = response.map(x => x[1])
                                    document.getElementsByName(co.model)[0].selectedIndex = 0
                                    document.getElementsByName(co.model)[0].dispatchEvent(new InputEvent("input", {bubbles:true}))
                              })
                        })
                  })
            }
            else if (rootInput.name === co.VIN) {
                  rootInput.addEventListener("change", () => {
                        if (rootInput.value.length != 17) 
                              return

                        fetchMakeModelYear(rootInput.value).then((carData) => {
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


      selectTab(e) {
            if (e.target.tagName !== "A") {
                  e.target.parentElement.dispatchEvent(new Event("click", {bubbles:true}))
                  return
            }

            this.selectedAppointments = []
            document.querySelector("table-row.head").classList.remove("selected")
            
            const selectedTabValue = e.target.getAttribute("tabValue")
            const rows = document.getElementsByTagName("table-row")

            for (let i = 1; i < rows.length; i++) {
                  rows[i].classList.remove("selected")
            }

            fetch(`/appointments/${selectedTabValue}`, {method: "POST", headers: {"Content-Type": "application/json"}})
            .then(response => response.json())
            .then(data => this.setState({selectedTab: selectedTabValue, appointments: data.result.appointments}))            
      }

      selectAppointment(e) {
            // Clicking these certain elements should not be handled by this function
            if (["CHECKBOX-BUTTON", "svg", "path"].includes(e.target.tagName)) {
                  return
            }
            // Delegating the click upwards
            else if (e.target.tagName !== "TABLE-ROW") {
                  e.target.parentElement.dispatchEvent(new Event("click", {bubbles:true}))
                  return
            }     
            
            // Looking for a matching appointment ID
            for (const appointment of this.state.appointments) {
                  if (Number(appointment[co.ID]) === Number(e.target.getAttribute("id"))) {
                        // Initialization goes bing bong
                        this.setState({selectedAppointment: appointment, editorMode: this.VIEW, formData: {}})

                        // Initialize the form w/ the values
                        this.initializeForm(appointment)

                        // The appointment has been seen
                        fetch(`/appointments/mod`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({action: this.SEEN, "appointment": appointment})})
                        .then(response => response.json())
                        .then(() => this.handleRefresh())
                        break
                  }
            }            
      }

      initializeEditor() {
            // Set Make
            document.getElementsByName(`${co.make}`)[0].value = this.state.selectedAppointment[co.make]

            // Get Models + Set Model + Comparison
            fetchModels(document.getElementsByName(`${co.make}`)[0].value).then((response) => {
                  this.setState({modelNames: response})
                  Compare[co.model] = response.map(x => x[1])
                  document.getElementsByName(`${co.model}`)[0].value = this.state.selectedAppointment[co.model]
            })

            // Set Year
            document.getElementsByName(`${co.year}`)[0].value = this.state.selectedAppointment[co.year]

            // Misc Values
            document.querySelector(`.rootInput[name='${co.services}']`).value = JSON.stringify(JSON.parse(this.state.selectedAppointment[co.services]))
            document.querySelector(`.rootInput[name='${co.contact}']`).value = this.state.selectedAppointment[co.contact]
            document.querySelector(`.rootInput[name='${co.status}']`).value = this.state.selectedAppointment[co.status]

            this.updateRootInputs()
      }

      initializeForm(selectedAppointment) {
            this.setState({formData: {
                  [co.ID]: String(selectedAppointment[co.ID]),
                  [co.fName]: selectedAppointment[co.fName],
                  [co.lName]: selectedAppointment[co.lName],
                  [co.phone]: selectedAppointment[co.phone],
                  [co.email]: selectedAppointment[co.email],
                  [co.contact]: selectedAppointment[co.contact],
                  [co.VIN]: selectedAppointment[co.VIN],
                  [co.make]: selectedAppointment[co.make],
                  [co.model]: selectedAppointment[co.model],
                  [co.year]: selectedAppointment[co.year],
                  [co.status]: selectedAppointment[co.status],
                  [co.cost]: selectedAppointment[co.cost],
                  [co.date]: selectedAppointment[co.date],
                  [co.time]: selectedAppointment[co.time],
                  [co.services]: selectedAppointment[co.services]
            }})
      }

      toggleEditor(e) {
            if (e.target.tagName !== "BUTTON") {
                  e.target.parentElement.dispatchEvent(new Event("click"), {bubbles: true})
                  return
            }

            // The make/model/year of a vehicle is only initialized when the editor is in its edit mode
            this.initializeMMY = this.state.editorMode === this.VIEW
            e.target.getAttribute("inline-view") === this.VIEW ? this.setState({editorMode: this.EDIT}) : this.setState({editorMode: this.VIEW})
      }

      
      handleEditorExit() {
            this.setState({selectedAppointment: null})
      }

      handleForm(action) {
            if (action === this.SAVE) {
                  this.FC.check({handleError: true}).then((response) => {
                        this.setState({error: false})
                        if (response[0]) {
                              fetch("/appointments/mod", {
                                    method: "POST", 
                                    headers: {"Content-Type": "application/json"},
                                    body: JSON.stringify({action: this.UPDATE, ...this.state.formData})
                              })
                              .then((response) => {
                                    this.handleRefresh()
                                    this.handleEditorExit()
                              })
                        }
                        else
                              this.setState({error: true})
                  })
            }
            else if (action === this.DELETE) {
                  fetch("/appointments/mod", {
                        method: "POST", 
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({action: this.DELETE, ...this.state.formData})
                  })
                  .then((response) => {
                        this.handleRefresh()
                        this.handleEditorExit()
                  })
            }
            else if (action === this.CANCEL) {
                  this.handleEditorExit()
            }
      }

      handleBookmark(e) {
            if (e.target.tagName !== "svg") {
                  e.target.closest("svg").dispatchEvent(new Event("click", {bubbles:true}))
                  return
            }
            
            const tableRow = e.target.closest("table-row")
            const classList = tableRow.classList
            const starred = classList.contains("starred")

            starred ? classList.remove("starred") : classList.add("starred")

            fetch(`/appointments/mod`, {
                  method: "POST", 
                  headers: {"Content-Type": "application/json"}, 
                  body: JSON.stringify({action: this.MARK, "appointment": {[co.ID]: Number(tableRow.getAttribute("id")), [co.mark]: starred}})
            })
            .then(() => this.handleRefresh(true)) 
      }

      uncheckAll() {
            const rows = document.getElementsByTagName("table-row")
            for (let i = 1; i < rows.length; i++) {
                  let rowID = rows[i].getAttribute("id")
                  rows[i].classList.remove("selected")
                  this.selectedAppointments.splice(this.selectedAppointments.indexOf(rowID), 1)
            }
            document.querySelector("table-row.head").classList.remove("selected")
      }

      checkAll() {
            const rows = document.getElementsByTagName("table-row")
            for (let i = 1; i < rows.length; i++) {
                  rows[i].classList.add("selected")
                  if (!this.selectedAppointments.includes(rows[i].getAttribute("id")))
                        this.selectedAppointments.push(rows[i].getAttribute("id"))
            }
            document.querySelector("table-row.head").classList.add("selected")
      }

      handleCheckbox(e) {
            if (e.target.tagName !== "CHECKBOX-BUTTON") {
                  e.target.closest("checkbox-button").dispatchEvent(new Event("click", {bubbles:true}))
                  return
            }

            const tableRow = e.target.closest("table-row")
            const tableRowID = tableRow.getAttribute("id")
            const classList = tableRow.classList
            const checkboxController = e.target.getAttribute("id") === "checkbox-controller"

            // Toggling All or None of the Checkboxes
            if (checkboxController) {
                  this.selectedAppointments = []

                  if (classList.contains("selected")) {
                        this.uncheckAll()
                  }
                  else {
                        this.checkAll()
                  }
                  console.log(this.selectedAppointments)
                  return
            }

            // Toggling One Checkbox
            if (classList.contains("selected")) {
                  tableRow.classList.remove("selected")
                  this.selectedAppointments.splice(this.selectedAppointments.indexOf(tableRowID), 1)
            }
            else {
                  tableRow.classList.add("selected")
                  if (!this.selectedAppointments.includes(tableRow.getAttribute("id")))
                        this.selectedAppointments.push(tableRowID)
            }

            // All Checkboxes are Selected => Toggle the Head Checkbox to On (Likewise w Unselected)
            if (this.selectedAppointments.length === document.querySelectorAll("table-row").length - 1) {
                  if (!document.querySelector("table-row.head").classList.contains("selected")) 
                        document.querySelector("table-row.head").classList.add("selected")
            }
            else
                  document.querySelector("table-row.head").classList.remove("selected")
      }

      handleDeletion(e) {
            fetch("/appointments/mod", {
                  method: "POST", 
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify({action: this.DELETE_MULTIPLE, IDs: this.selectedAppointments})
            })
            .then(() => this.handleRefresh())
      }

      handleRefresh(keepChecks = false) {
            fetch(`/appointments/${this.state.selectedTab}`, {
                  method: "POST", 
                  headers: {"Content-Type": "application/json"}
            })
            .then(response => response.json())
            .then(data => this.setState({appointments: data.result.appointments})) 

            if (!keepChecks)
                  this.uncheckAll() 
      }

      componentDidMount() {
            if (this.initializeDashboard) {
                  fetch(`/appointments/all`, {method: "POST", headers: {"Content-Type": "application/json"}})
                  .then(response => response.json())
                  .then(data => this.setState({appointments: data.result.appointments})) 
                  this.initializeDashboard = false
            }
      }

      componentDidUpdate() {
            // Unfortunately there is no hooks, so I had to resort to this monstrosity!
            if (this.initializeMMY) {
                  this.initializeEditor()
                  this.initializeMMY = false
            }
      }
      
      render() {
            return (
                  <div>
                        <Banner/>
                        <section id="page-content">
                              <Navbar/>
                              <dash-board>
                                    <dashboard-actions>
                                          <a onClick={(e) => this.handleDeletion(e)}>
                                                <TrashSVG/>
                                                <span>Delete</span>
                                          </a>
                                          <a onClick={(e) => this.handleRefresh(e)}>
                                                <LoopSVG/>
                                                <span>Refresh</span>
                                          </a>
                                    </dashboard-actions>
                                    <Tabs
                                          tabs={[["All", "all"], ["Unseen", "unseen"], ["Seen", "seen"], ["Unscheduled", "unscheduled"], ["Scheduled", "scheduled"], ["In Progress", "in progress"], ["Completed", "completed"], ["Starred", "starred"]]} 
                                          selectedTab={this.state.selectedTab} 
                                          clickHandler={(event) => this.selectTab(event, this)} 
                                          this={this}                                    
                                    />
                                    <dashboard-table>
                                          <table-row class="head">
                                                <table-cell>
                                                      <checkbox-button id="checkbox-controller" onClick={(e) => this.handleCheckbox(e)}>
                                                            <CheckSVG/>
                                                      </checkbox-button>
                                                </table-cell>
                                                <table-cell>
                                                      <BookmarkSVG/>
                                                </table-cell>
                                                <table-cell>Date Created</table-cell>
                                                <table-cell>Name</table-cell>
                                                <table-cell>Vehicle</table-cell>
                                                <table-cell>Status</table-cell>
                                                <table-cell>Scheduled Date</table-cell>
                                                <table-cell>Cost</table-cell> 
                                          </table-row>
                                          {this.state.appointments.map(appointment => {
                                                return (
                                                      <table-row 
                                                            class={`${appointment[co.seen] ? "" : "unseen"}`+` ${appointment[co.mark] ? "starred" : ""}` + ` ${this.selectedAppointments.includes(String(appointment[co.ID])) ? "selected" : ""}`} 
                                                            onClick={(e) => this.selectAppointment(e)} 
                                                            id={appointment[co.ID]}
                                                      >
                                                            <table-cell>
                                                                  <checkbox-button onClick={(e) => this.handleCheckbox(e)}>
                                                                        <CheckSVG/>
                                                                  </checkbox-button>
                                                            </table-cell>
                                                            <table-cell>
                                                                  {
                                                                        appointment[co.mark] 
                                                                        ?  
                                                                              <svg onClick={(e) => this.handleBookmark(e)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                                                                    <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path>
                                                                              </svg>
                                                                        : 
                                                                              <svg onClick={(e) => this.handleBookmark(e)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
                                                                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                                                                              </svg>
                                                                  }
                                                            </table-cell>
                                                            <table-cell>{formatDateTime(appointment[co.created])}</table-cell>
                                                            <table-cell>{appointment[co.fName]} {appointment[co.lName]}</table-cell>
                                                            <table-cell>{appointment[co.year]} {getLabelFromData(co.make, appointment[co.make])} {appointment[co.model]}</table-cell>
                                                            <table-cell>{getLabelFromData(co.status, appointment[co.status])}</table-cell>
                                                            <table-cell>{appointment[co.date] === null || appointment[co.time] === null ? "N/A" : `${formatDate(appointment[co.date])} ${formatTime(appointment[co.time])}`}</table-cell>
                                                            <table-cell>{appointment[co.cost] === null ? "N/A" : `$${appointment[co.cost]}`}</table-cell> 
                                                      </table-row>
                                                )
                                          })}
                                    </dashboard-table>
                              </dash-board>
                              {this.state.selectedAppointment !== null && 
                                    <section id="inline-editor" className={this.state.editorMode}>
                                          <header>
                                                <h2>Manage Appointment</h2>
                                                <svg onClick={() => this.handleEditorExit()} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                </svg>
                                          </header>
                                          <div id="toggle-editor" value={this.VIEW}>
                                                <span>{this.state.editorMode.toUpperCase()}</span>
                                                <button onClick={e=>this.toggleEditor(e)} id="toggle-button" inline-view={this.state.editorMode}><span id="circle"></span></button>
                                          </div>
                                          <div class="data-section">
                                                <p>Personal</p>
                                                {this.state.editorMode===this.VIEW && 
                                                      <div class="data">
                                                            <p>
                                                                  <span>Name: </span>
                                                                  <span>{this.state.selectedAppointment[co.fName]} {this.state.selectedAppointment[co.lName]}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Email: </span>
                                                                  <span>{this.state.selectedAppointment[co.email]}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Phone Number: </span>
                                                                  <span>{this.state.selectedAppointment[co.phone]}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Contact Preference: </span>
                                                                  <span>{this.state.selectedAppointment[co.contact]}</span>
                                                            </p>
                                                      </div>
                                                }
                                                {this.state.editorMode===this.EDIT &&
                                                      <div class="data">
                                                            <Text
                                                                  label="First Name" 
                                                                  inputName={co.fName}
                                                                  inputLabel="First name" 
                                                                  inputRequirements="name" 
                                                                  inputValue={this.state.selectedAppointment[co.fName]}
                                                            />
                                                            <Text
                                                                  label="Last Name" 
                                                                  inputName={co.lName}
                                                                  inputLabel="Last name" 
                                                                  inputRequirements="name" 
                                                                  inputValue={this.state.selectedAppointment[co.lName]}
                                                            />
                                                            <Text
                                                                  label="Email Address" 
                                                                  inputName={co.email}
                                                                  inputLabel="Email address" 
                                                                  inputRequirements="email" 
                                                                  inputValue={this.state.selectedAppointment[co.email]}
                                                            />
                                                            <Text
                                                                  label="Phone Number" 
                                                                  inputName={co.phone}
                                                                  inputLabel="Phone number" 
                                                                  inputRequirements="phone" 
                                                                  inputValue={this.state.selectedAppointment[co.phone]}
                                                            />
                                                            <Radio
                                                                  label="Contact Preference" 
                                                                  inputName={co.contact}
                                                                  inputLabel="Contact preference" 
                                                                  inputRequirements="contact" 
                                                                  buttonLabels={getLabelData(co.contact)}  
                                                                  inputValue={this.state.selectedAppointment[co.contact]}                                            
                                                            />
                                                      </div>
                                                }
                                                
                                          </div>
                                          <div class="data-section">
                                                <p>Vehicle</p>
                                                {this.state.editorMode===this.VIEW &&
                                                      <div class="data">
                                                            <p>
                                                                  <span>Make: </span>
                                                                  <span>{getLabelFromData(co.make, this.state.selectedAppointment[co.make])}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Model: </span>
                                                                  <span>{this.state.selectedAppointment[co.model]}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Year: </span>
                                                                  <span>{this.state.selectedAppointment[co.year]}</span>
                                                            </p>
                                                            <p>
                                                                  <span>VIN: </span>
                                                                  <span>{this.state.selectedAppointment[co.VIN]}</span>
                                                            </p>
                                                      </div>                      
                                                }
                                                {this.state.editorMode===this.EDIT &&
                                                      <div class="data">
                                                            <Text
                                                                  label="Vehicle Identification Number (VIN)" 
                                                                  inputName={co.VIN} 
                                                                  inputLabel="VIN" 
                                                                  inputRequirements="VIN" 
                                                                  inputValue={this.state.selectedAppointment[co.VIN]}
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
                                                      </div>
                                                }
                                          </div>
                                          <div class="data-section">
                                                <p>Appointment</p>
                                                {this.state.editorMode===this.VIEW &&
                                                      <div class="data">
                                                            <p>
                                                                  <span>ID: </span>
                                                                  <span>{this.state.selectedAppointment[co.ID]}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Date: </span>
                                                                  <span>{formatDate(this.state.selectedAppointment[co.date])}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Time: </span>
                                                                  <span>{formatTime(this.state.selectedAppointment[co.time])}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Status: </span>
                                                                  <span>{getLabelFromData(co.status, this.state.selectedAppointment[co.status])}</span>
                                                            </p>
                                                            <p>
                                                                  <span>Cost: </span>
                                                                  <span>{this.state.selectedAppointment[co.cost] !== null ? `$${this.state.selectedAppointment[co.cost]}` : "N/A"}</span>
                                                            </p>
                                                      </div>
                                                }
                                                {this.state.editorMode===this.EDIT &&
                                                      <div class="data">
                                                            <Text
                                                                  label="Appointment Date" 
                                                                  inputName={co.date} 
                                                                  inputLabel="Appointment date" 
                                                                  inputRequirements="date" 
                                                                  inputValue={this.state.selectedAppointment[co.date]} 
                                                                  inputType="date"
                                                            />
                                                            <Text
                                                                  label="Appointment Time" 
                                                                  inputName={co.time} 
                                                                  inputLabel="Appointment time" 
                                                                  inputRequirements="time" 
                                                                  inputValue={this.state.selectedAppointment[co.time]}
                                                                  inputType="time"
                                                            />
                                                            <Radio
                                                                  label="Appointment Status" 
                                                                  inputName={co.status} 
                                                                  inputLabel="Appointment status" 
                                                                  inputRequirements="status" 
                                                                  buttonLabels={getLabelData(co.status)}  
                                                                  inputValue={this.state.selectedAppointment[co.status]}                                            
                                                            />      
                                                            <Text
                                                                  label="Appointment Cost" 
                                                                  inputName={co.cost} 
                                                                  inputLabel="Cost" 
                                                                  inputRequirements="cost" 
                                                                  inputValue={this.state.selectedAppointment[co.cost]}
                                                            />                             
                                                            <Checkboxes
                                                                  label="Services" 
                                                                  inputName={co.services} 
                                                                  inputLabel="Services" 
                                                                  inputRequirements="services" 
                                                                  inputValue={JSON.parse(this.state.selectedAppointment[co.services])} 
                                                                  checkboxLabels={getLabelData(co.services)}
                                                            />
                                                      </div>
                                                }
                                                {this.state.editorMode === this.EDIT &&
                                                      <div class="buttons">
                                                            <button onClick={e=>this.handleForm(this.CANCEL)} class="cancel">Cancel</button>
                                                            <button onClick={e=>this.handleForm(this.DELETE)} class="delete">Delete</button>
                                                            <button onClick={e=>this.handleForm(this.SAVE)} class="save">Save</button>
                                                      </div>
                                                }
                                          </div>
                                    </section>
                              }
                        </section>
                  </div>
            )
      }
}
ReactDOM.render(<Dashboard/>, document.querySelector("body"))