/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-globals */
self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("New notification", data);
  const options = {
    body: data.body,
    title: data.title,
    icon: "./scan-kar-logo.png",
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
    actions: [
      {
        action: "close",
        title: "Close",
        // icon: "images/xmark.png"
      },
    ],
  };
  // window.location.reload();
  event.waitUntil(self.registration.showNotification(data.title, options));
});
