import {
    FusionSDK,
    NetworkEnum,
    PrivateKeyProviderConnector
} from '@1inch/fusion-sdk';
import { useState } from 'react';

import { useAccount } from 'wagmi'

// const makerPrivateKey = '0x123....'
// const makerAddress = '0x123....'

const sdk = new FusionSDK({
    url: 'https://fusion.1inch.io',
    network: NetworkEnum.ETHEREUM
})

const swapSdk = async ({ makerAddress, from, to, amount }: any) => {
    return sdk.placeOrder({
        fromTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
        toTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        amount: '50000000000000000', // 0.05 ETH
        walletAddress: makerAddress
    });
}

const Swap = () => {
    const { address, isConnected } = useAccount();
    const [fromAdd, setFrom] = useState<string>('');
    const [toAdd, setTo] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const swapTokens = async () => {
        const result = await swapSdk({
            makerAddress: address,
            from: fromAdd,
            to: toAdd,
            amount
        });
        alert(result);
        setFrom('');
        setTo('');
        setAmount('');
    };

    return (
        <div>
            <h1 className='font-bold text-xl'>Swap tokens for {address}</h1>
            <form className='form flex flex-col gap-4'>
                <input type="text"
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Enter From Token Address" className="input input-bordered w-full max-w-xs" />
                <input type="text"
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Enter To Token Address" className="input input-bordered w-full max-w-xs" />
                <input type="text"
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount" className="input input-bordered w-full max-w-xs" />

                <button className='btn btn-primary' onClick={swapTokens}>Swap Tokens</button>
            </form>
        </div>
    )
};

export default Swap;