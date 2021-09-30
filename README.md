# eth-observer

This is a service with one HTTP endpoint which returns the most valuable Ethereum address from the past 100 blocks. Runs on nodejs and updates in real time. No extra dependencies needed.

## How to run

First get Etherscan API key from [here](https://etherscan.io/myapikey). And put it as environment variable in `.env` file or directly in shell.

```sh
# .env file
ETHERSCAN_APIKEY=<yourkey>
# or in shell
export ETHERSCAN_APIKEY=<yourkey>
```

Now install dependencies using npm and build it.

```sh
npm install
npm run build
```

Run service.

```
npm run start
```

After filling the buffer and starting the server, you can send a GET request to `/mostValuableAddress`. Example using [httpie](https://github.com/httpie/httpie):

```sh
$ http GET localhost:8080/mostValuableAddress

HTTP/1.1 200 OK
Connection: keep-alive
Date: Wed, 29 Sep 2021 23:19:08 GMT
Keep-Alive: timeout=5
content-length: 82
content-type: application/json; charset=utf-8

{
    "address": "0x28c6c06298d514db089934071355e5743bf21d60",
    "value": 5432.273761326432
}

```
