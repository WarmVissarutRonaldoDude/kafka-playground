import { TwitterAdapter, TwitterAccountName } from "../../model/Twitter";

import TwitterApi from "twitter-api-v2";

// TODO: use real twitter API
export const createTwitterAdapter = (): TwitterAdapter => {
  const twitterClient = new TwitterApi(`${process.env.TWITTER_BEARER_TOKEN}`);
  const roClient = twitterClient.readOnly;

  return {
    tweet: async () => {
      console.info("MOCK TWEET!");

      return {
        tweetTime: new Date().valueOf(),
        tweetMessage: "MOCK TWEET!",
        twitterAccount: TwitterAccountName.TEST_ACCOUNT,
      };
    },
    search: async (query, opts = { maxResult: 50 }) => {
      const paginator = await roClient.v2.search(query, {
        max_results: opts.maxResult,
        "tweet.fields": ["created_at", 'lang', 'author_id'],
      });
      return [...paginator];
    },
  };
};
