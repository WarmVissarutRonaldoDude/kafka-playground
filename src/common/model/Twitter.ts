// TODO: this should from process.env
export enum TwitterAccountName {
  TEST_ACCOUNT = 'TEST_ACCOUNT'
}

export type TwitterAdapter = {
  tweet: () => Promise<{
    tweetTime: number;
    tweetMessage: string;
    twitterAccount: string;
  }>
}