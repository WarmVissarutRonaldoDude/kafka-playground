import { TwitterAdapter, TwitterAccountName } from '../../model/Twitter'

// TODO: use real twitter API
export const createTwitterAdapter = (): TwitterAdapter => {
  return {
    tweet: async () => {
      console.log('MOCK TWEET!')
      return {
        tweetTime: new Date().valueOf(),
        tweetMessage: 'MOCK TWEET!',
        twitterAccount: TwitterAccountName.TEST_ACCOUNT
      }
    }
  }
};
