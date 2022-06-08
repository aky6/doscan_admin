import React, { Fragment, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
} from "reactstrap";
import { Table } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UIfx from "uifx";
import bellAudio from "../../assets/sound/pristine.mp3";

import { subscribeToTimer } from "../socketWeb";

import { bindActionCreators } from "redux";
import axios from "axios";
import * as Actions from "../../actions/actions";
import { connect } from "react-redux";
import "./sample.css";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

// const fast2sms = require('fast-two-sms')
const API_KEY_SMS =
  "KucHqnUEg1iwNszrdGMoSF4x9ZPIhWv3QpB8lfa5JY7OADkyjb0IYWm7DF1XTBx5dUNAts4QORzZyGhw";

// const beep = new UIFx({asset: mp3File});
const bell = new UIfx(bellAudio, {
  volume: 0.4, // number between 0.0 ~ 1.0
  throttleMs: 100,
});

// let arr = [];
const Samplepage = (props) => {
  const [res, setRes] = useState("");

  // useEffect(() => {
  //   const liveSocket = new WebSocket(ENDPOINT);
  //   liveSocket.onopen = (e) => {
  //     liveSocket.send("a");
  //   };
  //   liveSocket.onmessage = (e) => {
  //     let response = JSON.parse(e.data);
  //     console.log("response", response);
  //     if (response) {
  //       callOrders("Running");
  //     }
  //   };
  //   liveSocket.onerror = (e) => {
  //     console.log(e.message);
  //   };
  //   liveSocket.onclose = (e) => {
  //     console.log(e.code, e.reason);
  //   };
  //   return () => liveSocket.close();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    console.log("socket:========>", socket);
    socket.on("testerEvent", (data) => {
      console.log("Data from websocket: ", data);
      setRes(data.s);
      notify(data.s.userName);
      callOrders("Running");
    });
    // if (!arr) {
    //   console.log("respone existes@", arr);
    // }
    // subscribeToTimer((err, data) => {
    //   console.log("Data from websocket: ", data.s);
    //   // arr.push(data.s);
    //   // setResponse(data);
    //   // console.log()
    //   notify();
    // });
    // setRes([...res, arr]);
  }, [])


  useEffect(() => {
    callOrders("Running");
  }, []);

  const callOrders = (type) => {
    props.actions.addOrders(type).then((res) => {
      console.log("redux Save", res);
    });
  };

  const changeStatus = (id, status) => {
    let process =
      status === "Accept"
        ? "Running"
        : status === "Reject"
          ? "Rejected"
          : "Completed";
    let message = `Your Order is ${process}`;
    let options = {
      authorization: API_KEY_SMS,
      message: message,
      numbers: ["9643710095"],
    };

    axios
      .patch(`http://localhost:5000/api/v1/customer-order/update-order/${id}`, {
        process: process,
      })
      .then((resp) => {
        // fast2sms.sendMessage(options).then(res=>{
        //   // console.log("sent message" , res)
        // })
      });
    callOrders(process);
  };

  const notify = (user) => {
    toast(`New Order by ${user}!`);
    bell.play();
  };

  return (
    <Fragment>
      {/* <BreadCrumb parent="Home" subparent="Sample Page" title="Sample Page"/> */}

      <Container fluid={true}>
        <div>
          {/* <button onClick={notify}>Notify !</button> */}
          <ToastContainer />
        </div>

        {!props.showPage && (
          <Table
            responsive
            style={{
              width: "80%",
              marginTop: "5%",
              marginLeft: "10%",
            }}
          >
            <thead>
              <tr>
                <th>Order Type</th>
                <th>Total Order</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dine In</td>
                <td>{props.dineInTotal}</td>
                <td>
                  <i className="rupee sign icon"></i>
                  {props.dineInSale}
                </td>
              </tr>

              <tr>
                <td>Take Away</td>
                <td>{props.takeAwayTotal}</td>
                <td>
                  <i className="rupee sign icon"></i>
                  {props.takeAwaySale}
                </td>
              </tr>
            </tbody>
          </Table>
        )}
        {props.showPage && (
          <Row>
            <Col sm="12">
              {/* {console.log("sopmethinfh", props.orders.length)} */}

              {props.orders.length ? (
                props.orders.map((order, index) => (
                  <div className="grid-addjust" key={index}>
                    <Card>
                      {/* <CardHeader>
                      <h5>Table No. {index + 1} </h5>
             
                      </CardHeader> */}
                      <CardBody style={{ backgroundColor: "#ffffff" }}>
                        <a
                          style={{ marginLeft: "15px" }}
                          className="ui orange right ribbon label s-c-custome"
                        >
                          {localStorage.getItem("ownertype") !== "hotelowner"
                            ? order.orderType === "Dine In"
                              ? `Dinein / ${order.noOfSeatsRequested}`
                              : "Take away"
                            : `Room No/${order.noOfSeatsRequested + 100}`}
                        </a>
                        <h4>
                          <b>{order.userName ? order.userName : ""}</b>
                        </h4>
                        <h5>Ordered Items</h5>
                        {order.orders.map((order, index) => (
                          <div key={index}>
                            <div className="flexrow">
                              <div>
                                <p>
                                  <b>{order.item}</b>
                                </p>
                                <p>Quantity: {order.quantity}</p>
                              </div>
                              <div>{/* <p>${order.price}</p> */}</div>
                            </div>
                            <hr></hr>
                          </div>
                        ))}
                        <div>
                          {/* <p>Order Type: {order.orderType}</p>
                    {order.orderType == "Dine In" &&
                      <p>Table: {order.noOfSeatsRequested}</p>} */}
                          <p>Amount: Rs. {order.price}</p>
                        </div>
                        <p>
                          <b>Special Instructions:</b>{" "}
                          {order.instruction === ""
                            ? "None"
                            : order.instruction}
                        </p>
                      </CardBody>
                      {/* {props.buttonFunctional ? (
                      <Button
                        className="s-btn-extrnal-style"
                        color={
                          order.status == "Pending" ? "success" : "secondary"
                        }
                        onClick={() => changeStatus(order["_id"], order.status)}
                        size="sm"
                        block
                      >
                        {order.status == "Pending"
                          ? "Mark As Completed"
                          : "Completed"}
                      </Button>
                    ) : (
                        <Button
                          className="s-btn-extrnal-style"
                          color="warning"
                          size="sm"
                          block
                          disabled={true}
                        >
                          Pending
                        </Button>
                      )} */}
                      {order.process === "Pending" && (
                        <div className="flex-btn">
                          <Button
                            className="s-btn-extrnal-style"
                            color="success"
                            onClick={() => changeStatus(order["_id"], "Accept")}
                            size="sm"
                            style={{ width: "100%" }}
                          >
                            Accept
                          </Button>

                          <Button
                            className="s-btn-extrnal-style"
                            color="secondary"
                            onClick={() => changeStatus(order["_id"], "Reject")}
                            size="sm"
                            style={{ width: "100%" }}
                          >
                            Decline Order
                          </Button>
                        </div>
                      )}

                      {order.process === "Running" && (
                        <Button
                          className="s-btn-extrnal-style"
                          color="success"
                          onClick={() =>
                            changeStatus(order["_id"], "Completed")
                          }
                          size="sm"
                        >
                          Add To Complete
                        </Button>
                      )}
                    </Card>
                  </div>
                ))
              ) : (
                <Card>
                  <CardBody style={{ backgroundColor: "#ffffff" }}>
                    <center>
                      <h4>"All Set, Nothing Pending Right Now!"</h4>
                    </center>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        )}
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    orders: state.Toggle.orders,
    takeAwaySale: state.Toggle.takeAwaySale,
    takeAwayTotal: state.Toggle.takeAwayTotal,
    dineInSale: state.Toggle.dineInSale,
    dineInTotal: state.Toggle.dineInTotal,
    showPage: state.Toggle.showPage,
    buttonFunctional: state.Toggle.buttonFunctional,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Samplepage);
