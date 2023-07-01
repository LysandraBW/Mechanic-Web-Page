function ProgressBar(props) {
      return (
            <progress-bar>
                  {[...Array(props.size)].map((e, i)=> {
                        let classes = (i === props.done - 1 && props.error ? "error" : (i < props.done ? "complete" : ""))
                        return (
                              <div className={classes}>
                                    <span>{i+1}. {props.labels[i]}</span>
                                    <div></div>           
                              </div>
                  )})}
            </progress-bar>
      )
}