"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const connectWallet = async () => {
    console.log("Кнопка 'Подключить Phantom Wallet' нажата"); // Логируем первый клик

    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
      if (isMobile) {
        const dappUrl = window.location.href;
        const phantomUrl = `phantom://connect?redirect_link=${encodeURIComponent(dappUrl)}`;
  
        console.log("dappUrl:", dappUrl);
        console.log("phantomUrl:", phantomUrl);
  
        if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")) {
          const appStoreUrl = "https://apps.apple.com/app/phantom-solana-wallet/id1598432977";
          const finalUrl = `${phantomUrl}&appstore=${encodeURIComponent(appStoreUrl)}`;
          console.log("iOS final deep link:", finalUrl);
          window.location.href = finalUrl;
        } else {
          const playStoreUrl = "https://play.google.com/store/apps/details?id=app.phantom";
          const finalUrl = `${phantomUrl}&playstore=${encodeURIComponent(playStoreUrl)}`;
          console.log("Android final deep link:", finalUrl);
          window.location.href = finalUrl;
        }
        return;
      }
  
      // Для десктопа (если вдруг тестируете)
      if (!window.phantom?.solana?.isPhantom) {
        alert("Пожалуйста, установите Phantom кошелек!");
        window.open("https://phantom.app/", "_blank");
        return;
      }
  
      const response = await window.phantom.solana.connect();
      const publicKey = response.publicKey.toString();
      console.log("Phantom connect response:", response);
      setWalletAddress(publicKey);
    } catch (error) {
      console.error("connectWallet error:", error);
      setErrorMessage("Ошибка при подключении кошелька: " + error.message);
      alert("Ошибка при подключении кошелька: " + error.message);
    }
  };

  // Обработка возврата из приложения Phantom
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("URL параметры после возврата из Phantom:", Array.from(params.entries()));
    const walletParam = params.get("public_key") || params.get("phantom_wallet_address");
    if (walletParam) {
      setWalletAddress(walletParam);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <button
        onClick={connectWallet}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        {walletAddress ? "Кошелек подключен" : "Подключить Phantom Wallet"}
      </button>
  
      {walletAddress && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Адрес кошелька:</p>
          <p className="font-mono break-all">{walletAddress}</p>
        </div>
      )}
  
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 text-red-600 rounded">
          {errorMessage}
        </div>
      )}
    </main>
  );
}
