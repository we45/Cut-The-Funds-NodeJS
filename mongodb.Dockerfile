FROM mongo:latest

COPY test_data/dump /data/db

RUN touch /docker-entrypoint-initdb.d/importdata.sh && chmod +x /docker-entrypoint-initdb.d/importdata.sh
RUN echo "mongorestore --gzip --db cut_the_funds /data/db/cut_the_funds" >> /docker-entrypoint-initdb.d/importdata.sh
