import { useState } from "react";
import { Switch, Box } from "@mui/material";

import { ActionButton, ModalTitle, Rates, TokenBasicDetails, TokenInputs } from "../components";
import { TokenActionsInput } from "../types";
import { borrow, supply } from "../../../store/tokens";

const borrowRates = [
	{ value: "1.00%", title: "Borrow APY" },
	{ value: "2.00%", title: "Extra Rewards APY" },
	{ value: "3.00%", title: "Risk Factor" },
	{ value: "4.00%", title: "Limit Used" },
	{ value: "1,000,000", title: "Pool Liquidit" },
];

export const BorrowData: TokenActionsInput = {
	type: "Borrow",
	title: "Borrow",
	totalAmountTitle: "Borrow Amount",
	buttonText: "Borrow",
	rates: borrowRates,
	ratesTitle: "Rates",
	asset: {
		token_id: "wrap.testnet",
		amount: 2,
		name: "Token Name",
		symbol: "TSYL",
		valueInUSD: 5,
		apy: 10,
		canBeUsedAsCollateral: true,
	},
};

export const TokenActionsTemplate = (input: TokenActionsInput) => {
	const { title, asset, totalAmountTitle, buttonText, rates, ratesTitle, type } = input;
	const [amount, setAmount] = useState(0);
	const [useAsCollateral, setUseAsCollateral] = useState(false);

	const isDisabled = amount <= 0 || amount > asset.amount;

	return (
		<>
			<ModalTitle title={title} />
			<TokenBasicDetails tokenName={asset.name} icon={asset.icon} apy={asset.apy} />
			<TokenInputs
				availableTokens={asset.amount}
				tokenSymbol={asset.symbol}
				tokenPriceInUSD={asset.valueInUSD}
				totalAmountTitle={totalAmountTitle}
				onChange={(a) => setAmount(a)}
			/>
			<Rates rates={rates} ratesTitle={ratesTitle} />

			{type === "Supply" && asset.canBeUsedAsCollateral && (
				<Box px="1rem">
					Use as collateral
					<Switch onChange={(event) => setUseAsCollateral(event.target.checked)} />
				</Box>
			)}

			<ActionButton
				text={buttonText}
				isDisabled={isDisabled}
				onClick={() => {
					if (type === "Borrow") {
						void borrow(asset.token_id, amount);
					} else {
						void supply(asset.token_id, amount, useAsCollateral);
					}
				}}
			/>
		</>
	);
};