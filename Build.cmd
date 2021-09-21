@ECHO OFF

SET VERSION=1.1

docker build -t dkr.atomic-reader.com/twitter-rss:%VERSION% .

docker run --detach --env-file "twitter.env" --name "atomic-reader-twitter-rss" --publish "30002:8080" dkr.atomic-reader.com/twitter-rss:%VERSION%
