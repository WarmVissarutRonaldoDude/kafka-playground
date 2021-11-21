import { createKafkaAdapter } from "../common/infra/Kafka";
import { KafkaTopic } from "../common/model/KafkaTopic";
import { createTwitterAdapter } from "../common/infra/TwitterAdapter";

import cron from "node-cron";

const producer = async (): Promise<void> => {
  console.info("Start Producer");

  const kafkaAdapter = await createKafkaAdapter({
    consumer: null,
    producer: true,
  });

  const twitterAdapter = createTwitterAdapter();

  const runTweet = async (): Promise<void> => {
    const { tweetTime, tweetMessage, twitterAccount } =
      await twitterAdapter.tweet();

    // publish data to kafka
    await kafkaAdapter.producer.send({
      topic: KafkaTopic.twitterTest,
      messages: [
        {
          key: twitterAccount,
          value: JSON.stringify({ tweetMessage, tweetTime }),
        },
      ],
    });
  };

  // repeat every minutes
  cron.schedule("* * * * *", () => {
    runTweet();
  });
};

producer();
