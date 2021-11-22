require("dotenv").config();

import { creatESAdapter } from "../common/infra/ElasticsearchAdapter";
import { createKafkaAdapter } from "../common/infra/Kafka";
import { KafkaTopic, KafkaTweetMessage } from "../common/model/KafkaTopic";
import { ESIndex } from "../common/model/Elasticsearch";

const consumer = async (): Promise<void> => {
  console.info("Start Consumer");

  const esAdapter = creatESAdapter();
  const kafkaAdapter = await createKafkaAdapter({
    consumer: { groupId: "twitter-test-app" },
    producer: false,
  });

  // consume data from Kafka
  await kafkaAdapter.consumer.subscribe({
    topic: KafkaTopic.twitterSearch,
  });

  await kafkaAdapter.consumer.run({
    // https://kafka.js.org/docs/consuming#a-name-auto-commit-a-autocommit
    autoCommit: false,
    eachBatch: async (payload) => {
      console.log("IN BATCH FOR TESTING", payload.batch.messages);
    },
    eachMessage: async ({ topic, partition, message }) => {
      // console.log({
      //   partition,
      //   offset: message.offset,
      //   value: message.value.toString(), // need to string as it's Buffer
      //   key: message.key.toString(), // need to string as it's Buffer
      // });

      console.debug("Consume message from kafka ", {
        topic,
        partition,
        offset: message.offset,
      });

      const messageInObj: KafkaTweetMessage = JSON.parse(
        message.value.toString()
      );

      // TODO: improve by batching kafka message and sent to ES.
      // sent data to ES
      await esAdapter.index({
        id: `${topic}${partition}${message.offset}`, // for dedupe msg
        index: ESIndex.twitterFeed,
        body: {
          tweetDetails: messageInObj,
          timestamp: new Date(messageInObj.tweetTime),
        },
      });

      // NOTE: there will be no problem in multi consumer as another consumer in the group-
      // will consume from another partition instead.
      // manual commit
      await kafkaAdapter.consumer.commitOffsets([
        {
          topic,
          partition,
          offset: message.offset,
        },
      ]);
    },
  });
};

consumer();
