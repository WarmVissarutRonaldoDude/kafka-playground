export enum KafkaTopic {
  twitterTest = "twitterTest",
  twitterSearch = 'twitterSearch'
}

export type KafkaTweetMessage = {
  tweetMessage: string;
  tweetTime: string;
  authorId: string; // 1454090349844983811 (TODO: mapped to authorName)
  lang: string; // en, ja, es, ...
}