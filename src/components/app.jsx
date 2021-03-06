import React, { Fragment, useEffect, useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { Route } from "react-router-dom";
import Loader from "../layout/Loader";
import { Switch } from "antd";
import "./app.css";
import {
  Button,
  Form,
  Col,
  Table,
  DropdownButton,
  DropdownItem,
} from "react-bootstrap";
import "../assets/css/app.css";
import shopData from "../dummy-shop-data.json";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import Sample from "../components/starterkits/samplepage";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
// import { Segment, Checkbox, Form  } from 'semantic-ui-react'
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import Axios from "axios";
import swal from "sweetalert";
import { Dropdown } from "semantic-ui-react";
import Toggle from "react-toggle";
import Modal from "../common/modal";


const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const header = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const AppLayout = (props) => {
  const [shop, setShop] = useState({});
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("BURGER");

  const [price, setPrice] = useState([]);
  const [file, setFile] = useState({});
  const [seats, setSeats] = useState([]);
  const [menu, setMenu] = useState([]);
  const [optionsValue, setOptions] = useState([]);
  const [modal, setModal] = useState(false);
  const [menuFile, setMenuFile] = useState(null);
  const [editModal, setEditModal] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [menuId, setMenuId] = useState(null)
  const [allcat, setAllCat] = useState([]);

  const options = [
    { value: "milkType", label: "milkType" },
    { value: "size", label: "size" },
    { value: "quantity", label: "quantity" },
    { value: "decaf", label: "decaf" },
  ];

  const CategoryOptions = [
    { value: "burger", label: "BURGER" },
    { value: "soup", label: "SOUP" },
    { value: "soft drink", label: "SOFT DRINK" },
    { value: "beer", label: "BEER" },
    { value: "pizza", label: "PIZZA" },
    { value: "donuts", label: "DONUTS" },
    { value: "south indian", label: "SOUTH INDIAN" },
    { value: "north indian", label: "NORTH INDIAN" },
    { value: "italian", label: "ITALIAN" },
    { value: "vegetarian", label: "VEGETARIAN" },
  ];

  useEffect(() => {
    const index = Math.floor(Math.random() * shopData.length);
    let arr = [];
    for (let i = 1; i <= 50; i++) {
      arr[i - 1] = i;
    }
    loadCategory();
    setSeats(arr);
    setShop(shopData[index]);
    loadMenu();
  }, []);

  const loadCategory = () => {
    const Idd = localStorage.getItem("userid");
    let temp = [];
    Axios.get(`http://localhost:5000/api/v1/users/getcategory/${Idd}`, header).then((res) => {
      // setMenu(res.data.data.products.reverse());
      res.data.data.cat.map((res) => {
        temp.push(res.category);
      });
      let categories = temp.filter((v, i, a) => a.indexOf(v) === i);
      const catObj = categories.reduce((a, b) => (a[b] = '', a), {});
      console.log("All categories:", catObj);
      setAllCat(categories);
    });
  }

  const addCat = (e) => {
    const newTags = allcat;
    console.log("recieving cat", e);
    newTags.push(e);
    console.log("newTags", newTags);
    setAllCat(newTags);
  }


  const loadMenu = () => {
    const data = {}
    data.Subscription = localStorage.getItem("subs");
    data.userId = localStorage.getItem("userid");

    Axios.get("http://localhost:5000/api/v1/products", header).then((res) => {
      setMenu(res.data.data.products.reverse());
    });
    Axios.put(`http://localhost:5000/api/v1/users/endurlupdate`, data, header).then(res => {
      console.log("endurlupdate", res)
    })
  };

  const dineInGen = () => {
    const qrCodeCanvas = document.querySelectorAll("canvas");

    let doc = new jsPDF();
    doc.setFontSize(50);
    for (let i = 0; i < shop.seats; i++) {
      (localStorage.getItem("ownertype") !== "hotelowner" ?
        doc.text(80, 220, "Table: " + (i + 1)) : doc.text(80, 220, "Room: " + (i + 1 + 100)))
      const qrCodeDataUri = qrCodeCanvas[i].toDataURL("image/jpg", 0.5);

      doc.addImage(qrCodeDataUri, "JPEG", 5, 0, 200, 200);
      doc.addPage();
    }

    doc.save("DineIn.pdf");
  };

  const takeAwayGen = () => {
    const qrCodeCanvas = document.querySelectorAll("canvas");
    console.log("canvasses", qrCodeCanvas);

    const qrCodeDataUri = qrCodeCanvas[50].toDataURL("image/jpg", 1.0);

    let doc = new jsPDF();
    doc.setFontSize(25);
    doc.addImage(qrCodeDataUri, "JPEG", 5, 0, 200, 200);
    doc.text(0, 220, shop.name);

    doc.save("takeAway.pdf");
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
  };

  const onImputChange = (e) => {
    switch (e.target.id) {
      case "name":
        setName(e.target.value);
        break;

      case "category":
        setCategory(e.target.value);
        break;

      case "price":
        setPrice(e.target.value);
        break;
    }
  };

  const storeOptions = (e) => {
    if (e) {
      let arr = [];
      e.forEach((item) => {
        arr.push(item.value);
      });
      console.log("options", arr);
      setOptions(arr);
    } else {
      setOptions([]);
    }
  };

  const onsubmit = () => {
    if (!file.name) {
      alert("No Image Selected");
      console.warn("No Image is Selected!");
      return;
    }
    const data = new FormData();
    data.append("photo", file);
    data.append("name", name);
    data.append("category", category);
    data.append("price", price);
    data.append("resturant_id", localStorage.getItem("resturant_id"));
    data.append("options", optionsValue);
    Axios.post("http://localhost:5000/api/v1/products", data, header).then(
      (resp) => {
        if ((resp.data.status = "Success")) {
          swal("Added!", "Menu Item Succesfully Added", "success").then(() => {
            setName("");
            setFile({});
            setCategory("");
            setPrice("");
            loadMenu();
          });
        }
      }
    );
  };

  const changeAvailability = (e, status, id) => {
    if (status === "Available") {
      swal({
        title: "Are you sure?",
        text: "This Will make this item unavailable",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          Axios.patch(`http://localhost:5000/api/v1/products/${id}`, {
            status: "unAvailable",
          }, header).then(() => {
            loadMenu();
          });
        }
      });
    } else {
      Axios.patch(`http://localhost:5000/api/v1/products/${id}`, {
        status: "Available",
      }, header).then(() => {
        loadMenu();
      });
    }
  };

  const deleteItem = (id) => {
    Axios.delete(`http://localhost:5000/api/v1/products/${id}`, header).then(
      () => {
        loadMenu();
      }
    );
  };

  const showModal = () => {
    setModal(true);
  };

  const menuUpload = () => {
    return (
      <div>
        <span>Sequence of menu details in .CSV file</span>
        <br></br>
        <span>
          <b>Name----Category----Price</b>
        </span>
        <input
          type="file"
          onChange={(e) => setMenuFile(e.target.files[0])}
          style={{ padding: "10px" }}
          accept=".csv"
        />
      </div>
    );
  };

  const uploadAll = (type) => {
    if (type === "uploadAll") {
      if (!menuFile) {
        alert("No CSV File Chosen");
        return;
      }
      let fileObj = menuFile;

      //just pass the fileObj as parameter
      ExcelRenderer(fileObj, (err, resp) => {
        if (err) {
          alert(err);
        } else {
          console.log("File obj", resp.rows);
          let products = [];
          let data = {};
          resp.rows.forEach((item) => {
            data.name = item[0];
            data.category = item[1];
            data.price = parseInt(item[2]);
            data.rating = 4.5;
            data.photo =
              "https://res.cloudinary.com/dvetb04ra/image/upload/v1595283891/qqmliaurpz3dk9qsezcn.jpg";
            data.resturant_id = localStorage.getItem("resturant_id");
            data.options = ["quantity"];

            products.push(data);
            // console.log("products:", { products });
            data = {};
          });
          Axios.post(
            "http://localhost:5000/api/v1/products/uploadinbulk",
            { products }, header
          ).then((res) => {
            console.log("Bul uploaded", res);
            loadMenu();
          });
        }
        setModal(false);
      });
    }
    else {
      const data = new FormData();
      data.append("photo", file);
      data.append("name", editName);
      data.append("price", editPrice);
      Axios.patch(`http://localhost:5000/api/v1/products/${menuId}`, data, header).then(res => {
        console.log("updated item", res)
        loadMenu();
        setEditModal(false);
        setModal(false);
        setFile({});
      })
    }
  }

  const editItem = (id, index) => {
    setEditModal(true);
    setModal(true);
    setMenuId(id)
    setEditName(menu[index].name)
    setEditPrice(menu[index].price)

  }
  const onModalInputChange = (e) => {
    if (e.target.name === "editName") {
      setEditName(e.target.value);

    }
    else {
      setEditPrice(e.target.value);
    }
  }

  const editMenuItem = () => {
    return (
      <div>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            id="MenuName"
            placeholder="Enter price"
            onChange={onModalInputChange}
            value={editName}
            name="editName"
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            id="price"
            placeholder="Enter price"
            onChange={onModalInputChange}
            value={editPrice}
            name="editPrice"
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Update Image</Form.Label>
          <Form.Control
            style={{ width: "40%" }}
            type="file"
            placeholder="Enter menu Image"
            onChange={(e) => setFile(e.target.files[0])}
          // onChange={(e) => uploadImage(e)}
          />
        </Form.Group>
      </div>
    )
  }

  return (
    // <Fragment>
    <div>
      <Loader />
      <div className="page-wrapper">
        <div className="page-body-wrapper">
          {/* <Header/> */}
          <Route
            exact
            path="/"
            render={() => {
              return (
                <div>
                  <Header />
                  <div className="page-body" style={{ "marginLeft": "16rem" }}>
                    <Sample />
                  </div>
                </div>
              );
            }}
          ></Route>

          <Route
            exact
            path="/generate"
            render={() => {
              return (
                <div>
                  <Header />
                  <div className="generate">
                    {/* <div className="shopdetails">
                      <span>
                        <b>{localStorage.getItem("ownertype") !== "hotelowner" ? "Restaurant" : "Hotel"}</b> : {shop.name}
                      </span>
                      <p>
                        <b>Place </b> : {shop.vicinity}
                      </p>
                    </div> */}
                    {localStorage.getItem("ownertype") !== "hotelowner" ? (
                      <div>
                        <Button variant="primary" onClick={() => dineInGen()}>
                          Request For DineIn
                        </Button>{" "}
                        <Button
                          variant="secondary"
                          onClick={() => takeAwayGen()}
                        >
                          Request for TakeAway
                        </Button>{" "}
                      </div>
                    ) : (
                      <Button variant="primary" onClick={() => dineInGen()}>
                        Request For Hotel Rooms
                      </Button>
                    )}
                    <div style={{ opacity: 0 }}>
                      {seats.map((x) => (
                        <QRCode
                          value={`https://user.scankar.com/${localStorage.getItem("userid")}T${x}`}
                          size={200}
                        />
                      ))}

                      <QRCode
                        value={`https://user.scankar.com/${localStorage.getItem("userid")}take`}
                        size={200}
                      />
                    </div>
                  </div>
                </div>
              );
            }}
          ></Route>

          <Route
            exact
            path="/addmenu"
            render={() => {
              return (
                <div>
                  <Header />
                  <div className="generate">
                    {/* <Segment>Pellentesque habitant morbi tristique senectus.</Segment> */}

                    <Form>
                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            id="name"
                            placeholder="Enter item name"
                            onChange={(e) => onImputChange(e)}
                            value={name}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            id="price"
                            placeholder="Enter price"
                            onChange={(e) => onImputChange(e)}
                            value={price}
                          />
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label>Category</Form.Label>
                          <CreatableSelect
                            // defaultValue={}
                            options={CategoryOptions}
                            formatGroupLabel={formatGroupLabel}
                            onChange={(e) => setCategory(e.label)}
                            onCreateOption={(e) => addCat(e)}
                          />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                          <Form.Label>Options</Form.Label>
                          <Select
                            // defaultValue={[colourOptions[2], colourOptions[3]]}
                            isMulti
                            name="colors"
                            options={options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(e) => storeOptions(e)}
                            id="options"
                          />
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                          <Form.Label>Menu Item Image</Form.Label>
                          <Form.Control
                            style={{ width: "40%" }}
                            type="file"
                            placeholder="Enter menu Image"
                            onChange={(e) => uploadImage(e)}
                          />
                        </Form.Group>
                      </Form.Row>

                      <Button variant="primary" onClick={() => onsubmit()}>
                        Submit
                      </Button>
                    </Form>
                    <p style={{ fontSize: "20px" }}>
                      Upload Menu from .Csv file
                    </p>
                    <Button variant="warninig" onClick={() => showModal()}>
                      Bulk Menu Upload
                    </Button>

                    <Modal
                      show={modal}
                      isEdit={false}
                      setModal={() => { setModal(false); setEditModal(false) }}
                      modalBody={menuUpload()}
                      uploadAll={(type) => uploadAll(type)}
                    />
                    <Modal
                      show={editModal}
                      isEdit={true}
                      setModal={() => { setModal(false); setEditModal(false) }}
                      modalBody={editMenuItem()}
                      uploadAll={(type) => uploadAll(type)}
                    />
                    <div className="menu-card-grid">
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>

                            <th>Category</th>
                            <th>Availability</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {menu.map((item, index) => (
                            <tr>
                              <td>{item.name}</td>
                              <td>
                                <i className="rupee sign icon"></i>
                                {item.price}
                              </td>
                              <td>{item.category}</td>
                              <td style={{ "padding-left": "3%" }}>
                                <Switch
                                  checked={item.status === "Available"}
                                  size="small"
                                  onChange={(e) =>
                                    changeAvailability(e, item.status, item._id)
                                  }
                                />{" "}
                              </td>
                              <td style={{ cursor: "pointer" }}>
                                <i
                                  className="fa fa-trash fa-2x"
                                  aria-hidden="true"
                                  onClick={() => deleteItem(item._id)}
                                ></i>
                              </td>
                              <td style={{ cursor: "pointer" }}>
                                <i
                                  className="fa fa-pencil-square-o fa-2x"
                                  aria-hidden="true"
                                  onClick={() => editItem(item._id, index)}
                                ></i>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      {/* <---------------- end fake cards----------------> */}
                    </div>
                  </div>
                </div>
              );
            }}
          ></Route>

          <Sidebar />
        </div>
      </div>
      {/* </Fragment> */}
    </div>
  );
};

export default AppLayout;
