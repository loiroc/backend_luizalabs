# backend_luizalabs

Simple Node.js/Express app 

Please add env variables (.env file on the root folder) to the application works.
- DB_NAME=luizalabs
- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=root
- DB_PASSWORD=root
- PORT=3000 (this is for app.listen)

Please also restore the database (the backup.sql is on the root folder).
```bash
mysql -u root -p banco_criado < backup.sql
```

### Version

1.0.0

### Collection
- https://documenter.getpostman.com/view/16312782/TzeZESFU

## Install Dependencies

```bash
yarn install 
```

## Run

```bash
node ./src/server.js
```
