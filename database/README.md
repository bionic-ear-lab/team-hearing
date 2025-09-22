Hii friends

To set up the database locally, first ensure you have MySQLWorkbench installed and create a connection. You will need your root password later.

Then, please go into MySQLWorkbench and run the script in "init.sql." This will create the musiclovers database and its tables (right now it's just users and devices).

To use the databse, create /backend/src/main/resources/application-local.properties and add your MySQL root password in this format:
spring.datasource.password=password