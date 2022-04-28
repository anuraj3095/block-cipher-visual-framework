import "./NumberIcon.css";


function NumberIcon(props) {

    let styleClass = "";

    if (props.highlight) {
        styleClass = "highlightMenuItem"
    } else {
        styleClass = "normalMenuItem"
    }

  return (
      <div className={styleClass}>
       {props.number}
      </div>

  );
}

export default NumberIcon;
