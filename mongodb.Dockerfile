FROM mongo:latest

COPY test_data/new_data/ /data/db/data/

RUN touch /docker-entrypoint-initdb.d/importdata.sh && chmod +x /docker-entrypoint-initdb.d/importdata.sh
RUN echo "mongoimport --db cut_the_funds --collection expenses < /data/db/data/expenses.json" >> /docker-entrypoint-initdb.d/importdata.sh
RUN echo "mongoimport --db cut_the_funds --collection projects < /data/db/data/projects.json" >> /docker-entrypoint-initdb.d/importdata.sh
RUN echo "mongoimport --db cut_the_funds --collection user < /data/db/data/user.json" >> /docker-entrypoint-initdb.d/importdata.sh
