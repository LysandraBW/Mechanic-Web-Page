function Nav() {
    return (
      <nav>
            <nav-banner>
                  <logo-container>
                        <img-logo>
                              <img src=""/>
                        </img-logo>
                  </logo-container>
                  <ul id="desktop">
                        <a href="/find">Find Appointment</a>
                        <a href="/schedule">Schedule Appointment</a>
                  </ul>
                  <ul id="mobile">
                        <button id="nav-dropdown-button"></button>
                  </ul>
            </nav-banner>
            <nav-dropdown>
                  <ul>
                        <a href="/find">Find Appointment</a>
                        <a href="/schedule">Schedule Appointment</a>
                  </ul>
            </nav-dropdown>
      </nav>
    )  
}