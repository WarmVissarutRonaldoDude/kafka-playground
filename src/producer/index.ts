require("dotenv").config();

import { createKafkaAdapter } from "../common/infra/Kafka";
import { KafkaTopic, KafkaTweetMessage } from "../common/model/KafkaTopic";
import { createTwitterAdapter } from "../common/infra/TwitterAdapter";
import { Cron } from "../common/model/Cron";
import { CompressionTypes } from "kafkajs";
import cron from "node-cron";

const producer = async (): Promise<void> => {
  console.info("Start Producer");

  const kafkaAdapter = await createKafkaAdapter({
    consumer: null,
    producer: true,
  });

  const twitterAdapter = createTwitterAdapter();

  const searchTweet = async (): Promise<void> => {
    // mock search query
    const searchQuery = "Final Fantasy";

    const tweets = await twitterAdapter.search(searchQuery);

    const kafkaMessages = tweets.map((tweet) => ({
      key: null, // no need for key as we don't need guarantee order here.
      value: JSON.stringify({
        tweetMessage: tweet.text,
        tweetTime: tweet.created_at,
        authorId: tweet.author_id,
        lang: tweet.lang,
      } as KafkaTweetMessage),
    }));

    await kafkaAdapter.producer.send({
      topic: KafkaTopic.twitterSearch,
      messages: kafkaMessages,
      compression: CompressionTypes.Snappy,
    });

    console.debug("Message send to kafka", { topic: KafkaTopic.twitterSearch });
  };

  // repeat every minute
  cron.schedule(Cron.EVERY_MINUTE, () => {
    searchTweet();
  });
};

producer();
