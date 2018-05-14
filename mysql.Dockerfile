FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD=hegemony86
ENV MYSQL_DATABASE=expenses

COPY restore_db/expenses_2018-04-08.sql /tmp/
RUN touch /docker-entrypoint-initdb.d/restore_db.sh && chmod +x /docker-entrypoint-initdb.d/restore_db.sh
RUN echo "mysql -u root --password=$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < /tmp/expenses_2018-04-08.sql" >> /docker-entrypoint-initdb.d/restore_db.sh
