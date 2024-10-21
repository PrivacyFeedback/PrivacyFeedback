import { OasisSapphireTestnet } from "./OasisSapphireTestnet";
import { ethers, verifyMessage, Wallet } from "ethers";
import contractABI from "./contractABI.json" assert { type: "json" };
const contractAddress = "0xb41175aa3ff245c29BE0EC53AB37c8c319259daA";

let Contract: ethers.Contract | null = null;

if (!process.env.PRIVATE_KEY) {
    throw new Error('Invalid/Missing environment variable: "PRIVATE_KEY"')
}

export default async function GetContract(){
    if (Contract == null) {
        const url = OasisSapphireTestnet.rpcUrls.public.http[0];
        const privateKey = '0x' + process.env.PRIVATE_KEY;
        const signer = await new ethers.Wallet(privateKey);
        const provider = await new ethers.JsonRpcProvider(url);
        const wallet = signer.connect(provider);
        console.log(signer.address);
        Contract = new ethers.Contract(contractAddress, contractABI, wallet);
    }
    return Contract;
}