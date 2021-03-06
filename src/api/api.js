import axios from "axios";
const header = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }

export async function addOrders(type) {
  return axios.get("http://localhost:5000/api/v1/customer-order", header).then(res => {
    let arr = []
    switch (type) {
      case "Running":
        arr = res.data.data.orders.filter(order => {
          return order.process === "Pending"
        })
        console.log("first Here")
        break;
      case "Rejected":
        arr = res.data.data.orders.filter(order => {
          return order.process === "Pending"
        })
        break;
      case "Completed":
        arr = res.data.data.orders.filter(order => {
          return order.process === "Running"
        })
        break;
      default:
        return null;
    }

    return arr.reverse()
  })
}

export async function calculateSales() {
  return axios.get("http://localhost:5000/api/v1/customer-order", header).then(res => {
    let arr = res.data.data.orders;
    let state = {}
    let dineIn = arr.filter(order => {
      return order.orderType === "Dine In" && order.process === "Completed"
    })

    let takeAway = arr.filter(order => {
      return order.orderType !== "Dine In" && order.process === "Completed"
    })

    state.takeAwayTotal = takeAway.length;
    state.dineInTotal = dineIn.length;
    let x = 0;
    let y = 0;

    dineIn.forEach(item => {
      x += parseInt(item.price)

    })
    takeAway.forEach(item => {
      y += parseInt(item.price)

    })

    state.takeAwaySale = y;
    state.dineInSale = x;
    state.showPage = false;

    state.buttonFunctional = false;
    return state;
  })
}