import { TweetV2 } from 'twitter-api-v2';

// TODO: this should from process.env
export enum TwitterAccountName {
  TEST_ACCOUNT = 'TEST_ACCOUNT'
}

export type TwitterAdapter = {
  tweet: () => Promise<{
    tweetTime: number;
    tweetMessage: string;
    twitterAccount: string;
  }>;
  search: (query: string, opts?: Partial<{ maxResult: number }>) => Promise<TweetV2[]> // TODO: replace with own-implemented model.
}