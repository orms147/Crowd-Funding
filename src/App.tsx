import { createAppKit } from "@reown/appkit/react";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, formatEther, parseEther} from "ethers";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { contractAddress, contractABI } from "./contracts/contractData";
import { arbitrum, mainnet } from "@reown/appkit/networks";
import "@reown/appkit-wallet-button/react";
import { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Card from "./components/Card";


// 1. Get projectId
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
// Thêm cấu hình mạng Sepolia
const sepolia = {
    id: 11155111,
    name: 'Ethereum Sepolia',
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_ETH_SEPOLIA_RPC_URL],
      },
    },
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://sepolia.etherscan.io',
      },
    },
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18,
    },
  }
  

// 2. Set the networks
const networks = [mainnet, arbitrum, sepolia]

// 3. Create a metadata object - optional
const metadata = {
    name: "Crowdfunding Interface",
    description: "My Website helper using Crowdfunding",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create a AppKit instance
createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
});

function App() {
    const { walletProvider } = useAppKitProvider("eip155");
    const { isConnected } = useAppKitAccount();
    const [crowdfundingBal, setCrowdfundingBal] = useState<string|null>(null);
    const [fundersCounter, setFundersCounter] = useState<number|null>(null);
    const [amountFund, setAmountFund] = useState<number|null>(null);
    //console.log(amountFund);
    
    const fetchContractData = async () => {
      if (!isConnected) throw Error("User disconnected");
      if (!walletProvider) throw new Error("Wallet provider not found");

      const ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const contract = new Contract(contractAddress, contractABI, ethersProvider);
      const contractBalance = await ethersProvider.getBalance(contractAddress);
      const resFundersCounter = await contract.getFundersLength();
      //console.log(formatEther(resFundersCounter));
      setFundersCounter(Number(resFundersCounter));
      setCrowdfundingBal(formatEther(contractBalance));
                         //convert bigint to ether   
    }

    const handleFund = async () => {
      if (!isConnected) throw Error("User disconnected");
      if (!walletProvider) throw new Error("Wallet provider not found");
      if (amountFund === null || amountFund <= 0) {
        alert("Invalid amount");
        return;
      }

      const ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const signer = await ethersProvider.getSigner();  //Write contract
      const contract = new Contract(contractAddress, contractABI, signer);
      const tx = await contract.fund({value: parseEther(String(amountFund))});
      await tx.wait();
      fetchContractData();
    }
    
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmountFund(Number(e.target.value));
    }

    useEffect(() => {
      fetchContractData();////
    }, [walletProvider]);

  return (
    <MainLayout>
      <div className="flex justify-start items-center pt-4">
        <div className="flex flex-col space-y-2 w-[30%]">
          <Card>
            <h2 className="text-xl font-semibold mt-2">Total Crowdfunding</h2>
            <p className=" text-2xl font-bold mt-2">
              {crowdfundingBal} <span className="text-base">ETH</span> 
              <span className="text-sm font-normal"> ~ 1,000,000 SIU</span>
            </p>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold mt-2">Funders</h2>
            <p className=" mt-2 font-bold">{fundersCounter}</p>
          </Card>
        </div>
        <div className="flex flex-col space-y-2 w-[70%] ml-4">              
          <div className="p-6 bg-white shadow-lg rounded-2xl space-y-4">
            <h2 className="text-xl font-semibold">Donate Ether</h2>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="amount"
                className="w-32 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                onChange={onInputChange}
              />
              <button
                onClick={handleFund}
                className="px-5 py-2 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all"
              >
                Fund
              </button>
            </div>
          </div>
        </div>
      </div>

    </MainLayout>
    
  )
}

export default App


