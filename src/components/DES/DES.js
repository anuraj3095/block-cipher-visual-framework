import List from "../List/List";
import "./DES.css";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { desActions } from '../../store/desStore-slice';


function DES(props) {
  
  let currData = useSelector((state) => state.des.emptyData);
  
  let currLDataList = useSelector((state) => state.des.dataStateL);
  let currRDataList = useSelector((state) => state.des.dataStateR);
  let currFDataList = useSelector((state) => state.des.dataStateF);
  //let currOperation = useSelector((state) => state.aes.operation)

  console.log(currLDataList);
  const dispatch = useDispatch();
  
  useEffect(() => {   
      dispatch(desActions.gotoRound({newRound:1}));
  }, []);
  return (
        <div className="des-center-env">

          <div className="des-main-l">
            <List type = "mainl"  data={currLDataList}/>
          </div>
          <div className="des-main-r">
            <List type = "mainr"  data={currRDataList}/>
          </div>

          <div className="des-oper">
            +
          </div>

          <div className="des-oper-dummy">
            
          </div>

          <div className="des-f">
            <List type = "desf"  data={currFDataList}/>
          </div>

          <div className="des-f-dummy">
            
          </div>

          <div className="des-dummy"> 
          </div>
          <div className="des-dummy">
            </div>

          <div className="des-out-l">
            <List type = "outl"  data={currData}/>
          </div>

          <div className="des-out-r">
            <List type = "outr"  data={currData}/>
          </div>


        </div>
  
  );
}

export default DES;
