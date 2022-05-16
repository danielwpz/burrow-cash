import { getAccountPortfolio } from "../redux/accountSelectors";
import { getConfig } from "../redux/appSelectors";
import { getAssets } from "../redux/assetsSelectors";
import { useAppSelector } from "../redux/hooks";
import { computeDailyAmount } from "../redux/selectors/getAccountRewards";
import { getGains } from "../redux/selectors/getNetAPY";
import { getStaking } from "../redux/selectors/getStaking";

export function useExtraAPY() {
  const { xBRRR, extraXBRRRAmount } = useAppSelector(getStaking);
  const portfolio = useAppSelector(getAccountPortfolio);
  const appConfig = useAppSelector(getConfig);
  const assets = useAppSelector(getAssets);

  const getExtraAPY = (
    type: "supplied" | "borrowed",
    tokenId: string,
    rewardTokenId: string,
    isStaking = false,
  ) => {
    const asset = assets.data[tokenId];
    const rewardAsset = assets.data[rewardTokenId];
    const farmData = portfolio.farms?.[type]?.[tokenId]?.[rewardTokenId];

    if (!farmData) return 0;

    const { dailyAmount, newDailyAmount } = computeDailyAmount(
      type,
      asset,
      rewardAsset,
      portfolio,
      xBRRR + extraXBRRRAmount,
      farmData,
      appConfig.booster_decimals,
    );

    const [, totalCollateral] = getGains(portfolio, assets, "collateral");
    const [, totalSupplied] = getGains(portfolio, assets, "supplied");
    const [, totalBorrowed] = getGains(portfolio, assets, "borrowed");

    const totalAmount = type === "supplied" ? totalSupplied + totalCollateral : totalBorrowed;
    const price = asset?.price?.usd || 0;
    const amount = isStaking ? newDailyAmount : dailyAmount;
    const apy = ((amount * price * 365) / totalAmount) * 100;

    return apy;
  };

  return getExtraAPY;
}
