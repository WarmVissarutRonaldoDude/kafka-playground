# TODO
- add kafka in docker-compose.


# How to use
1. start kafka server.
1.1 zookeeper-server-start config/zookeeper.properties
1.2 kafka-server-start config/server.properties

2. recheck or manual provision topic before running app.
2.1 kafka-topics --bootstrap-server localhost:9092 --topic twitterTest --create --partitions 3 --replication-factor 1

3. start infra by running `yarn start:infra`

4. start consumer and producer `yarn start`