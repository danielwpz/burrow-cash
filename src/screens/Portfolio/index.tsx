import { Box, Typography, Skeleton, useTheme } from "@mui/material";

import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, TotalBRRR } from "../../components";
import Table from "../../components/Table";
import { suppliedColumns, borrowedColumns } from "./tabledata";
import { useAppSelector } from "../../redux/hooks";
import {
  getTotalAccountBalance,
  getPortfolioAssets,
  getNetAPY,
  getAccountId,
} from "../../redux/accountSelectors";
import { useLoading } from "../../hooks";

const Portfolio = () => {
  const theme = useTheme();
  const totalSuppliedBalance = useAppSelector(getTotalAccountBalance("supplied"));
  const totalBorroedBalance = useAppSelector(getTotalAccountBalance("borrowed"));
  const isLoading = useLoading();
  const [suppliedRows, borrowedRows] = useAppSelector(getPortfolioAssets);
  const netAPY = useAppSelector(getNetAPY);
  const accountId = useAppSelector(getAccountId);

  return (
    <Box pb="2.5rem">
      <InfoWrapper sx={{ gridTemplateColumns: "auto auto auto" }}>
        <InfoBox title="Your Deposits" value={isLoading ? undefined : totalSuppliedBalance} />
        <InfoBox title="Net APY" value={isLoading ? undefined : netAPY} />
        <InfoBox title="Your Borrows" value={isLoading ? undefined : totalBorroedBalance} />
      </InfoWrapper>
      {accountId && <TotalBRRR showAction />}
      <Typography sx={{ fontSize: 24, padding: "1rem", textAlign: "center" }}>
        <span style={{ color: theme.palette.primary.main }}>Deposited</span> Assets
      </Typography>
      {isLoading ? (
        <Skeleton sx={{ bgcolor: "gray", mx: "auto", maxWidth: 750 }} height={40} />
      ) : suppliedRows.length ? (
        <Table rows={suppliedRows} columns={suppliedColumns} />
      ) : (
        <div style={{ textAlign: "center" }}>No deposited assets yet</div>
      )}
      <Typography sx={{ fontSize: 24, padding: "1rem", marginTop: "2rem", textAlign: "center" }}>
        <span style={{ color: theme.palette.primary.main }}>Borrowed</span> Assets
      </Typography>
      {isLoading ? (
        <Skeleton sx={{ bgcolor: "gray", mx: "auto", maxWidth: 750 }} height={40} />
      ) : borrowedRows.length ? (
        <Table rows={borrowedRows} columns={borrowedColumns} />
      ) : (
        <div style={{ textAlign: "center" }}>No borrowed assets yet</div>
      )}
    </Box>
  );
};

export default Portfolio;
