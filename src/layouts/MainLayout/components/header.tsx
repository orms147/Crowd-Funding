import { contractAddress } from "../../../contracts/contractData";
import "@reown/appkit-wallet-button/react";
import { SquareArrowOutUpRight  } from "lucide-react";
import { shortenAddress } from "../../../lib/utils";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

const Header = () => {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    return (    
    <header className="py-4 border-b border-gray-300">
        <div className="flex justify-between items-center gap-2.5">
            <div className="flex items-baseline gap-4">
                <h1 className="text-2xl font-bold">Crowdfunding</h1>
                <a href={`https://sepolia.etherscan.io/address/${contractAddress}`} 
                target="_blank"
                className="flex text-sm rounded-lg hover:bg-gray-200 transition duration-300 p-1 gap-1">
                    {shortenAddress(contractAddress)}
                    <SquareArrowOutUpRight  className="square-arrow-out-up-right w-4 h-4" />
                </a>
            </div>
            <button className="text-sm bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300
            " onClick={() => open()}>
            {isConnected ? `${shortenAddress(address)}` : "Connect Wallet"}
            </button>

        </div>
    </header>
    );
}

export default Header;