import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { abi, WHITELIST_CONTRACT_ADDRESS } from "../constants";

export default function Home() {
  const [numWhitelisted, setNumWhitelisted] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const instance = await web3ModalRef.current.connect();
      const provider = new ethers.providers.Web3Provider(instance);

      const { chainId } = await provider.getNetwork();
      if (chainId !== 4) {
        window.alert("Connect to Rinkeby network");
        throw new Error("Connect to Rinkeby network");
      }
      const signer = await provider.getSigner();
      if (needSigner) {
        return signer;
      }
      return provider;
    } catch (error) {
      console.log(error);
    }
  };

  const getAddressWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new ethers.Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const txn = await whitelistContract.whitelistAddress();
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await getNumOfWhitelisted();
      setIsWhitelisted(true);
      console.log("hey");
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new ethers.Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const address = await signer.getAddress();
      const _isWhitelisted = await whitelistContract.whitelistedAddresses(
        address
      );
      setIsWhitelisted(_isWhitelisted);
    } catch (error) {
      console.log(error);
    }
  };

  const getNumOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new ethers.Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumWhitelisted(_numWhitelisted.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      console.log("Inside connectWallet ");
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumOfWhitelisted();
    } catch (error) {
      console.log(error);
    }
  };

  // render to get whitelisted
  const renderButton = () => {
    if (walletConnected) {
      if (isWhitelisted) {
        return (
          <div className={styles.description}>Thanks , you are whitelisted</div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={getAddressWhitelisted} className={styles.button}>
            Get Whitelisted
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connet Wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby", // optional
        disableInjectedProvider: false,
        providerOptions: {}, // required
      });
      // web3ModalRef.current.clearCachedProvider();

      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist Dapp" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Whitelist Dapp</h1>
          <div className={styles.description}>
            {numWhitelisted} users have been whitelisted!!
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./xyz.svg"></img>
        </div>
      </div>

      <footer className={styles.footer}></footer>
    </div>
  );
}
