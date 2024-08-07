import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connects to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });
  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-gr",
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log("Sequence of event", msg.getSequence());
      console.log("Message received", JSON.parse(data));
    }
    msg.ack();
  });
});
// 305 gaceful client shutdown
process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  stan.close();
});
