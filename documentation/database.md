# TeamHearing Database Schema

This document explains how the **musiclovers** database is structured. The script to initialize the database can be viewed in [init.sql](/database/init.sql) and the instructions can be read in the [database README](/database/README.md).

---

## 1. Users table

The users table stores the user id, which is a randomly generated integer, the username, email, password (hashed for security), birthdate, gender, role (which defaults to client), and volume settings.

## 2. Devices table

The devices table stores the device id, which is automatically assigned sequentially, the user id of the user whose device it is, which ear the device is for (Left or Right), the device type (a Cochlear Implant, Hearing Aid, or Other), the device manufacturer (Advanced Bionics, Cochlear, Med-El, or Other), and an optional activation date.