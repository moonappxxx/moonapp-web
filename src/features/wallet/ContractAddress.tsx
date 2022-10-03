import React from "react";
import { Tooltip, Text, useClipboard } from "@chakra-ui/react";

import { shortenHex } from "../../utils/format";

import { Button } from "../../components/common/Button";

import styles from "./ContractAddress.module.scss";

const ContractAddress: React.FC<{ address: string }> = ({ address }) => {
  const { hasCopied, onCopy } = useClipboard(address);

  return (
    <Tooltip label={address} placement="right">
      <Text>
        Contract address:
        <Button
          className={styles["copy-contract"]}
          size="small"
          color="primary-outline"
          onClick={onCopy}
        >
          {hasCopied ? "Copied!" : shortenHex(address)}
        </Button>
      </Text>
    </Tooltip>
  );
};

export default ContractAddress;
