# Ethereum scanner

A small app to explore the latest blocks on Ethereum. 

The goal of the app is to provide a way to glance at the recent Ether transfers happening on the blockchain.

## Functionality 
- Display the ten latest blocks.
- Allow the user to see the transactions from a block. Only the transactions sending Ether should be displayed.
- Allow the user to see some details about a transaction.

## Technology
`next.js` was chosen for it simplicity and use of conventions over configuration.
It's seamless to get started with pages corresponding to routes. Additionally, 
server side rendering is enabled by default.

`aragon-ui` is used for the UI. 

## Structure

The project is organised around pages (like routes) in the `pages` folder:
- *index* which shows last 10 blocks
- *block* which shoes transcations for a block

## Getting Started

### Install Dependencies
```
npm install 
```

### Run Dev Server
```
npm run dev
```