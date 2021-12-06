# StockWise 
<div style="text-align: justify">
StockWise is a simple and secure finance and risk management web utility which demonstrates the basics of stock market and finance management related concepts as well as its implementation in the domain of web development.

Position sizing, stop losses and trade expectancies are the concepts of finance and risk management which have been implemented in this web application.

## How to run

Clone the repo, and after that run the following commands in terminal:
```bash
mongod
```
```bash
node server.js 
```
Wait for the ```Server is running on port 3000.``` message from the terminal, after which you can go to ```localhost:3000``` inside your browser to access the homepage.
The homepage consists of some information regarding the web application and links to the Finance Management as well as Risk Management webpages. To view the entered data in both encrypted as well as decrypted form, go to ``` localhost:3000/stockDB_read```. Change the ```keystring``` in server.js file to another appropriate AES256 key.
</div>
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

Made with ❤️ by Ashish Tiwari

## License
[MIT](https://choosealicense.com/licenses/mit/)
