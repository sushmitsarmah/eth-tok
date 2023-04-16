import {
    FusionSDK,
    FusionSDKConfigParams,
    NetworkEnum,
    PrivateKeyProviderConnector
} from '@1inch/fusion-sdk';
import { useState } from 'react';

import { useAccount } from 'wagmi'

// const makerPrivateKey = '0x123....'
// const makerAddress = '0x123....'

interface SwapParams {
    makerAddress: string;
    from: string;
    to: string;
    amount: string;
    network: string;
}

const swapSdk = async ({ makerAddress, from, to, amount, network }: SwapParams) => {
    const obj: any = {
        eth: NetworkEnum.ETHEREUM,
        binance: NetworkEnum.BINANCE,
        polygon: NetworkEnum.POLYGON
    };

    const sdk = new FusionSDK({
        url: 'https://fusion.1inch.io',
        network: obj[network]
    } as FusionSDKConfigParams);;

    return sdk.placeOrder({
        fromTokenAddress: from, // WETH
        toTokenAddress: to, // USDC
        amount: `${amount}`, // 0.05 ETH
        walletAddress: makerAddress
    });
}

const Swap = () => {
    const { address, isConnected } = useAccount();
    const [fromAdd, setFrom] = useState<string>('');
    const [toAdd, setTo] = useState<string>('');
    const [amount, setAmount] = useState<string>('0.05');
    const [network, setNetwork] = useState<string>('eth');

    const swapTokens = async () => {
        const result = await swapSdk({
            makerAddress: address || '',
            from: fromAdd,
            to: toAdd,
            amount,
            network
        });
        alert(result);
        setFrom('');
        setTo('');
        setAmount('');
    };

    const networkTitle = (val: string) => {
        const obj: any = {
            eth: 'Ethereum Mainnet',
            binance: 'Binance Mainnet',
            polygon: 'Polygon Mainnet',
        };
        return obj[val];
    };

    return (
        <div>
            <h1 className='font-bold text-xl'>
                {isConnected ? `Swap tokens for ${address}` : 'Connect Wallet'}
            </h1>
            <form className='form flex flex-col gap-4'>
                <div className="dropdown dropdown-bottom">
                    <label tabIndex={0} className="btn m-1">{network ? networkTitle(network) : 'Select Network'}</label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li onClick={() => setNetwork('eth')}><a>Ethereum Mainnet</a></li>
                        <li onClick={() => setNetwork('binance')}><a>Binance Mainnet</a></li>
                        <li onClick={() => setNetwork('polygon')}><a>Polygon Mainnet</a></li>
                    </ul>
                </div>
                <input type="text"
                    disabled={!isConnected}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Enter From Token Address" className="input input-bordered w-full max-w-xs" />
                <input type="text"
                    disabled={!isConnected}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Enter To Token Address" className="input input-bordered w-full max-w-xs" />
                <input type="text"
                    disabled={!isConnected}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount" className="input input-bordered w-full max-w-xs" />

                <button
                    disabled={!isConnected}
                    className='btn btn-primary'
                    onClick={swapTokens}>Swap Tokens</button>
            </form>
        </div>
    )
};

export default Swap;