//import {TonConnect} from '@tonconnect/sdk';
//import {TonConnect} from './tonconnect-sdk.min.js';



//wallets
document.addEventListener('DOMContentLoaded', function() {

    try {
    
    
    const connectButton = document.getElementById('connectButton');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const walletBalance = document.getElementById('walletBalance');
    
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://dppas.rav.com.ng/tonconnect-manifest.json',
      buttonRootId: 'connectButton'
    });

    // Listen for wallet connection state changes
    tonConnectUI.onStatusChange(async (wallet) => {
        if (wallet && wallet.account) {
          // Wallet is connected
          walletAddress.textContent = wallet.account.address;
  
          // Fetch balance using TON API
          const balance = await fetchBalance(wallet.account.address); // Custom function to fetch balance
          walletBalance.textContent = (balance / 1e9).toFixed(4); // Convert from nanoton to TON
  
          walletInfo.classList.remove('hidden');
        } else {
          // Wallet is disconnected
          walletInfo.classList.add('hidden');
          walletAddress.textContent = '';
          walletBalance.textContent = '';
        }
      });


          // Example function to fetch balance using TON API
    async function fetchBalance(address) {
        try {
          const response = await fetch(`https://tonapi.io/v2/accounts/${address}`);
          const data = await response.json();
          return data.balance || 0; // Balance is returned in nanotons
        } catch (error) {
         console.error('Error fetching balance:', error);
          return 0;
      }
      }  

    /*
    const currentWallet = tonConnectUI.wallet;
    const currentWalletInfo = tonConnectUI.walletInfo;
    const currentAccount = tonConnectUI.account;
    const currentIsConnectedStatus = tonConnectUI.connected;
      */

    
    } catch (error) {
      Myapps.showAlert('Failed to connect wallet. Please try again.'+error)
    }
    
    
    });