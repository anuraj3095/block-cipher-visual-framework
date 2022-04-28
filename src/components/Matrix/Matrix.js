import "./Matrix.css";
//import SelectAlgorithm from "./components/SelectAlgorithm/SelectAlgorithm"

function Matrix(props) {
  
  function getHexDataForElem(elemNo) {

    if (props.switchRowColmn) {
      console.log("switchinggg");
      let row = Math.floor((elemNo-1)/4);
      let col = (elemNo-1)%4;
      let newElemNo = col *4 + row;
      return props.data[newElemNo].toString(16).padStart(2, '0');
    }
    return props.data[elemNo-1].toString(16).padStart(2, '0');
  }

  return (
    
    <div className="matrix">
        <div className="grid-container">
        <div id={ props.type + "r0c0" } className="grid-item">
          {getHexDataForElem(1)}
          </div>
          <div id={ props.type + "r0c1" } className="grid-item">
          {getHexDataForElem(2)}
          </div>
          <div id={ props.type + "r0c2" } className="grid-item">
          {getHexDataForElem(3)}
          </div>
          <div id={ props.type + "r0c3" } className="grid-item">
          {getHexDataForElem(4)}
          </div>
          <div id={ props.type + "r1c0" } className="grid-item">
          {getHexDataForElem(5)}
          </div>
          <div id={ props.type + "r1c1" } className="grid-item">
          {getHexDataForElem(6)}
          </div>
          <div id={ props.type + "r1c2" } className="grid-item">
          {getHexDataForElem(7)}
          </div>
          <div id={ props.type + "r1c3" } className="grid-item">
          {getHexDataForElem(8)}
          </div>
          <div id={ props.type + "r2c0" } className="grid-item">
            {getHexDataForElem(9)}
          </div>
          <div id={ props.type + "r2c1" } className="grid-item">
            {getHexDataForElem(10)}
          </div>
          <div id={ props.type + "r2c2" } className="grid-item">
           {getHexDataForElem( 11)}
          </div>
          <div id={ props.type + "r2c3" } className="grid-item">
            {getHexDataForElem(12)}
          </div>
          <div id={ props.type + "r3c0" } className="grid-item">
            {getHexDataForElem(13)}
          </div>
          <div id={ props.type + "r3c1" } className="grid-item">
            {getHexDataForElem(14)}
          </div>
          <div id={ props.type + "r3c2" } className="grid-item">
           {getHexDataForElem( 15)}
          </div>
          <div id={ props.type + "r3c3" } className="grid-item">
           {getHexDataForElem(16)}
          </div>
        </div>  
    </div>


  );
}

export default Matrix;
