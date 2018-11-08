UPDATE mysql.user SET host = 'app' where user = $MYSQL_USERNAME;
FLUSH PRIVILEGES;