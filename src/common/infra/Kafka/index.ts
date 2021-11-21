import { Kafka, Producer, Consumer } from "kafkajs";

type KafkaAdapter = {
  producer: Producer | null;
  consumer: Consumer | null;
  kafkaClient: Kafka;
}

export const createKafkaAdapter = async (ops: {
  consumer: { groupId: string } | null;
  producer: boolean;
}): Promise<KafkaAdapter> => {
  // TODO: support configure in options
  const kafka = new Kafka({
    clientId: "my-app-test",
    brokers: ["localhost:9092"],
  });

  const result: KafkaAdapter = {
    producer: null,
    consumer: null,
    kafkaClient: kafka
  }



  if (ops.producer) {
    const producer = kafka.producer({
      idempotent: true,
      maxInFlightRequests: 5
    });
    await producer.connect();
    result.producer = producer;
  }

  if (ops.consumer) {
    const consumer = kafka.consumer({ groupId: ops.consumer.groupId });
    await consumer.connect();
    result.consumer = consumer;
  }

  return result;
};
