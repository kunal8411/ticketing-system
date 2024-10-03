import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/ExpirationCompletePublisher";
import { natsWrapper } from "../NatsWrapper";
interface Payload {
  orderId: string;
}

// order:expiration - Queue name in the redis
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});


// this will gets called when the 15 minutes timer complete, then we emmit event "expiration:complete"
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
}); 

export { expirationQueue };


// expirationQueue.add to add job in queue, this we have in the listener (order created)