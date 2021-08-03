import WolfIcon from "../../image/wolf.png";
import SnowIcon from "../../image/snow.png";
import EagleIcon from "../../image/eagle.png";
import BitcoinIcon from "../../image/bitcoin.png";
import EtherIcon from "../../image/ether.png";
import RPIcon from "../../image/icons/referral.svg";
import GoldIcon from "../../image/gold.png";
import React from "react";

export const DownloadIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z" />
      </g>
    </svg>
  );
};

export function LogoOfTokens({ type }) {
  let imageSrc;
  if (type === "WOLF") imageSrc = WolfIcon;
  if (type === "SNOW") imageSrc = SnowIcon;
  if (type === "EAGLE") imageSrc = EagleIcon;
  if (type === "BTC") imageSrc = BitcoinIcon;
  if (type === "ETH") imageSrc = EtherIcon;
  if (type === "RP") imageSrc = RPIcon;
  if (type === "GOLD") imageSrc = GoldIcon;
  return (
    <img
      src={imageSrc}
      alt="logo of bitcoin"
      className="w-8 h-8 rounded-full mr-3"
    />
  );
}
