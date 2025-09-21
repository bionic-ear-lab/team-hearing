Hii friends

To set up the database locally, please go into MySQLWorkbench and run the script in "init.sql." This will create the musiclovers database and its tables (right now it's just users and devices).

To run login and signup you will have to edit application.properties with your MySQLWorkbench credentials. Make sure the host name, port, username, and password are correct for your connection. Mine look like this:

spring.datasource.url=jdbc:mysql://localhost:3306/musiclovers?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=hahaha. it's a secret.