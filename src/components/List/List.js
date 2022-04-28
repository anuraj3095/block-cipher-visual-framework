import "./List.css";

function List(props) {
    return ( <
        div className = "list-flex-container" >
        <
        div id = { props.type + "1" }
        className = "list-flex-item" > { props.data[1] } <
        /div> <
        div id = { props.type + "2" }
        className = "list-flex-item" > { props.data[2] } <
        /div> <
        div id = { props.type + "3" }
        className = "list-flex-item" > { props.data[3] } <
        /div> <
        div id = { props.type + "4" }
        className = "list-flex-item" > { props.data[4] } <
        /div> <
        div id = { props.type + "5" }
        className = "list-flex-item" > { props.data[5] } <
        /div> <
        div id = { props.type + "6" }
        className = "list-flex-item" > { props.data[6] } <
        /div> <
        div id = { props.type + "7" }
        className = "list-flex-item" > { props.data[7] } <
        /div> <
        div id = { props.type + "8" }
        className = "list-flex-item" > { props.data[8] } <
        /div> <
        /div>
    );
}
export default List;